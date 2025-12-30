import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AppIcon from './AppIcon';

export default function SortableAppIcon({
                                            app,
                                            size = "md",
                                            onClick,
                                            onEdit,
                                            onDelete,
                                            onUpdateApp,
                                            editMode,
                                            showDeleteButton = false
                                        }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: app.id,
        disabled: false,
        data: {
            type: app.type || 'app',
            app: app
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
            className="outline-none"
            {...attributes}
            {...listeners}
        >
            <AppIcon
                app={app}
                size={size}
                onClick={onClick}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdateApp={onUpdateApp}
                editMode={editMode}
                showDeleteButton={showDeleteButton}
            />
        </div>
    );
}