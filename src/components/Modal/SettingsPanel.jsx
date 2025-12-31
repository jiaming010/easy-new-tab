import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Upload, Trash2 } from 'lucide-react';
import { iconCache } from '../../utils/iconCache';

export default function SettingsPanel({
                                          isOpen,
                                          onClose,
                                          background,
                                          onBackgroundChange,
                                          searchEngine,
                                          onSearchEngineChange,
                                          apps,
                                          dockApps,
                                          onImportConfig
                                      }) {
    const [bgInput, setBgInput] = useState(background);
    const [cacheStats, setCacheStats] = useState({ count: 0, expiryDays: 7 });

    useEffect(() => {
        setBgInput(background);
        if (isOpen) {
            iconCache.getStats().then(stats => {
                setCacheStats(stats);
            });
        }
    }, [background, isOpen]);

    const handleSave = () => {
        onBackgroundChange(bgInput);
        onClose();
    };

    const handleExport = () => {
        const config = {
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            data: {
                apps,
                dockApps,
                background,
                searchEngine
            }
        };

        const dataStr = JSON.stringify(config, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `easy-new-tab-config-${new Date().getTime()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);

                if (!config.data || !config.data.apps) {
                    alert('配置文件格式错误！');
                    return;
                }

                if (confirm('导入配置将覆盖当前所有设置，确定要继续吗？')) {
                    onImportConfig(config.data);
                    alert('配置导入成功！');
                    onClose();
                }
            } catch (error) {
                alert('配置文件解析失败！请确保文件格式正确。');
                console.error('导入错误:', error);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const handleClearCache = async () => {
        if (confirm('确定要清除所有图标缓存吗？清除后图标将重新加载。')) {
            try {
                await iconCache.clear();
                const stats = await iconCache.getStats();
                setCacheStats(stats);
                alert('缓存已清除！页面刷新后图标将重新加载。');
            } catch (error) {
                alert('清除缓存失败，请重试。');
                console.error('清除缓存错误:', error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">设置</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">背景图片 URL</label>
                        <input
                            type="url"
                            value={bgInput}
                            onChange={(e) => setBgInput(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">搜索引擎</label>
                        <select
                            value={searchEngine}
                            onChange={(e) => onSearchEngineChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="google">Google</option>
                            <option value="bing">Bing</option>
                            <option value="baidu">百度</option>
                            <option value="duckduckgo">DuckDuckGo</option>
                        </select>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-3">配置管理</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleExport}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                            >
                                <Download size={18} />
                                <span>导出配置</span>
                            </button>
                            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors cursor-pointer">
                                <Upload size={18} />
                                <span>导入配置</span>
                                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            导出：备份所有应用和设置 | 导入：从文件恢复配置
                        </p>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-3">图标缓存</label>
                        <div className="bg-blue-50 rounded-xl p-4 mb-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">已缓存图标数量</span>
                                <span className="font-bold text-blue-600">{cacheStats.count} 个</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-2">
                                <span className="text-gray-600">缓存有效期</span>
                                <span className="font-bold text-green-600">永久</span>
                            </div>
                        </div>
                        <button
                            onClick={handleClearCache}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                        >
                            <Trash2 size={18} />
                            <span>清除图标缓存</span>
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                            清除缓存后，所有图标将从服务器重新加载高清版本
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                        >
                            保存
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}