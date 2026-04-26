import React from 'react';
import { CalendarDays } from 'lucide-react';
import { formatTime, formatDate } from '../utils/helpers';

export default function TimeDate({ currentTime }) {
    return (
        <section className="text-center text-white select-none">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/15 px-4 py-2 text-sm font-medium text-white/85 shadow-lg backdrop-blur-xl">
                <CalendarDays size={16} />
                <span>{formatDate(currentTime)}</span>
            </div>
            <h1 className="mt-5 text-[4.5rem] font-semibold leading-none tracking-normal sm:text-8xl md:text-9xl">
                {formatTime(currentTime)}
            </h1>
        </section>
    );
}
