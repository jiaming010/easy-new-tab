import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import FolderAppIcon from '../AppIcon/FolderAppIcon';

export default function FolderModal({
                                        openFolder,
                                        onClose,
                                        editMode,
                                        apps,
                                        setApps,
                                        onAddApp
                                    }) {
    if (!openFolder) return null;

    const handleDeleteApp = (appId) => {
        if (confirm('确定要删除这个应用吗？')) {
            setApps(apps.map(folder => {
                if (folder.id === openFolder.id && folder.type === 'folder') {
                    return { ...folder, apps: folder.apps.filter(a => a.id !== appId) };
                }
                return folder;
            }));
        }
    };

    const handleUpdateApp = (updatedApp) => {
        setApps(apps.map(folder => {
            if (folder.id === openFolder.id && folder.type === 'folder') {
                return {
                    ...folder,
                    apps: folder.apps.map(a =>
                        a.id === updatedApp.id ? updatedApp : a
                    )
                };
            }
            return folder;
        }));
    };

    return (
        <AnimatePresence>
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
                />
                <motion.div
                    // 调整初始动画：从中心放大
                    initial={{ scale: 0.5, opacity: 0, x: "-50%", y: "-50%" }}
                    animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
                    exit={{ scale: 0.5, opacity: 0, x: "-50%", y: "-50%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    // 修改点：w-[22rem] 固定宽度，rounded-[2.5rem] 更大的圆角
                    className="fixed top-1/2 left-1/2 z-[70] w-[22rem] bg-white/20 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] p-6 shadow-2xl flex flex-col"
                >
                    <div className="flex justify-between items-center w-full mb-6 text-white px-2">
                        {/* 修改点：字体改小一点，适应紧凑布局 */}
                        <h2 className="text-xl font-bold truncate pr-4">{openFolder.name}</h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <SortableContext
                        items={(openFolder.apps || []).map(app => `folder-${openFolder.id}-app-${app.id}`)}
                        strategy={rectSortingStrategy}
                    >
                        {/* 修改点：grid-cols-3 (九宫格)，gap-4 (间距更紧凑) */}
                        <div className="grid grid-cols-3 gap-4 w-full place-items-center mb-2">
                            {openFolder.apps?.map((app) => (
                                <FolderAppIcon
                                    key={app.id}
                                    app={app}
                                    // 修改点：使用 md 尺寸，避免图标过大
                                    size="md" 
                                    folderId={openFolder.id}
                                    onEdit={(app) => onAddApp({ ...app, parentFolderId: openFolder.id })}
                                    onDelete={handleDeleteApp}
                                    onUpdateApp={handleUpdateApp}
                                    editMode={editMode}
                                />
                            ))}

                            {editMode && (
                                <div
                                    className="flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                                    onClick={() => onAddApp({ parentFolderId: openFolder.id })}
                                >
                                    {/* 修改点：添加按钮的大小也随之调整 */}
                                    <div className="w-[4.5rem] h-[4.5rem] rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg hover:bg-white/25 transition-all">
                                        <Plus className="text-white" size={32} />
                                    </div>
                                    <span className="text-xs text-white font-medium drop-shadow-md">添加</span>
                                </div>
                            )}
                        </div>
                    </SortableContext>

                    {(!openFolder.apps || openFolder.apps.length === 0) && !editMode && (
                        <div className="text-center text-white/70 py-6">
                            <p className="text-sm">文件夹为空</p>
                        </div>
                    )}
                </motion.div>
            </>
        </AnimatePresence>
    );
}