import React from 'react';
import { Check, Edit3, Settings } from 'lucide-react';

export default function StatusBar({ editMode, onToggleEdit, onOpenSettings }) {
    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4 text-white">
            <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/35 p-2 shadow-2xl shadow-black/35 backdrop-blur-2xl">
                <button
                    onClick={onToggleEdit}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 active:scale-95 ${
                        editMode
                            ? 'border-white bg-white text-slate-950 shadow-lg'
                            : 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                    }`}
                    title={editMode ? '完成编辑' : '编辑快捷方式'}
                >
                    {editMode ? <Check size={21} strokeWidth={2.5} /> : <Edit3 size={19} />}
                </button>

                <button
                    onClick={onOpenSettings}
                    className={`group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all duration-200 hover:bg-white/20 active:scale-95 ${
                        editMode ? 'pointer-events-none w-0 scale-75 opacity-0' : 'opacity-100'
                    }`}
                    title="设置"
                >
                    <Settings size={21} className="transition-transform duration-500 group-hover:rotate-90" />
                </button>
            </div>
        </div>
    );
}
