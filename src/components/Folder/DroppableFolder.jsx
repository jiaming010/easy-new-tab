import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit3, Minus } from 'lucide-react'; // 引入 Minus
import { motion } from 'framer-motion';
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
        zIndex: isDragging || isOver ? 50 : 'auto',
    };

    const displayApps = [...app.apps.slice(0, 9)];
    while (displayApps.length < 9) {
        displayApps.push({ id: `empty-${displayApps.length}`, isEmpty: true });
    }

    return (
        <div
            className="relative flex flex-col items-center gap-1 touch-none outline-none"
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <div
                className="flex flex-col items-center gap-1 cursor-pointer group"
                onClick={!isDragging ? onClick : undefined}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onEdit) {
                        onEdit(app);
                    }
                }}
            >
                <motion.div
                    animate={isOver ? "hover" : "idle"}
                    variants={{
                        idle: {
                            scale: 1,
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            boxShadow: "0 0 0px rgba(0,0,0,0)"
                        },
                        hover: {
                            scale: 1.15,
                            backgroundColor: "rgba(255, 255, 255, 0.35)",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255,255,255,0.3)"
                        }
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                    }}
                    className={`grid grid-cols-3 gap-1.5 p-2.5 backdrop-blur-md ${sizeClasses[size]} overflow-hidden border border-white/10 ${
                        editMode ? 'ring-2 ring-yellow-400' : ''
                    }`}
                >
                    {displayApps.map((subApp, idx) => (
                        <div key={subApp.id || idx} className="relative z-10">
                            {subApp.isEmpty ? (
                                <div className="aspect-square rounded-md bg-white/5 border border-white/5" />
                            ) : (
                                <FolderMiniIcon app={subApp} />
                            )}
                        </div>
                    ))}
                </motion.div>

                <span className="text-sm text-white font-medium drop-shadow-md transition-opacity duration-200">
                    {app.name}
                </span>
            </div>

            {/* 编辑模式下的操作按钮 */}
            {editMode && (
                <>
                    {/* 左上角删除按钮 (iOS 风格) */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(app.id);
                        }}
                        className="absolute -top-2 -left-2 z-20 w-6 h-6 bg-gray-500/80 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-red-500 transition-colors shadow-sm"
                        title="删除文件夹"
                    >
                        <Minus size={14} strokeWidth={3} />
                    </button>

                    {/* 右上角编辑按钮 (保留用于重命名，样式微调) */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(app);
                        }}
                        className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-blue-500/80 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm"
                        title="编辑文件夹"
                    >
                        <Edit3 size={12} />
                    </button>
                </>
            )}
        </div>
    );
}