import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Download, Trash2, Upload, X } from 'lucide-react';
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
        if (isOpen) iconCache.getStats().then(setCacheStats);
    }, [isOpen]);

    const handleSave = () => {
        onBackgroundChange(bgInput);
        onClose();
    };

    const handleExport = () => {
        const config = {
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            data: { apps, dockApps, background, searchEngine }
        };
        const dataBlob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `easy-new-tab-config-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (readerEvent) => {
            try {
                const config = JSON.parse(readerEvent.target.result);
                if (!config.data || !config.data.apps) {
                    alert('配置文件格式不正确。');
                    return;
                }
                if (confirm('导入配置会覆盖当前设置，确定继续吗？')) {
                    onImportConfig(config.data);
                    alert('配置导入成功。');
                    onClose();
                }
            } catch (error) {
                alert('配置文件解析失败，请检查文件格式。');
                console.error('导入配置失败:', error);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const handleClearCache = async () => {
        if (!confirm('确定要清除所有图标缓存吗？')) return;
        try {
            await iconCache.clear();
            setCacheStats(await iconCache.getStats());
            alert('图标缓存已清除。');
        } catch (error) {
            alert('清除缓存失败，请重试。');
            console.error('清除缓存失败:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md"
            onClick={onClose}
        >
            <Motion.div
                initial={{ scale: 0.96, y: 18, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.96, y: 18, opacity: 0 }}
                onClick={(event) => event.stopPropagation()}
                className="modal-content max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/50 bg-white/95 p-6 text-slate-900 shadow-2xl backdrop-blur-2xl"
            >
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">设置</h2>
                        <p className="mt-1 text-sm text-slate-500">背景、搜索和数据管理</p>
                    </div>
                    <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200" title="关闭">
                        <X size={22} />
                    </button>
                </div>

                <div className="space-y-6">
                    <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">背景图片 URL</span>
                        <input
                            type="url"
                            value={bgInput}
                            onChange={(event) => setBgInput(event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-slate-900"
                            placeholder="https://example.com/image.jpg"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">默认搜索引擎</span>
                        <select
                            value={searchEngine}
                            onChange={(event) => onSearchEngineChange(event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-slate-900"
                        >
                            <option value="google">Google</option>
                            <option value="bing">Bing</option>
                            <option value="baidu">百度</option>
                            <option value="duckduckgo">DuckDuckGo</option>
                        </select>
                    </label>

                    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <h3 className="text-sm font-semibold text-slate-800">配置管理</h3>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <button onClick={handleExport} className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                                <Download size={18} />
                                导出
                            </button>
                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-100">
                                <Upload size={18} />
                                导入
                                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                            </label>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">已缓存图标</span>
                            <span className="font-bold text-slate-900">{cacheStats.count} 个</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm">
                            <span className="text-slate-500">缓存有效期</span>
                            <span className="font-bold text-emerald-600">永久</span>
                        </div>
                        <button onClick={handleClearCache} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600">
                            <Trash2 size={18} />
                            清除图标缓存
                        </button>
                    </section>

                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
                            取消
                        </button>
                        <button onClick={handleSave} className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                            保存
                        </button>
                    </div>
                </div>
            </Motion.div>
        </Motion.div>
    );
}
