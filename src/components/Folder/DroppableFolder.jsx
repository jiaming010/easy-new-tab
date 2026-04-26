import React from 'react';
import { Edit3, Minus } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import FolderMiniIcon from './FolderMiniIcon';

const sizeClasses = {
    sm: 'h-16 w-16 rounded-2xl',
    md: 'h-20 w-20 rounded-[1.35rem]',
    lg: 'h-28 w-28 rounded-[1.7rem]'
};

export default function DroppableFolder({ app, size = 'md', onClick, onEdit, onDelete, editMode }) {
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
        data: { type: 'folder', app, accepts: ['app'] }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging || isOver ? 50 : 'auto',
    };

    const displayApps = Array.from({ length: 9 }, (_, index) => (app.apps || [])[index]);

    return (
        <div
            className="relative flex touch-none flex-col items-center gap-2 rounded-2xl p-2 outline-none"
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <button
                className={`flex flex-col items-center gap-2 outline-none ${editMode ? 'wiggle-animation' : ''}`}
                onClick={!isDragging ? onClick : undefined}
                onContextMenu={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onEdit?.(app);
                }}
            >
                <Motion.div
                    animate={isOver ? 'hover' : 'idle'}
                    variants={{
                        idle: { scale: 1, backgroundColor: 'rgba(255,255,255,0.18)' },
                        hover: { scale: 1.1, backgroundColor: 'rgba(255,255,255,0.3)' }
                    }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    className={`grid grid-cols-3 gap-1.5 overflow-hidden border border-white/20 p-2.5 shadow-[0_18px_35px_rgba(0,0,0,0.25)] backdrop-blur-2xl ${sizeClasses[size]} ${editMode ? 'ring-2 ring-white/80' : ''}`}
                >
                    {displayApps.map((subApp, index) => (
                        <div key={subApp?.id || `empty-${index}`} className="relative z-10">
                            {subApp ? <FolderMiniIcon app={subApp} /> : <div className="aspect-square rounded-md bg-white/10" />}
                        </div>
                    ))}
                </Motion.div>

                <span className="max-w-24 truncate text-sm font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                    {app.name}
                </span>
            </button>

            {editMode && (
                <>
                    <button
                        onClick={(event) => {
                            event.stopPropagation();
                            onDelete?.(app.id);
                        }}
                        className="absolute left-0 top-0 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-slate-950/70 text-white shadow-lg backdrop-blur-md transition hover:bg-red-500"
                        title="删除文件夹"
                    >
                        <Minus size={14} strokeWidth={3} />
                    </button>
                    <button
                        onClick={(event) => {
                            event.stopPropagation();
                            onEdit?.(app);
                        }}
                        className="absolute right-0 top-0 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-white/90 text-slate-900 shadow-lg backdrop-blur-md transition hover:bg-white"
                        title="编辑文件夹"
                    >
                        <Edit3 size={12} />
                    </button>
                </>
            )}
        </div>
    );
}
