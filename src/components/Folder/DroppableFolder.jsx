import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit3, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion'; // 引入 framer-motion
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
        isOver // dnd-kit 检测是否正在拖拽悬停在上方
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
        // 保证层级，避免被周围元素遮挡
        zIndex: isDragging || isOver ? 50 : 'auto', 
    };

    const displayApps = [...app.apps.slice(0, 9)];
    while (displayApps.length < 9) {
        displayApps.push({ id: `empty-${displayApps.length}`, isEmpty: true });
    }

    return (
        <div
            className="relative flex flex-col items-center gap-1 touch-none"
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
                {/* 使用 motion.div 替代普通 div 以实现丝滑动画 */}
                <motion.div
                    animate={isOver ? "hover" : "idle"}
                    variants={{
                        idle: { 
                            scale: 1, 
                            backgroundColor: "rgba(255, 255, 255, 0.2)", // 这里对应 bg-white/20
                            boxShadow: "0 0 0px rgba(0,0,0,0)"
                        },
                        hover: { 
                            scale: 1.15, // iOS 风格的显著放大
                            backgroundColor: "rgba(255, 255, 255, 0.35)", // 变亮
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255,255,255,0.3)" // 添加柔和阴影和微发光
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
                <div className="absolute -top-2 -right-2 flex gap-1 z-20">
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