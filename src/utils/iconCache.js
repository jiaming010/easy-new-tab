// 图标缓存管理系统 - 使用 IndexedDB 存储高清图标
const DB_NAME = 'IconCacheDB';
const DB_VERSION = 1;
const STORE_NAME = 'icons';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7天过期

class IconCache {
    constructor() {
        this.db = null;
        this.initDB();
    }

    // 初始化 IndexedDB
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('IndexedDB 打开失败:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'domain' });
                    objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    // 确保数据库已初始化
    async ensureDB() {
        if (!this.db) {
            await this.initDB();
        }
        return this.db;
    }

    // 从缓存获取图标
    async get(domain) {
        try {
            await this.ensureDB();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([STORE_NAME], 'readonly');
                const objectStore = transaction.objectStore(STORE_NAME);
                const request = objectStore.get(domain);

                request.onsuccess = () => {
                    const result = request.result;
                    if (result) {
                        // 所有图标永不过期
                        resolve(result.dataUrl);
                    } else {
                        resolve(null);
                    }
                };

                request.onerror = () => {
                    console.error('读取缓存失败:', request.error);
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('获取缓存图标失败:', error);
            return null;
        }
    }

    // 保存图标到缓存
    async set(domain, dataUrl, isCustom = false) {
        try {
            await this.ensureDB();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([STORE_NAME], 'readwrite');
                const objectStore = transaction.objectStore(STORE_NAME);
                const data = {
                    domain,
                    dataUrl,
                    timestamp: Date.now(),
                    isCustom // 标记是否为用户自定义上传
                };
                const request = objectStore.put(data);

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = () => {
                    console.error('保存缓存失败:', request.error);
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('缓存图标失败:', error);
        }
    }

    // 删除缓存
    async delete(domain) {
        try {
            await this.ensureDB();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([STORE_NAME], 'readwrite');
                const objectStore = transaction.objectStore(STORE_NAME);
                const request = objectStore.delete(domain);

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = () => {
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('删除缓存失败:', error);
        }
    }

    // 清空所有缓存
    async clear() {
        try {
            await this.ensureDB();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([STORE_NAME], 'readwrite');
                const objectStore = transaction.objectStore(STORE_NAME);
                const request = objectStore.clear();

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = () => {
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('清空缓存失败:', error);
        }
    }

    // 获取缓存统计信息
    async getStats() {
        try {
            await this.ensureDB();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([STORE_NAME], 'readonly');
                const objectStore = transaction.objectStore(STORE_NAME);
                const request = objectStore.count();

                request.onsuccess = () => {
                    resolve({
                        count: request.result,
                        expiryDays: Math.floor(CACHE_EXPIRY / (24 * 60 * 60 * 1000))
                    });
                };

                request.onerror = () => {
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('获取缓存统计失败:', error);
            return { count: 0, expiryDays: 7 };
        }
    }
}

// 创建单例
export const iconCache = new IconCache();

// 获取高清图标（带缓存）- 使用 Google S2 Converter API
export async function fetchIconWithCache(url, options = {}) {
    const { timeout = 8000 } = options;
    
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;

        // 1. 先检查缓存
        const cachedIcon = await iconCache.get(domain);
        if (cachedIcon) {
            return cachedIcon;
        }

        // 2. 使用 Google S2 Converter API 获取高清图标
        // 优势：Google 官方服务，支持指定高清尺寸（size=256），图标质量更好
        // 注意：直接返回 URL 而不是 dataURL，避免 CORS 问题
        const iconUrl = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=256`;

        try {
            // 验证图片是否可访问
            const isValid = await validateImageUrl(iconUrl, timeout);
            if (isValid) {
                // 保存 URL 到缓存（不转换为 dataURL，避免 CORS 问题）
                await iconCache.set(domain, iconUrl, false);
                return iconUrl;
            }
        } catch (error) {
            console.log(`Google S2 Converter 获取失败: ${domain}`, error);
        }

        // 3. 获取失败，返回 null（调用方会显示文字图标）
        return null;
    } catch (error) {
        console.error('获取图标失败:', error);
        return null;
    }
}

// 验证图片 URL 是否可访问（不转换为 dataURL，避免 CORS 问题）
function validateImageUrl(url, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        // 不设置 crossOrigin，因为我们只需要验证图片是否可加载
        
        const timeoutId = setTimeout(() => {
            img.src = '';
            reject(new Error('加载超时'));
        }, timeout);

        img.onload = () => {
            clearTimeout(timeoutId);
            resolve(true);
        };

        img.onerror = () => {
            clearTimeout(timeoutId);
            reject(new Error('加载失败'));
        };

        img.src = url;
    });
}

// 加载图片并转换为 Data URL（用于自定义图标上传）
function loadImageAsDataUrl(url, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        const timeoutId = setTimeout(() => {
            img.src = '';
            reject(new Error('加载超时'));
        }, timeout);

        img.onload = () => {
            clearTimeout(timeoutId);
            try {
                // 创建 canvas 来获取 data URL
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth || img.width;
                canvas.height = img.naturalHeight || img.height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                const dataUrl = canvas.toDataURL('image/png');
                resolve(dataUrl);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = () => {
            clearTimeout(timeoutId);
            reject(new Error('加载失败'));
        };

        img.src = url;
    });
}

// 预加载图标（批量）
export async function preloadIcons(urls) {
    const promises = urls.map(url => fetchIconWithCache(url));
    const results = await Promise.allSettled(promises);
    return results.map((result, index) => ({
        url: urls[index],
        success: result.status === 'fulfilled',
        dataUrl: result.status === 'fulfilled' ? result.value : null // 返回图标 URL
    }));
}

// 上传自定义图片并缓存（永不过期）
export async function uploadCustomIcon(file, appId) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('没有选择文件'));
            return;
        }

        // 检查文件类型
        if (!file.type.startsWith('image/')) {
            reject(new Error('请上传图片文件'));
            return;
        }

        // 检查文件大小（限制5MB）
        if (file.size > 5 * 1024 * 1024) {
            reject(new Error('图片大小不能超过5MB'));
            return;
        }

        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const dataUrl = e.target.result;
                
                // 压缩图片到合适尺寸
                const compressedDataUrl = await compressImage(dataUrl, 256, 256);
                
                // 保存到缓存（标记为自定义，永不过期）
                await iconCache.set(`custom_${appId}`, compressedDataUrl, true);
                
                resolve(compressedDataUrl);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error('文件读取失败'));
        };

        reader.readAsDataURL(file);
    });
}

// 压缩图片到指定尺寸（正方形裁剪，适合铺满显示）
function compressImage(dataUrl, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
            try {
                const size = Math.min(maxWidth, maxHeight); // 统一尺寸为正方形
                
                // 创建 canvas 进行压缩
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                
                const ctx = canvas.getContext('2d');
                
                // 计算裁剪参数（居中裁剪）
                const sourceSize = Math.min(img.width, img.height);
                const sourceX = (img.width - sourceSize) / 2;
                const sourceY = (img.height - sourceSize) / 2;
                
                // 绘制图片（居中裁剪为正方形）
                ctx.drawImage(
                    img,
                    sourceX, sourceY, sourceSize, sourceSize,  // 源图裁剪
                    0, 0, size, size  // 目标画布
                );
                
                // 转换为 Data URL
                const compressedDataUrl = canvas.toDataURL('image/png', 0.9);
                resolve(compressedDataUrl);
            } catch (error) {
                reject(error);
            }
        };
        
        img.onerror = () => {
            reject(new Error('图片加载失败'));
        };
        
        img.src = dataUrl;
    });
}

