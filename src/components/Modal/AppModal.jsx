import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Globe, Save, Upload, X } from 'lucide-react';
import { colorPresets, iconLibrary } from '../../utils/iconLibrary';
import { uploadCustomIcon } from '../../utils/iconCache';

export default function AppModal({ isOpen, onClose, onSave, editingApp, isFolder = false, folders = [] }) {
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        iconName: 'Globe',
        color: 'bg-blue-500 text-white',
        type: isFolder ? 'folder' : 'app',
        apps: [],
        parentFolderId: null,
        useFavicon: true,
        customIcon: null,
        useCustomIcon: false
    });
    const [uploadingIcon, setUploadingIcon] = useState(false);
    const [customIconPreview, setCustomIconPreview] = useState(null);

    useEffect(() => {
        if (editingApp) {
            setFormData({
                ...editingApp,
                useFavicon: editingApp.useFavicon || false,
                customIcon: editingApp.customIcon || null,
                useCustomIcon: editingApp.useCustomIcon || false
            });
            setCustomIconPreview(editingApp.customIcon || null);
        } else {
            setFormData({
                name: '',
                url: '',
                iconName: 'Globe',
                color: 'bg-blue-500 text-white',
                type: isFolder ? 'folder' : 'app',
                apps: [],
                parentFolderId: null,
                useFavicon: true,
                customIcon: null,
                useCustomIcon: false
            });
            setCustomIconPreview(null);
        }
    }, [editingApp, isFolder, isOpen]);

    const handleCustomIconUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploadingIcon(true);
        try {
            const tempId = editingApp?.id || Date.now().toString();
            const dataUrl = await uploadCustomIcon(file, tempId);
            setFormData({ ...formData, customIcon: dataUrl, useCustomIcon: true, useFavicon: false });
            setCustomIconPreview(dataUrl);
        } catch (error) {
            alert(error.message || '图片上传失败，请重试。');
            console.error('上传图片失败:', error);
        } finally {
            setUploadingIcon(false);
            event.target.value = '';
        }
    };

    const handleCustomIconUrl = async (imageUrl) => {
        if (!imageUrl.trim()) {
            alert('请输入图片 URL。');
            return;
        }

        setUploadingIcon(true);
        try {
            const tempId = editingApp?.id || Date.now().toString();
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], 'icon.png', { type: blob.type });
            const dataUrl = await uploadCustomIcon(file, tempId);
            setFormData({ ...formData, customIcon: dataUrl, useCustomIcon: true, useFavicon: false });
            setCustomIconPreview(dataUrl);
        } catch (error) {
            alert('图片 URL 加载失败，请检查地址。');
            console.error('加载 URL 图片失败:', error);
        } finally {
            setUploadingIcon(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave(formData);
        onClose();
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
                        <h2 className="text-2xl font-bold">{editingApp ? '编辑' : '添加'}{isFolder ? '文件夹' : '应用'}</h2>
                        <p className="mt-1 text-sm text-slate-500">{isFolder ? '整理一组快捷方式' : '保存一个常用网站入口'}</p>
                    </div>
                    <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200" title="关闭">
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">名称</span>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-slate-900"
                            placeholder="输入名称"
                            required
                        />
                    </label>

                    {!isFolder && (
                        <>
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">网址</span>
                                <input
                                    type="url"
                                    value={formData.url}
                                    onChange={(event) => setFormData({ ...formData, url: event.target.value })}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-slate-900"
                                    placeholder="https://example.com"
                                    required
                                />
                            </label>

                            <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                                <div className="mb-3 text-sm font-semibold text-slate-700">自定义图标</div>
                                {customIconPreview ? (
                                    <div className="flex items-center gap-4">
                                        <img src={customIconPreview} alt="图标预览" className="h-20 w-20 rounded-2xl object-cover shadow-md" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-emerald-600">已使用自定义图标</p>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, customIcon: null, useCustomIcon: false });
                                                    setCustomIconPreview(null);
                                                }}
                                                className="mt-2 text-sm font-semibold text-red-500 hover:text-red-600"
                                            >
                                                移除图标
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                                            <Upload size={18} />
                                            {uploadingIcon ? '处理中...' : '上传图片文件'}
                                            <input type="file" accept="image/*" onChange={handleCustomIconUpload} className="hidden" disabled={uploadingIcon} />
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                placeholder="粘贴图片 URL"
                                                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900"
                                                disabled={uploadingIcon}
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter') {
                                                        event.preventDefault();
                                                        handleCustomIconUrl(event.currentTarget.value);
                                                        event.currentTarget.value = '';
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    const input = event.currentTarget.previousElementSibling;
                                                    handleCustomIconUrl(input.value);
                                                    input.value = '';
                                                }}
                                                disabled={uploadingIcon}
                                                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:opacity-50"
                                            >
                                                加载
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>

                            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                                <div className="flex min-w-0 items-center gap-3">
                                    <Globe size={20} className="shrink-0 text-slate-500" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">使用网站 Logo</p>
                                        <p className="text-xs text-slate-500">自动获取站点高清图标</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, useFavicon: !formData.useFavicon, useCustomIcon: false })}
                                    className={`relative h-7 w-12 rounded-full transition ${formData.useFavicon && !formData.useCustomIcon ? 'bg-slate-900' : 'bg-slate-300'}`}
                                    disabled={formData.useCustomIcon}
                                >
                                    <span className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition ${formData.useFavicon && !formData.useCustomIcon ? 'translate-x-5' : ''}`} />
                                </button>
                            </div>
                        </>
                    )}

                    {!formData.useFavicon && !formData.useCustomIcon && (
                        <>
                            <section>
                                <div className="mb-2 text-sm font-semibold text-slate-700">图标</div>
                                <div className="grid max-h-40 grid-cols-6 gap-2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2">
                                    {Object.keys(iconLibrary).map((iconName) => {
                                        const Icon = iconLibrary[iconName];
                                        return (
                                            <button
                                                key={iconName}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, iconName })}
                                                className={`rounded-xl p-2 transition hover:bg-slate-100 ${formData.iconName === iconName ? 'bg-slate-900 text-white' : 'text-slate-700'}`}
                                                title={iconName}
                                            >
                                                <Icon size={24} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            <section>
                                <div className="mb-2 text-sm font-semibold text-slate-700">颜色</div>
                                <div className="grid grid-cols-4 gap-2">
                                    {colorPresets.map((preset) => (
                                        <button
                                            key={preset.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color: preset.value })}
                                            className={`rounded-xl px-3 py-3 text-xs font-semibold ${preset.value} transition ${formData.color === preset.value ? 'ring-2 ring-slate-900 ring-offset-2' : ''}`}
                                        >
                                            {preset.name}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}

                    {!isFolder && folders.length > 0 && (
                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-slate-700">放入文件夹</span>
                            <select
                                value={formData.parentFolderId || ''}
                                onChange={(event) => setFormData({ ...formData, parentFolderId: event.target.value || null })}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-slate-900"
                            >
                                <option value="">不放入文件夹</option>
                                {folders.map((folder) => (
                                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                                ))}
                            </select>
                        </label>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
                            取消
                        </button>
                        <button type="submit" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                            <Save size={18} />
                            保存
                        </button>
                    </div>
                </form>
            </Motion.div>
        </Motion.div>
    );
}
