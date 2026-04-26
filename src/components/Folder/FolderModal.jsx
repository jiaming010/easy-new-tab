import React from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import FolderAppIcon from '../AppIcon/FolderAppIcon';

export default function FolderModal({ openFolder, onClose, editMode, apps, setApps, onAddApp }) {
    if (!openFolder) return null;

    const handleDeleteApp = (appId) => {
        if (confirm('确定要删除这个应用吗？')) {
            setApps(apps.map((folder) => {
                if (folder.id === openFolder.id && folder.type === 'folder') {
                    return { ...folder, apps: folder.apps.filter((app) => app.id !== appId) };
                }
                return folder;
            }));
        }
    };

    const handleUpdateApp = (updatedApp) => {
        setApps(apps.map((folder) => {
            if (folder.id === openFolder.id && folder.type === 'folder') {
                return {
                    ...folder,
                    apps: folder.apps.map((app) => app.id === updatedApp.id ? updatedApp : app)
                };
            }
            return folder;
        }));
    };

    return (
        <AnimatePresence>
            <>
                <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[60] bg-slate-950/45 backdrop-blur-md"
                />
                <Motion.div
                    initial={{ scale: 0.92, opacity: 0, x: '-50%', y: '-50%' }}
                    animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
                    exit={{ scale: 0.92, opacity: 0, x: '-50%', y: '-50%' }}
                    transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                    onClick={(event) => event.stopPropagation()}
                    className="fixed left-1/2 top-1/2 z-[70] flex max-h-[82vh] w-[min(92vw,26rem)] flex-col rounded-[2rem] border border-white/20 bg-white/20 p-5 text-white shadow-2xl backdrop-blur-3xl"
                >
                    <div className="flex items-center justify-between gap-4 px-1 pb-5">
                        <div className="min-w-0">
                            <h2 className="truncate text-xl font-bold">{openFolder.name}</h2>
                            <p className="mt-1 text-sm text-white/65">{openFolder.apps?.length || 0} 个项目</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25"
                            title="关闭"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <SortableContext
                        items={(openFolder.apps || []).map((app) => `folder-${openFolder.id}-app-${app.id}`)}
                        strategy={rectSortingStrategy}
                    >
                        <div className="grid w-full grid-cols-3 place-items-center gap-4 overflow-y-auto pb-1">
                            {openFolder.apps?.map((app) => (
                                <FolderAppIcon
                                    key={app.id}
                                    app={app}
                                    size="md"
                                    folderId={openFolder.id}
                                    onEdit={(folderApp) => onAddApp({ ...folderApp, parentFolderId: openFolder.id })}
                                    onDelete={handleDeleteApp}
                                    onUpdateApp={handleUpdateApp}
                                    editMode={editMode}
                                />
                            ))}

                            {editMode && (
                                <button
                                    className="flex flex-col items-center gap-2 rounded-2xl p-2 text-white/85 transition hover:bg-white/10 hover:text-white"
                                    onClick={() => onAddApp({ parentFolderId: openFolder.id })}
                                >
                                    <span className="flex h-20 w-20 items-center justify-center rounded-[1.35rem] border border-white/20 bg-white/15 shadow-xl backdrop-blur-xl">
                                        <Plus size={32} />
                                    </span>
                                    <span className="text-sm font-semibold">添加</span>
                                </button>
                            )}
                        </div>
                    </SortableContext>

                    {(!openFolder.apps || openFolder.apps.length === 0) && !editMode && (
                        <div className="py-10 text-center text-sm text-white/65">文件夹为空</div>
                    )}
                </Motion.div>
            </>
        </AnimatePresence>
    );
}
