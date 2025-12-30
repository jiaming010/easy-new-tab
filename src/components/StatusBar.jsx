import React from 'react';
import { Edit3, Settings, Check } from 'lucide-react';
import { formatTime } from '../utils/helpers';

export default function StatusBar({ currentTime, editMode, onToggleEdit, onOpenSettings }) {
    return (
        <div className="absolute top-0 w-full p-4 sm:p-6 flex justify-between items-center text-white z-30 pointer-events-none select-none outline-none">
            {/* 左侧时间显示 */}
            <div className="pl-2 flex items-center pointer-events-auto ">
                <span className="text-sm font-medium tracking-wide opacity-80 drop-shadow-sm font-[monospaced]">
                    {formatTime(currentTime)}
                </span>
            </div>

            {/* 右侧功能按钮组 */}
            <div className="pr-2 flex items-center gap-3 pointer-events-auto outline-none">

                {/* 编辑/完成切换按钮 */}
                <button
                    onClick={onToggleEdit}
                    className={`
                        flex items-center justify-center w-10 h-10 rounded-full 
                        backdrop-blur-md border shadow-lg 
                        transition-all duration-300 ease-out active:scale-90
                        outline-none
                        ${editMode
                        ? 'bg-white text-gray-900 border-white/50 hover:bg-gray-100 rotate-0'
                        : 'bg-white/10 text-white border-white/10 hover:bg-white/20 rotate-0'
                    }
                    `}
                    title={editMode ? '完成' : '编辑'}
                >
                    {editMode ? (
                        <Check size={20} strokeWidth={2.5} />
                    ) : (
                        <Edit3 size={18} />
                    )}
                </button>

                {/* 设置按钮 - 编辑模式下自动隐藏 */}
                <button
                    onClick={onOpenSettings}
                    className={`
                        group flex items-center justify-center w-10 h-10 rounded-full 
                        bg-white/10 backdrop-blur-md border border-white/10 shadow-lg 
                        transition-all duration-300 ease-out
                        hover:bg-white/20 active:scale-90
                        outline-none
                        ${editMode ? 'opacity-0 translate-x-4 scale-75 pointer-events-none' : 'opacity-100 translate-x-0 scale-100'}
                    `}
                    title="设置"
                >
                    <Settings
                        size={20}
                        className="opacity-90 transition-transform duration-500 group-hover:rotate-90"
                    />
                </button>
            </div>
        </div>
    );
}