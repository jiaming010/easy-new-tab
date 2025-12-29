// Chrome Storage API 封装
export const storage = {
    // 获取数据
    async get(key, defaultValue = null) {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                return new Promise((resolve) => {
                    chrome.storage.local.get([key], (result) => {
                        resolve(result[key] !== undefined ? result[key] : defaultValue);
                    });
                });
            } else {
                // 开发环境使用 localStorage
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : defaultValue;
            }
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },

    // 保存数据
    async set(key, value) {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                return new Promise((resolve) => {
                    chrome.storage.local.set({ [key]: value }, () => {
                        resolve();
                    });
                });
            } else {
                // 开发环境使用 localStorage
                localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.error('Storage set error:', error);
        }
    },

    // 删除数据
    async remove(key) {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                return new Promise((resolve) => {
                    chrome.storage.local.remove([key], () => {
                        resolve();
                    });
                });
            } else {
                // 开发环境使用 localStorage
                localStorage.removeItem(key);
            }
        } catch (error) {
            console.error('Storage remove error:', error);
        }
    }
};

// 存储键名常量
export const STORAGE_KEYS = {
    APPS: 'easy_new_tab_apps',
    DOCK_APPS: 'easy_new_tab_dock_apps',
    BACKGROUND: 'easy_new_tab_background',
    SEARCH_ENGINE: 'easy_new_tab_search_engine',
};

