import React, { useState, useRef, useEffect } from 'react';

// 内联 SVG 图标组件
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
);

const BingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">
        <defs>
            <linearGradient id="bingGrad" x1="24" y1="8" x2="24" y2="42" gradientUnits="userSpaceOnUse">
                <stop offset="0%" style={{stopColor:"#00BFA5"}} />
                <stop offset="100%" style={{stopColor:"#00897B"}} />
            </linearGradient>
        </defs>
        <path fill="#00897B" d="M13,8l4.5,14.5l11,3l-11,6.5l-3-10L13,8z"/>
        <path fill="#00BFA5" d="M13,8v34l7.5-4.5l11-6.5l-11-3L13,8z"/>
        <path fill="url(#bingGrad)" d="M28.5,23l-11-3L20.5,32L32,27.5L28.5,23z"/>
    </svg>
);

const BaiduIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">
        <circle cx="16" cy="16" r="4" fill="#3385FF"/>
        <circle cx="32" cy="16" r="4" fill="#3385FF"/>
        <ellipse cx="10" cy="24" rx="3" ry="5" fill="#3385FF"/>
        <ellipse cx="38" cy="24" rx="3" ry="5" fill="#3385FF"/>
        <path fill="#3385FF" d="M24,20c-6,0-10,4-12,8c-1,2,0,6,4,8c4,2,16,2,20,0c4-2,5-6,4-8C38,24,30,20,24,20z"/>
        <circle cx="20" cy="30" r="1.5" fill="#FFF"/>
        <circle cx="28" cy="30" r="1.5" fill="#FFF"/>
    </svg>
);

const DuckDuckGoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">
        <circle cx="24" cy="24" r="20" fill="#DE5833"/>
        <circle cx="24" cy="20" r="14" fill="#FFF"/>
        <circle cx="19" cy="18" r="2" fill="#000"/>
        <circle cx="29" cy="18" r="2" fill="#000"/>
        <path fill="#65BC47" d="M24,32c-4,0-8-2-10-5h20C32,30,28,32,24,32z"/>
        <ellipse cx="24" cy="12" rx="8" ry="3" fill="#FFF" opacity="0.5"/>
    </svg>
);

const searchEngines = {
    google: {
        url: 'https://www.google.com/search?q=',
        icon: GoogleIcon,
        name: 'Google'
    },
    bing: {
        url: 'https://www.bing.com/search?q=',
        icon: BingIcon,
        name: 'Bing'
    },
    baidu: {
        url: 'https://www.baidu.com/s?wd=',
        icon: BaiduIcon,
        name: '百度'
    },
    duckduckgo: {
        url: 'https://duckduckgo.com/?q=',
        icon: DuckDuckGoIcon,
        name: 'DuckDuckGo'
    }
};

export default function SearchBar({ searchEngine = 'google' }) {
    const [query, setQuery] = useState('');
    const [engine, setEngine] = useState(searchEngine);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // 引用下拉菜单容器
    const currentEngine = searchEngines[engine] || searchEngines.google;
    const IconComponent = currentEngine.icon;

    // 监听点击外部和 ESC 键
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isDropdownOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            const searchUrl = currentEngine.url + encodeURIComponent(query);
            window.open(searchUrl, '_blank');
        }
    };

    const handleEngineSelect = (key) => {
        setEngine(key);
        setIsDropdownOpen(false);
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-8 relative z-50">
            <form onSubmit={handleSearch}>
                <div className="relative">
                    {/* 搜索输入框 */}
                    <div className="relative flex items-center">
                        {/* 左侧图标下拉选择器 */}
                        <div
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                            ref={dropdownRef} // 绑定引用
                        >
                            <div className="relative outline-none">
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-all p-1.5 border border-gray-200 hover:border-gray-300 outline-none"
                                    title={currentEngine.name}
                                >
                                    <IconComponent />
                                </button>

                                {/* 下拉菜单 */}
                                {isDropdownOpen && (
                                    <>
                                        {/* 移除全屏遮罩 div，改用 useEffect 监听点击外部 */}
                                        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[101] min-w-[160px]">
                                            {Object.entries(searchEngines).map(([key, engine]) => {
                                                const Icon = engine.icon;
                                                return (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => handleEngineSelect(key)}
                                                        className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors ${
                                                            key === engine ? 'bg-blue-50' : ''
                                                        }`}
                                                    >
                                                        <div className="w-6 h-6 flex-shrink-0">
                                                            <Icon />
                                                        </div>
                                                        <span className="text-gray-800 text-sm">{engine.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`用 ${currentEngine.name} 搜索...`}
                            className="w-full pl-20 pr-6 py-4 text-lg bg-white rounded-full border-2 border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500 transition-all"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}