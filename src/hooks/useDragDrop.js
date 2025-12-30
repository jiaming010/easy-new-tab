import { useState } from 'react';
import {
    useSensors,
    useSensor,
    PointerSensor,
    KeyboardSensor
} from '@dnd-kit/core';
import {
    sortableKeyboardCoordinates,
    arrayMove
} from '@dnd-kit/sortable';
import { pointerWithin, closestCenter } from '@dnd-kit/core';

export function useDragDrop(apps, setApps, openFolder, setOpenFolder) {
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const customCollisionDetection = (args) => {
        const pointerCollisions = pointerWithin(args);
        if (pointerCollisions.length > 0) {
            return pointerCollisions;
        }
        return closestCenter(args);
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        setActiveId(null);

        if (!active || !over || active.id === over.id) {
            return;
        }

        const activeData = active.data.current;
        const activeType = activeData?.type;
        const overData = over.data.current;

        // 处理从文件夹拖出的应用
        if (activeType === 'folder-app') {
            const activeApp = activeData.app;
            const sourceFolderId = activeData.sourceFolderId;

            // 1. 拖到另一个文件夹图标上
            if (overData?.type === 'folder') {
                const targetFolderId = overData.app.id;

                if (sourceFolderId === targetFolderId) return;

                setApps(items => {
                    return items.map(item => {
                        if (item.id === sourceFolderId && item.type === 'folder') {
                            return {
                                ...item,
                                apps: item.apps.filter(a => a.id !== activeApp.id)
                            };
                        }
                        if (item.id === targetFolderId && item.type === 'folder') {
                            if (item.apps?.some(a => a.id === activeApp.id)) {
                                return item;
                            }
                            return {
                                ...item,
                                apps: [...(item.apps || []), { ...activeApp, type: 'app' }]
                            };
                        }
                        return item;
                    });
                });

                if (openFolder && openFolder.id === sourceFolderId) {
                    setOpenFolder({
                        ...openFolder,
                        apps: openFolder.apps.filter(a => a.id !== activeApp.id)
                    });
                }
                return;
            }

            // 2. 核心修复：处理文件夹内部排序
            // 如果目标也是文件夹内的应用，且属于同一个源文件夹
            if (overData?.type === 'folder-app' && overData.sourceFolderId === sourceFolderId) {
                setApps(items => {
                    return items.map(item => {
                        if (item.id === sourceFolderId && item.type === 'folder') {
                            const oldIndex = item.apps.findIndex(a => a.id === activeApp.id);
                            const newIndex = item.apps.findIndex(a => a.id === overData.app.id);
                            
                            if (oldIndex !== -1 && newIndex !== -1) {
                                const newSubApps = arrayMove(item.apps, oldIndex, newIndex);
                                
                                // 同步更新当前打开的文件夹视图状态
                                if (openFolder && openFolder.id === sourceFolderId) {
                                    setOpenFolder({ ...item, apps: newSubApps });
                                }
                                
                                return { ...item, apps: newSubApps };
                            }
                        }
                        return item;
                    });
                });
                return; 
            }

            // 3. 拖到主屏幕（若非上述两种情况，则视为移出文件夹）
            const targetIndex = apps.findIndex(item => item.id === over.id);

            setApps(items => {
                const updatedItems = items.map(item => {
                    if (item.id === sourceFolderId && item.type === 'folder') {
                        return {
                            ...item,
                            apps: item.apps.filter(a => a.id !== activeApp.id)
                        };
                    }
                    return item;
                });

                if (targetIndex !== -1) {
                    updatedItems.splice(targetIndex, 0, { ...activeApp, type: 'app' });
                } else {
                    updatedItems.push({ ...activeApp, type: 'app' });
                }

                return updatedItems;
            });

            if (openFolder && openFolder.id === sourceFolderId) {
                setOpenFolder({
                    ...openFolder,
                    apps: openFolder.apps.filter(a => a.id !== activeApp.id)
                });
            }
            return;
        }

        // 主屏幕应用拖到文件夹
        if (overData?.type === 'folder' && activeType !== 'folder') {
            const activeApp = activeData.app;
            const targetFolder = overData.app;

            setApps(items => {
                return items.map(item => {
                    if (item.id === targetFolder.id && item.type === 'folder') {
                        if (item.apps?.some(a => a.id === activeApp.id)) {
                            return item;
                        }
                        return {
                            ...item,
                            apps: [...(item.apps || []), { ...activeApp, type: 'app' }]
                        };
                    }
                    if (item.type === 'folder' && item.apps) {
                        return {
                            ...item,
                            apps: item.apps.filter(a => a.id !== activeApp.id)
                        };
                    }
                    if (item.id === activeApp.id) {
                        return null;
                    }
                    return item;
                }).filter(Boolean);
            });
            return;
        }

        // 主屏幕普通排序
        setApps((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                return arrayMove(items, oldIndex, newIndex);
            }
            return items;
        });
    };

    const getActiveApp = () => {
        if (!activeId) return null;

        // 处理处于拖拽状态的文件夹内部应用 ID
        if (typeof activeId === 'string' && activeId.startsWith('folder-')) {
            const parts = activeId.split('-app-');
            if (parts.length === 2) {
                const appId = parts[1];
                for (const item of apps) {
                    if (item.type === 'folder' && item.apps) {
                        const found = item.apps.find(a => a.id === appId);
                        if (found) return found;
                    }
                }
            }
        }

        return apps.find(app => app.id === activeId);
    };

    return {
        sensors,
        customCollisionDetection,
        activeId,
        handleDragStart,
        handleDragEnd,
        getActiveApp
    };
}