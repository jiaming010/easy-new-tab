import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit3, Trash2 } from 'lucide-react';
import FolderMiniIcon from './FolderMiniIcon';

const sizeClasses = {
    sm: "w-16 h-16 rounded-xl",
    md: "w-20 h-20 rounded-2xl",
    lg: "w-28 h-28 rounded-3xl"
};

export default function DroppableFolder({
                                            app,
                                            size = "md",
                                            onClick,
                                            onEdit,
                                            onDelete,
                                            editMode
                                        }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isOver
    } = useSortable({
        id: app.id,
        disabled: false,
        data: {
            type: 'folder',
            app: app,
            accepts: ['app']
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    const displayApps = [...app.apps.slice(0, 9)];
    while (displayApps.length < 9) {
        displayApps.push({ id: `empty-${displayApps.length}`, isEmpty: true });
    }

    return (
        <div
            className="relative flex flex-col items-center gap-1"
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <div
                className="flex flex-col items-center gap-1 cursor-pointer"
                onClick={!isDragging ? onClick : undefined}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onEdit) {
                        onEdit(app);
                    }
                }}
            >
                <div className={`grid grid-cols-3 gap-1.5 p-2.5 bg-white/20 backdrop-blur-md ${sizeClasses[size]} overflow-hidden border border-white/10 ${
                    editMode ? 'ring-2 ring-yellow-400' : ''
                } ${isOver ? 'ring-4 ring-green-400 bg-green-500/20 scale-105' : ''} transition-all`}>
                    {displayApps.map((subApp, idx) => (
                        subApp.isEmpty ? (
                            <div key={subApp.id} className="aspect-square rounded-md bg-white/5" />
                        ) : (
                            <FolderMiniIcon key={subApp.id || idx} app={subApp} />
                        )
                    ))}
                </div>
                <span className="text-sm text-white font-medium drop-shadow-md">{app.name}</span>
            </div>
            {editMode && (
                <div className="absolute -top-2 -right-2 flex gap-1 z-10">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(app);
                        }}
                        className="p-1 bg-blue-500 rounded-full text-white shadow-lg hover:bg-blue-600 transition-colors"
                    >
                        <Edit3 size={14} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(app.id);
                        }}
                        className="p-1 bg-red-500 rounded-full text-white shadow-lg hover:bg-red-600 transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}