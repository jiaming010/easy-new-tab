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
                    className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[85%] max-w-2xl bg-white/20 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl max-h-[85vh] overflow-y-auto flex flex-col"
                >
                    <div className="flex justify-between items-center w-full mb-8 text-white">
                        <h2 className="text-3xl font-bold">{openFolder.name}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <SortableContext
                        items={(openFolder.apps || []).map(app => `folder-${openFolder.id}-app-${app.id}`)}
                        strategy={rectSortingStrategy}
                    >
                        <div className="grid grid-cols-4 gap-6 w-full place-items-center mb-6">
                            {openFolder.apps?.map((app) => (
                                <FolderAppIcon
                                    key={app.id}
                                    app={app}
                                    size="lg"
                                    folderId={openFolder.id}
                                    onEdit={(app) => onAddApp({ ...app, parentFolderId: openFolder.id })}
                                    onDelete={handleDeleteApp}
                                    onUpdateApp={handleUpdateApp}
                                    editMode={editMode}
                                />
                            ))}

                            {editMode && (
                                <div
                                    className="flex flex-col items-center gap-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                                    onClick={() => onAddApp({ parentFolderId: openFolder.id })}
                                >
                                    <div className="w-28 h-28 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                        <Plus className="text-white" size={56} />
                                    </div>
                                    <span className="text-sm text-white font-medium">添加</span>
                                </div>
                            )}
                        </div>
                    </SortableContext>

                    {(!openFolder.apps || openFolder.apps.length === 0) && !editMode && (
                        <div className="text-center text-white/70 py-8">
                            <p>文件夹为空</p>
                            <p className="text-sm mt-2">长按应用可拖入文件夹</p>
                        </div>
                    )}
                </motion.div>
            </>
        </AnimatePresence>
    );
}