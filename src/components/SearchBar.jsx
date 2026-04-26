import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);

const BingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">
        <path fill="#00897B" d="M13 8v34l7.5-4.5 11-6.5-11-3L13 8z" />
        <path fill="#00BFA5" d="m13 8 4.5 14.5 11 3-11 6.5-3-10L13 8z" />
        <path fill="#0bb7a7" d="m28.5 23-11-3 3 12L32 27.5 28.5 23z" />
    </svg>
);

const BaiduIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">
        <circle cx="16" cy="16" r="4" fill="#3385FF" />
        <circle cx="32" cy="16" r="4" fill="#3385FF" />
        <ellipse cx="10" cy="24" rx="3" ry="5" fill="#3385FF" />
        <ellipse cx="38" cy="24" rx="3" ry="5" fill="#3385FF" />
        <path fill="#3385FF" d="M24 20c-6 0-10 4-12 8-1 2 0 6 4 8 4 2 16 2 20 0 4-2 5-6 4-8-2-4-10-8-16-8z" />
        <circle cx="20" cy="30" r="1.5" fill="#fff" />
        <circle cx="28" cy="30" r="1.5" fill="#fff" />
    </svg>
);

const DuckDuckGoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">
        <circle cx="24" cy="24" r="20" fill="#DE5833" />
        <circle cx="24" cy="20" r="14" fill="#fff" />
        <circle cx="19" cy="18" r="2" fill="#111" />
        <circle cx="29" cy="18" r="2" fill="#111" />
        <path fill="#65BC47" d="M14 27h20c-2 3-6 5-10 5s-8-2-10-5z" />
    </svg>
);

const searchEngines = {
    google: { url: 'https://www.google.com/search?q=', icon: GoogleIcon, name: 'Google' },
    bing: { url: 'https://www.bing.com/search?q=', icon: BingIcon, name: 'Bing' },
    baidu: { url: 'https://www.baidu.com/s?wd=', icon: BaiduIcon, name: '百度' },
    duckduckgo: { url: 'https://duckduckgo.com/?q=', icon: DuckDuckGoIcon, name: 'DuckDuckGo' },
};

export default function SearchBar({ searchEngine = 'google' }) {
    const [query, setQuery] = useState('');
    const [engine, setEngine] = useState(searchEngine);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const currentEngine = searchEngines[engine] || searchEngines.google;
    const IconComponent = currentEngine.icon;

    useEffect(() => {
        setEngine(searchEngine);
    }, [searchEngine]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        const handleEscKey = (event) => {
            if (event.key === 'Escape') setIsDropdownOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscKey);
        };
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        window.open(currentEngine.url + encodeURIComponent(trimmedQuery), '_blank');
        setQuery('');
    };

    return (
        <div className="relative z-20 mx-auto w-full max-w-2xl px-4 sm:px-0">
            <form onSubmit={handleSearch}>
                <div className="flex h-14 items-center rounded-full border border-white/20 bg-white/[0.94] px-2.5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition focus-within:border-white focus-within:bg-white sm:h-16">
                    <div ref={dropdownRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen((value) => !value)}
                            className="flex h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                            title={`搜索引擎：${currentEngine.name}`}
                        >
                            <span className="h-7 w-7"><IconComponent /></span>
                            <ChevronDown size={15} className={`transition ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute left-0 top-full z-[101] mt-3 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                                {Object.entries(searchEngines).map(([key, option]) => {
                                    const OptionIcon = option.icon;
                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => {
                                                setEngine(key);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                                                key === engine ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                                            }`}
                                        >
                                            <span className="h-6 w-6"><OptionIcon /></span>
                                            <span className="font-medium">{option.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <input
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={`使用 ${currentEngine.name} 搜索`}
                        className="min-w-0 flex-1 bg-transparent px-4 text-base font-medium text-slate-900 placeholder:text-slate-400 sm:text-lg"
                    />
                </div>
            </form>
        </div>
    );
}
