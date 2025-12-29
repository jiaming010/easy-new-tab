import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AppIcon from './AppIcon';

export default function FolderAppIcon({
                                          app,
                                          size = "lg",
                                          onEdit,
                                          onDelete,
                                          onUpdateApp,
                                          editMode,
                                          folderId
                                      }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `folder-${folderId}-app-${app.id}`,
        disabled: false,
        data: {
            type: 'folder-app',
            app: app,
            sourceFolderId: folderId
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <AppIcon
                app={app}
                size={size}
                onClick={undefined}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdateApp={onUpdateApp}
                editMode={editMode}
                showDeleteButton={editMode}
            />
        </div>
    );
}