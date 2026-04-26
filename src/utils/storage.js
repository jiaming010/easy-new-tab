export const storage = {
    async get(key, defaultValue = null) {
        try {
            if (globalThis.chrome?.storage) {
                return new Promise((resolve) => {
                    globalThis.chrome.storage.local.get([key], (result) => {
                        resolve(result[key] !== undefined ? result[key] : defaultValue);
                    });
                });
            }

            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },

    async set(key, value) {
        try {
            if (globalThis.chrome?.storage) {
                return new Promise((resolve) => {
                    globalThis.chrome.storage.local.set({ [key]: value }, () => {
                        resolve();
                    });
                });
            }

            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage set error:', error);
        }
    },

    async remove(key) {
        try {
            if (globalThis.chrome?.storage) {
                return new Promise((resolve) => {
                    globalThis.chrome.storage.local.remove([key], () => {
                        resolve();
                    });
                });
            }

            localStorage.removeItem(key);
        } catch (error) {
            console.error('Storage remove error:', error);
        }
    }
};

export const STORAGE_KEYS = {
    APPS: 'easy_new_tab_apps',
    DOCK_APPS: 'easy_new_tab_dock_apps',
    BACKGROUND: 'easy_new_tab_background',
    SEARCH_ENGINE: 'easy_new_tab_search_engine',
};
