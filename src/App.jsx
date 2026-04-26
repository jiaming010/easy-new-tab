import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FolderPlus, Plus } from 'lucide-react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';

import StatusBar from './components/StatusBar';
import TimeDate from './components/TimeDate';
import SearchBar from './components/SearchBar';
import SortableAppIcon from './components/AppIcon/SortableAppIcon';
import AppIcon from './components/AppIcon/AppIcon';
import DroppableFolder from './components/Folder/DroppableFolder';
import FolderModal from './components/Folder/FolderModal';
import FolderMiniIcon from './components/Folder/FolderMiniIcon';
import AppModal from './components/Modal/AppModal';
import SettingsPanel from './components/Modal/SettingsPanel';

import { DEFAULT_APPS } from './utils/iconLibrary';
import { storage, STORAGE_KEYS } from './utils/storage';
import { useDragDrop } from './hooks/useDragDrop';

import './App.css';

const DEFAULT_BACKGROUND = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2400&auto=format&fit=crop';
const DEFAULT_SEARCH_ENGINE = 'google';

export default function IOSNewTab() {
    const [apps, setApps] = useState([]);
    const [dockApps, setDockApps] = useState([]);
    const [openFolder, setOpenFolder] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [editMode, setEditMode] = useState(false);
    const [showAppModal, setShowAppModal] = useState(false);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [editingApp, setEditingApp] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [background, setBackground] = useState(DEFAULT_BACKGROUND);
    const [searchEngine, setSearchEngine] = useState(DEFAULT_SEARCH_ENGINE);

    const {
        sensors,
        customCollisionDetection,
        handleDragStart,
        handleDragEnd,
        getActiveApp
    } = useDragDrop(apps, setApps, openFolder, setOpenFolder);

    useEffect(() => {
        const loadData = async () => {
            const savedApps = await storage.get(STORAGE_KEYS.APPS, DEFAULT_APPS);
            const savedBackground = await storage.get(STORAGE_KEYS.BACKGROUND, DEFAULT_BACKGROUND);
            const savedSearchEngine = await storage.get(STORAGE_KEYS.SEARCH_ENGINE, DEFAULT_SEARCH_ENGINE);

            setApps(savedApps);
            setBackground(savedBackground);
            setSearchEngine(savedSearchEngine);
        };

        loadData();
    }, []);

    useEffect(() => {
        if (apps.length > 0) storage.set(STORAGE_KEYS.APPS, apps);
    }, [apps]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key !== 'Escape') return;

            if (showSettings) setShowSettings(false);
            else if (editMode) setEditMode(false);
            else if (openFolder) setOpenFolder(null);
            else if (showAppModal) {
                setShowAppModal(false);
                setEditingApp(null);
            } else if (showFolderModal) {
                setShowFolderModal(false);
                setEditingApp(null);
            }
        };

        window.addEventListener('keydown', handleEscKey);
        return () => window.removeEventListener('keydown', handleEscKey);
    }, [editMode, showSettings, openFolder, showAppModal, showFolderModal]);

    const stats = useMemo(() => {
        const folders = apps.filter((app) => app.type === 'folder');
        const nestedApps = folders.reduce((count, folder) => count + (folder.apps?.length || 0), 0);
        return {
            apps: apps.filter((app) => app.type !== 'folder').length + nestedApps,
            folders: folders.length
        };
    }, [apps]);

    const handleSaveApp = (appData) => {
        const { parentFolderId, ...appDataWithoutParent } = appData;

        if (parentFolderId) {
            if (editingApp && editingApp.id) {
                const newApp = { ...appDataWithoutParent, id: editingApp.id };
                setApps(apps.map((app) => {
                    if (app.id === parentFolderId && app.type === 'folder') {
                        const updatedApps = app.apps?.some((a) => a.id === editingApp.id)
                            ? app.apps.map((a) => a.id === editingApp.id ? newApp : a)
                            : [...(app.apps || []), newApp];
                        return { ...app, apps: updatedApps };
                    }
                    if (app.type === 'folder' && app.apps) {
                        return { ...app, apps: app.apps.filter((a) => a.id !== editingApp.id) };
                    }
                    return app.id === editingApp.id ? null : app;
                }).filter(Boolean));
            } else {
                const newApp = { ...appDataWithoutParent, id: Date.now().toString() };
                const updatedApps = apps.map((app) => {
                    if (app.id === parentFolderId && app.type === 'folder') {
                        return { ...app, apps: [...(app.apps || []), newApp] };
                    }
                    return app;
                });
                setApps(updatedApps);
                if (openFolder?.id === parentFolderId) setOpenFolder(updatedApps.find((app) => app.id === parentFolderId));
            }
        } else if (editingApp && editingApp.id) {
            setApps(apps.map((app) => {
                if (app.id === editingApp.id) return { ...appDataWithoutParent, id: app.id };
                if (app.type === 'folder' && app.apps) {
                    return { ...app, apps: app.apps.filter((a) => a.id !== editingApp.id) };
                }
                return app;
            }));
        } else {
            const newApp = { ...appDataWithoutParent, id: Date.now().toString() };
            setApps([...apps, newApp]);
        }

        setEditingApp(null);
    };

    const handleDeleteApp = (appId) => {
        if (confirm('确定要删除这个项目吗？')) {
            setApps(apps.filter((app) => app.id !== appId));
        }
    };

    const handleEditApp = (app) => {
        setEditingApp(app);
        if (app.type === 'folder') setShowFolderModal(true);
        else setShowAppModal(true);
    };

    const handleUpdateApp = (updatedApp) => {
        setApps(apps.map((app) => app.id === updatedApp.id ? updatedApp : app));
    };

    const handleBackgroundChange = (newBackground) => {
        setBackground(newBackground);
        storage.set(STORAGE_KEYS.BACKGROUND, newBackground);
    };

    const handleSearchEngineChange = (newSearchEngine) => {
        setSearchEngine(newSearchEngine);
        storage.set(STORAGE_KEYS.SEARCH_ENGINE, newSearchEngine);
    };

    const handleImportConfig = (configData) => {
        if (configData.apps) {
            setApps(configData.apps);
            storage.set(STORAGE_KEYS.APPS, configData.apps);
        }
        if (configData.dockApps) {
            setDockApps(configData.dockApps);
            storage.set(STORAGE_KEYS.DOCK_APPS, configData.dockApps);
        }
        if (configData.background) handleBackgroundChange(configData.background);
        if (configData.searchEngine) handleSearchEngineChange(configData.searchEngine);
    };

    const activeApp = getActiveApp();

    return (
        <div
            className="relative h-screen w-full overflow-hidden bg-cover bg-center font-sans text-white"
            style={{ backgroundImage: `url("${background}")` }}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.18),transparent_34%),linear-gradient(180deg,rgba(2,6,23,0.28),rgba(2,6,23,0.78))]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />

            <StatusBar
                editMode={editMode}
                onToggleEdit={() => setEditMode(!editMode)}
                onOpenSettings={() => setShowSettings(true)}
            />

            <main className="relative z-10 flex h-full w-full flex-col items-center overflow-y-auto px-4 pb-28 pt-10 sm:pt-12">
                <div className="flex w-full max-w-6xl flex-1 flex-col items-center">
                    <TimeDate currentTime={currentTime} />

                    <div className="mt-8 w-full">
                        <SearchBar searchEngine={searchEngine} />
                    </div>

                    <div className="mt-7 flex items-center gap-3 rounded-full border border-white/15 bg-black/20 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-xl">
                        <span>{stats.apps} 个快捷方式</span>
                        <span className="h-1 w-1 rounded-full bg-white/45" />
                        <span>{stats.folders} 个文件夹</span>
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={customCollisionDetection}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={apps.map((app) => app.id)} strategy={rectSortingStrategy}>
                            <div className="mt-10 grid w-full max-w-5xl grid-cols-3 justify-items-center gap-x-5 gap-y-8 pb-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                                {apps.map((app) => app.type === 'folder' ? (
                                    <DroppableFolder
                                        key={app.id}
                                        app={app}
                                        onClick={() => setOpenFolder(app)}
                                        onEdit={handleEditApp}
                                        onDelete={handleDeleteApp}
                                        editMode={editMode}
                                    />
                                ) : (
                                    <SortableAppIcon
                                        key={app.id}
                                        app={app}
                                        onEdit={handleEditApp}
                                        onDelete={handleDeleteApp}
                                        onUpdateApp={handleUpdateApp}
                                        editMode={editMode}
                                    />
                                ))}

                                {editMode && (
                                    <>
                                        <button
                                            className="flex flex-col items-center gap-2 rounded-2xl p-2 text-white/90 transition hover:bg-white/10 hover:text-white"
                                            onClick={() => {
                                                setEditingApp(null);
                                                setShowAppModal(true);
                                            }}
                                        >
                                            <span className="flex h-20 w-20 items-center justify-center rounded-[1.35rem] border border-white/20 bg-white/15 shadow-xl backdrop-blur-2xl">
                                                <Plus size={34} />
                                            </span>
                                            <span className="max-w-24 truncate text-sm font-semibold drop-shadow">添加应用</span>
                                        </button>

                                        <button
                                            className="flex flex-col items-center gap-2 rounded-2xl p-2 text-white/90 transition hover:bg-white/10 hover:text-white"
                                            onClick={() => {
                                                setEditingApp(null);
                                                setShowFolderModal(true);
                                            }}
                                        >
                                            <span className="flex h-20 w-20 items-center justify-center rounded-[1.35rem] border border-white/20 bg-white/15 shadow-xl backdrop-blur-2xl">
                                                <FolderPlus size={34} />
                                            </span>
                                            <span className="max-w-24 truncate text-sm font-semibold drop-shadow">添加文件夹</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </SortableContext>

                        <DragOverlay>
                            {activeApp ? (
                                <div className="scale-110 cursor-grabbing">
                                    {activeApp.type === 'folder' ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="grid h-20 w-20 grid-cols-3 gap-1.5 overflow-hidden rounded-[1.35rem] border border-white/20 bg-white/25 p-2.5 shadow-2xl backdrop-blur-2xl">
                                                {Array.from({ length: 9 }, (_, index) => (activeApp.apps || [])[index]).map((subApp, index) => (
                                                    <div key={subApp?.id || `empty-overlay-${index}`}>
                                                        {subApp ? <FolderMiniIcon app={subApp} /> : <div className="aspect-square rounded-md bg-white/10" />}
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="max-w-24 truncate text-sm font-semibold drop-shadow">{activeApp.name}</span>
                                        </div>
                                    ) : (
                                        <AppIcon app={activeApp} size="md" editMode={false} />
                                    )}
                                </div>
                            ) : null}
                        </DragOverlay>

                        <FolderModal
                            openFolder={openFolder}
                            onClose={() => setOpenFolder(null)}
                            editMode={editMode}
                            apps={apps}
                            setApps={setApps}
                            onAddApp={(app) => {
                                setEditingApp(app);
                                setShowAppModal(true);
                            }}
                        />
                    </DndContext>
                </div>
            </main>

            <AnimatePresence>
                {showAppModal && (
                    <AppModal
                        isOpen={showAppModal}
                        onClose={() => {
                            setShowAppModal(false);
                            setEditingApp(null);
                        }}
                        onSave={handleSaveApp}
                        editingApp={editingApp}
                        folders={apps.filter((app) => app.type === 'folder')}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showFolderModal && (
                    <AppModal
                        isOpen={showFolderModal}
                        onClose={() => {
                            setShowFolderModal(false);
                            setEditingApp(null);
                        }}
                        onSave={handleSaveApp}
                        editingApp={editingApp}
                        isFolder
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showSettings && (
                    <SettingsPanel
                        isOpen={showSettings}
                        onClose={() => setShowSettings(false)}
                        background={background}
                        onBackgroundChange={handleBackgroundChange}
                        searchEngine={searchEngine}
                        onSearchEngineChange={handleSearchEngineChange}
                        apps={apps}
                        dockApps={dockApps}
                        onImportConfig={handleImportConfig}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
