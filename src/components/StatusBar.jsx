import React from 'react';
import { X, Edit3, Settings } from 'lucide-react';
import { formatTime } from '../utils/helpers';

export default function StatusBar({ currentTime, editMode, onToggleEdit, onOpenSettings }) {
    return (
        <div className="absolute top-0 w-full p-4 flex justify-between items-start text-white/90 text-sm font-medium z-30">
            <div className="pl-4 flex items-center gap-3">
                <span className="text-base">{formatTime(currentTime)}</span>
            </div>
            <div className="pr-4 flex flex-col gap-2 items-end">
                <button
                    onClick={onToggleEdit}
                    className={`p-2 rounded-full transition-colors cursor-pointer ${
                        editMode ? 'bg-yellow-500 text-white' : 'bg-white/20 hover:bg-white/30'
                    }`}
                    title={editMode ? '完成' : '编辑'}
                >
                    {editMode ? <X size={18} /> : <Edit3 size={18} />}
                </button>
                <button
                    onClick={onOpenSettings}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
                    title="设置"
                >
                    <Settings size={18} />
                </button>
            </div>
        </div>
    );
}