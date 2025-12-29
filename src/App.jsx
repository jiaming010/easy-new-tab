import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, FolderPlus } from 'lucide-react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';

import StatusBar from './components/StatusBar';
import TimeDate from './components/TimeDate';
import SearchBar from './components/SearchBar';
import SortableAppIcon from './components/AppIcon/SortableAppIcon';
import AppIcon from './components/AppIcon/AppIcon';
import DroppableFolder from './components/Folder/DroppableFolder';
import FolderModal from './components/Folder/FolderModal';
import AppModal from './components/Modal/AppModal';
import SettingsPanel from './components/Modal/SettingsPanel';

import { iconLibrary } from './utils/iconLibrary';
import { DEFAULT_APPS } from './utils/iconLibrary';
import { storage, STORAGE_KEYS } from './utils/storage';
import { useDragDrop } from './hooks/useDragDrop';

import './App.css';

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
    const [background, setBackground] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop');
    const [searchEngine, setSearchEngine] = useState('google');

    const {
        sensors,
        customCollisionDetection,
        handleDragStart,
        handleDragEnd,
        getActiveApp
    } = useDragDrop(apps, setApps, openFolder, setOpenFolder);

    // 加载数据
    useEffect(() => {
        const loadData = async () => {
            const savedApps = await storage.get(STORAGE_KEYS.APPS, DEFAULT_APPS);
            const savedBackground = await storage.get(STORAGE_KEYS.BACKGROUND, background);
            const savedSearchEngine = await storage.get(STORAGE_KEYS.SEARCH_ENGINE, searchEngine);

            setApps(savedApps);
            setBackground(savedBackground);
            setSearchEngine(savedSearchEngine);
        };
        loadData();
    }, []);

    // 保存应用数据
    useEffect(() => {
        if (apps.length > 0) {
            storage.set(STORAGE_KEYS.APPS, apps);
        }
    }, [apps]);

    // 时钟更新
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // ESC 键监听
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                if (showSettings) {
                    setShowSettings(false);
                } else if (editMode) {
                    setEditMode(false);
                } else if (openFolder) {
                    setOpenFolder(null);
                } else if (showAppModal) {
                    setShowAppModal(false);
                    setEditingApp(null);
                } else if (showFolderModal) {
                    setShowFolderModal(false);
                    setEditingApp(null);
                }
            }
        };

        window.addEventListener('keydown', handleEscKey);
        return () => window.removeEventListener('keydown', handleEscKey);
    }, [editMode, showSettings, openFolder, showAppModal, showFolderModal]);

    // 添加或编辑应用
    const handleSaveApp = (appData) => {
        const { parentFolderId, ...appDataWithoutParent } = appData;

        if (parentFolderId) {
            if (editingApp && editingApp.id) {
                const newApp = { ...appDataWithoutParent, id: editingApp.id };
                setApps(apps.map(app => {
                    if (app.id === parentFolderId && app.type === 'folder') {
                        const updatedApps = app.apps?.some(a => a.id === editingApp.id)
                            ? app.apps.map(a => a.id === editingApp.id ? newApp : a)
                            : [...(app.apps || []), newApp];
                        return { ...app, apps: updatedApps };
                    }
                    if (app.type === 'folder' && app.apps) {
                        return { ...app, apps: app.apps.filter(a => a.id !== editingApp.id) };
                    }
                    return app.id === editingApp.id ? null : app;
                }).filter(Boolean));

                if (openFolder && openFolder.id === parentFolderId) {
                    const updatedFolder = apps.find(a => a.id === parentFolderId);
                    if (updatedFolder) {
                        setOpenFolder(updatedFolder);
                    }
                }
            } else {
                const newApp = { ...appDataWithoutParent, id: Date.now().toString() };
                const updatedApps = apps.map(app => {
                    if (app.id === parentFolderId && app.type === 'folder') {
                        return { ...app, apps: [...(app.apps || []), newApp] };
                    }
                    return app;
                });
                setApps(updatedApps);

                if (openFolder && openFolder.id === parentFolderId) {
                    const updatedFolder = updatedApps.find(a => a.id === parentFolderId);
                    if (updatedFolder) {
                        setOpenFolder(updatedFolder);
                    }
                }
            }
        } else {
            if (editingApp && editingApp.id) {
                setApps(apps.map(app => {
                    if (app.id === editingApp.id) {
                        return { ...appDataWithoutParent, id: app.id };
                    }
                    if (app.type === 'folder' && app.apps) {
                        return { ...app, apps: app.apps.filter(a => a.id !== editingApp.id) };
                    }
                    return app;
                }));
            } else {
                const newApp = { ...appDataWithoutParent, id: Date.now().toString() };
                setApps([...apps, newApp]);
            }
        }
        setEditingApp(null);
    };

    const handleDeleteApp = (appId) => {
        if (confirm('确定要删除这个应用吗？')) {
            setApps(apps.filter(app => app.id !== appId));
        }
    };

    const handleEditApp = (app) => {
        setEditingApp(app);
        if (app.type === 'folder') {
            setShowFolderModal(true);
        } else {
            setShowAppModal(true);
        }
    };

    const handleUpdateApp = (updatedApp) => {
        setApps(apps.map(app =>
            app.id === updatedApp.id ? updatedApp : app
        ));
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
        if (configData.background) {
            setBackground(configData.background);
            storage.set(STORAGE_KEYS.BACKGROUND, configData.background);
        }
        if (configData.searchEngine) {
            setSearchEngine(configData.searchEngine);
            storage.set(STORAGE_KEYS.SEARCH_ENGINE, configData.searchEngine);
        }
    };

    const activeApp = getActiveApp();

    return (
        <div
            className="relative w-full h-screen overflow-hidden bg-cover bg-center font-sans"
            style={{ backgroundImage: `url("${background}")` }}
        >
            <div className="absolute inset-0 bg-black/20" />

            <StatusBar
                currentTime={currentTime}
                editMode={editMode}
                onToggleEdit={() => setEditMode(!editMode)}
                onOpenSettings={() => setShowSettings(true)}
            />

            <div className="relative z-10 w-full h-full flex flex-col items-center pt-20 pb-24 px-4 overflow-y-auto">
                <TimeDate currentTime={currentTime} />
                <SearchBar searchEngine={searchEngine} />

                <DndContext
                    sensors={sensors}
                    collisionDetection={customCollisionDetection}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={apps.map(app => app.id)} strategy={rectSortingStrategy}>
                        <div className="w-full max-w-4xl grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-6 gap-y-10 justify-items-center mb-8">
                            {apps.map((app) =>
                                app.type === 'folder' ? (
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
                                        onClick={undefined}
                                        onEdit={handleEditApp}
                                        onDelete={handleDeleteApp}
                                        onUpdateApp={handleUpdateApp}
                                        editMode={editMode}
                                    />
                                )
                            )}

                            {editMode && (
                                <>
                                    <div
                                        className="flex flex-col items-center gap-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                                        onClick={() => {
                                            setEditingApp(null);
                                            setShowAppModal(true);
                                        }}
                                    >
                                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                            <Plus className="text-white" size={40} />
                                        </div>
                                        <span className="text-sm text-white font-medium">添加应用</span>
                                    </div>

                                    <div
                                        className="flex flex-col items-center gap-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                                        onClick={() => {
                                            setEditingApp(null);
                                            setShowFolderModal(true);
                                        }}
                                    >
                                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                            <FolderPlus className="text-white" size={40} />
                                        </div>
                                        <span className="text-sm text-white font-medium">添加文件夹</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </SortableContext>

                    <DragOverlay>
                        {activeApp ? (
                            <div className="opacity-80 cursor-grabbing scale-110">
                                {activeApp.type === 'folder' ? (
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="grid grid-cols-3 gap-1 p-2 bg-white/20 backdrop-blur-md w-20 h-20 rounded-2xl overflow-hidden border border-white/10">
                                            {activeApp.apps.slice(0, 9).map((subApp, idx) => {
                                                const SubIcon = iconLibrary[subApp.iconName] || iconLibrary.Globe;
                                                return (
                                                    <div key={subApp.id || idx} className={`w-full h-full rounded-full ${subApp.color} flex items-center justify-center`}>
                                                        <SubIcon size={8} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <span className="text-sm text-white font-medium drop-shadow-md">{activeApp.name}</span>
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
                        isFolder={false}
                        folders={apps.filter(app => app.type === 'folder')}
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
                        isFolder={true}
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