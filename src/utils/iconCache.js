const DB_NAME = 'IconCacheDB';
const DB_VERSION = 1;
const STORE_NAME = 'icons';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000;
const FAVICON_SIZE = 256;

class IconCache {
    constructor() {
        this.db = null;
        this.initPromise = this.initDB();
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('Failed to open IndexedDB:', request.error);
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

    async ensureDB() {
        if (!this.db) {
            await this.initPromise;
        }
        return this.db;
    }

    async get(domain) {
        try {
            await this.ensureDB();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([STORE_NAME], 'readonly');
                const objectStore = transaction.objectStore(STORE_NAME);
                const request = objectStore.get(domain);

                request.onsuccess = () => {
                    resolve(request.result?.dataUrl || null);
                };

                request.onerror = () => {
                    console.error('Failed to read icon cache:', request.error);
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Failed to get cached icon:', error);
            return null;
        }
    }

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
                    isCustom
                };
                const request = objectStore.put(data);

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = () => {
                    console.error('Failed to write icon cache:', request.error);
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('Failed to cache icon:', error);
        }
    }

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
            console.error('Failed to delete icon cache:', error);
        }
    }

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
            console.error('Failed to clear icon cache:', error);
        }
    }

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
            console.error('Failed to read icon cache stats:', error);
            return { count: 0, expiryDays: 7 };
        }
    }
}

export const iconCache = new IconCache();

export async function fetchIconWithCache(url, options = {}) {
    const { timeout = 8000 } = options;

    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        const cachedIcon = await iconCache.get(domain);

        if (isCachedImageData(cachedIcon)) {
            return cachedIcon;
        }

        if (cachedIcon) {
            await iconCache.delete(domain);
        }

        const iconUrl = buildGoogleFaviconUrl(domain);
        const dataUrl = await fetchImageAsDataUrl(iconUrl, timeout);

        await iconCache.set(domain, dataUrl, false);
        return dataUrl;
    } catch (error) {
        console.error('Failed to fetch icon:', error);
        return null;
    }
}

function buildGoogleFaviconUrl(domain) {
    const params = new URLSearchParams({
        client: 'SOCIAL',
        type: 'FAVICON',
        fallback_opts: 'TYPE,SIZE,URL',
        url: `https://${domain}`,
        size: String(FAVICON_SIZE)
    });

    return `https://t2.gstatic.com/faviconV2?${params.toString()}`;
}

function isCachedImageData(value) {
    return typeof value === 'string' && value.startsWith('data:image/');
}

async function fetchImageAsDataUrl(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            cache: 'force-cache'
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const blob = await response.blob();
        if (!blob.type.startsWith('image/') || blob.size === 0) {
            throw new Error('Response is not a valid image');
        }

        return await blobToDataUrl(blob);
    } finally {
        clearTimeout(timeoutId);
    }
}

function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error || new Error('Failed to read image'));
        reader.readAsDataURL(blob);
    });
}

export async function preloadIcons(urls) {
    const results = await Promise.allSettled(urls.map(url => fetchIconWithCache(url)));
    return results.map((result, index) => ({
        url: urls[index],
        success: result.status === 'fulfilled' && Boolean(result.value),
        dataUrl: result.status === 'fulfilled' ? result.value : null
    }));
}

export async function uploadCustomIcon(file, appId) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file selected'));
            return;
        }

        if (!file.type.startsWith('image/')) {
            reject(new Error('Please upload an image file'));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            reject(new Error('Image size cannot exceed 5MB'));
            return;
        }

        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const dataUrl = event.target.result;
                const compressedDataUrl = await compressImage(dataUrl, FAVICON_SIZE, FAVICON_SIZE);

                await iconCache.set(`custom_${appId}`, compressedDataUrl, true);
                resolve(compressedDataUrl);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
}

function compressImage(dataUrl, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            try {
                const size = Math.min(maxWidth, maxHeight);
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;

                const ctx = canvas.getContext('2d');
                const sourceSize = Math.min(img.width, img.height);
                const sourceX = (img.width - sourceSize) / 2;
                const sourceY = (img.height - sourceSize) / 2;

                ctx.drawImage(
                    img,
                    sourceX, sourceY, sourceSize, sourceSize,
                    0, 0, size, size
                );

                resolve(canvas.toDataURL('image/png', 0.9));
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };

        img.src = dataUrl;
    });
}
