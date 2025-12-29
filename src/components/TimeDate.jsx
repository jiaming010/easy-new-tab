import React from 'react';
import { formatTime, formatDate } from '../utils/helpers';

export default function TimeDate({ currentTime }) {
    return (
        <div className="mb-10 text-center text-white drop-shadow-lg select-none">
            <h1 className="text-8xl font-light tracking-tight mb-3">
                {formatTime(currentTime)}
            </h1>
            <p className="text-2xl font-medium opacity-90">
                {formatDate(currentTime)}
            </p>
        </div>
    );
}