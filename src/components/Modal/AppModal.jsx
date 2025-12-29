import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Globe, Upload } from 'lucide-react';
import { iconLibrary, colorPresets } from '../../utils/iconLibrary';
import { uploadCustomIcon } from '../../utils/iconCache';

export default function AppModal({
                                     isOpen,
                                     onClose,
                                     onSave,
                                     editingApp,
                                     isFolder = false,
                                     folders = []
                                 }) {
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        iconName: 'Globe',
        color: 'bg-blue-500 text-white',
        type: isFolder ? 'folder' : 'app',
        apps: [],
        parentFolderId: null,
        useFavicon: false,
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
                useFavicon: false,
                customIcon: null,
                useCustomIcon: false
            });
            setCustomIconPreview(null);
        }
    }, [editingApp, isFolder, isOpen]);

    const handleCustomIconUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingIcon(true);
        try {
            const tempId = editingApp?.id || Date.now().toString();
            const dataUrl = await uploadCustomIcon(file, tempId);

            setFormData({
                ...formData,
                customIcon: dataUrl,
                useCustomIcon: true,
                useFavicon: false
            });
            setCustomIconPreview(dataUrl);
        } catch (error) {
            alert(error.message || '图片上传失败，请重试');
            console.error('上传图片错误:', error);
        } finally {
            setUploadingIcon(false);
            e.target.value = '';
        }
    };

    const handleCustomIconUrl = async (imageUrl) => {
        if (!imageUrl.trim()) {
            alert('请输入图片 URL');
            return;
        }

        setUploadingIcon(true);
        try {
            const tempId = editingApp?.id || Date.now().toString();
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], 'icon.png', { type: blob.type });

            const dataUrl = await uploadCustomIcon(file, tempId);

            setFormData({
                ...formData,
                customIcon: dataUrl,
                useCustomIcon: true,
                useFavicon: false
            });
            setCustomIconPreview(dataUrl);
        } catch (error) {
            alert('图片URL加载失败，请检查URL是否正确或尝试使用其他图片');
            console.error('加载URL图片错误:', error);
        } finally {
            setUploadingIcon(false);
        }
    };

    const handleRemoveCustomIcon = () => {
        setFormData({
            ...formData,
            customIcon: null,
            useCustomIcon: false
        });
        setCustomIconPreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
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
                className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingApp ? '编辑' : '添加'}{isFolder ? '文件夹' : '应用'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">名称</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="输入名称"
                            required
                        />
                    </div>

                    {!isFolder && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">网址</label>
                                <input
                                    type="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://example.com"
                                    required
                                />
                            </div>

                            {/* 自定义图标上传 */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    🎨 自定义图标（推荐）
                                </label>

                                {customIconPreview ? (
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img
                                                src={customIconPreview}
                                                alt="预览"
                                                className="w-20 h-20 rounded-xl object-cover shadow-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveCustomIcon}
                                                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-green-600 mb-1">✓ 已上传自定义图标</p>
                                            <p className="text-xs text-gray-500">铺满显示，永久保存</p>
                                            <label className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-700 cursor-pointer">
                                                重新上传
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleCustomIconUpload}
                                                    className="hidden"
                                                    disabled={uploadingIcon}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <label className="block cursor-pointer">
                                            <div className="flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all">
                                                <Upload size={18} />
                                                <span className="font-medium">
                                                    {uploadingIcon ? '处理中...' : '上传图片文件'}
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleCustomIconUpload}
                                                className="hidden"
                                                disabled={uploadingIcon}
                                            />
                                        </label>

                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-px bg-gray-300"></div>
                                            <span className="text-xs text-gray-500">或</span>
                                            <div className="flex-1 h-px bg-gray-300"></div>
                                        </div>

                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                placeholder="粘贴图片 URL 地址"
                                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleCustomIconUrl(e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                disabled={uploadingIcon}
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    const input = e.target.previousElementSibling;
                                                    handleCustomIconUrl(input.value);
                                                    input.value = '';
                                                }}
                                                disabled={uploadingIcon}
                                                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                                            >
                                                加载
                                            </button>
                                        </div>

                                        <p className="text-xs text-gray-500 text-center">
                                            支持 PNG、JPG、SVG，最大 5MB<br />
                                            自动裁剪为正方形并铺满显示，永久缓存
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <Globe size={20} className="text-gray-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">使用网站真实 Logo</p>
                                        <p className="text-xs text-gray-500">通过 Google 高清服务获取，失败后永久显示文字图标</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, useFavicon: !formData.useFavicon, useCustomIcon: false })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${
                                        formData.useFavicon && !formData.useCustomIcon ? 'bg-blue-500' : 'bg-gray-300'
                                    }`}
                                    disabled={formData.useCustomIcon}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                            formData.useFavicon && !formData.useCustomIcon ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>
                        </>
                    )}

                    {!formData.useFavicon && !formData.useCustomIcon && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">图标</label>
                                <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-xl">
                                    {Object.keys(iconLibrary).map((iconName) => {
                                        const Icon = iconLibrary[iconName];
                                        return (
                                            <button
                                                key={iconName}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, iconName })}
                                                className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                                                    formData.iconName === iconName ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                                                }`}
                                            >
                                                <Icon size={24} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">颜色</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {colorPresets.map((preset) => (
                                        <button
                                            key={preset.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color: preset.value })}
                                            className={`p-3 rounded-xl ${preset.value} flex items-center justify-center transition-all ${
                                                formData.color === preset.value ? 'ring-4 ring-offset-2 ring-blue-500' : ''
                                            }`}
                                        >
                                            <span className="text-xs font-medium">{preset.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {!isFolder && folders.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                放入文件夹（可选）
                            </label>
                            <select
                                value={formData.parentFolderId || ''}
                                onChange={(e) => setFormData({ ...formData, parentFolderId: e.target.value || null })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">不放入文件夹</option>
                                {folders.map((folder) => (
                                    <option key={folder.id} value={folder.id}>
                                        {folder.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            保存
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}