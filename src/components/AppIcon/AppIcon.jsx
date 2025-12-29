import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { iconLibrary } from '../../utils/iconLibrary';
import { fetchIconWithCache } from '../../utils/iconCache';
import { getInitials } from '../../utils/helpers';

const sizeClasses = {
    sm: "w-16 h-16 rounded-xl",
    md: "w-20 h-20 rounded-2xl",
    lg: "w-28 h-28 rounded-3xl"
};

const iconSizes = {
    sm: 28,
    md: 40,
    lg: 56
};

const textIconSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl"
};

export default function AppIcon({
                                    app,
                                    size = "md",
                                    onClick,
                                    onEdit,
                                    onDelete,
                                    onUpdateApp,
                                    editMode,
                                    showDeleteButton = false
                                }) {
    const [cachedIcon, setCachedIcon] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [loadFailed, setLoadFailed] = React.useState(false);

    const IconComponent = iconLibrary[app.iconName] || iconLibrary.Globe;
    const initials = getInitials(app.name);
    const hasCustomIcon = app.useCustomIcon && app.customIcon;

    // 加载高清缓存图标
    React.useEffect(() => {
        if (hasCustomIcon) {
            setCachedIcon(app.customIcon);
            setIsLoading(false);
            setLoadFailed(false);
            return;
        }

        if (app.useFavicon && app.url) {
            if (app.iconLoadFailed) {
                setCachedIcon(null);
                setLoadFailed(true);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setLoadFailed(false);
            setCachedIcon(null);

            fetchIconWithCache(app.url, { timeout: 8000 })
                .then(dataUrl => {
                    if (dataUrl) {
                        setCachedIcon(dataUrl);
                        setLoadFailed(false);
                        if (app.iconLoadFailed && onUpdateApp) {
                            onUpdateApp({ ...app, iconLoadFailed: false });
                        }
                    } else {
                        setLoadFailed(true);
                        if (onUpdateApp) {
                            onUpdateApp({ ...app, iconLoadFailed: true });
                        }
                    }
                })
                .catch(() => {
                    setLoadFailed(true);
                    if (onUpdateApp) {
                        onUpdateApp({ ...app, iconLoadFailed: true });
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [app.customIcon, app.useFavicon, app.url, app.iconLoadFailed, app.useCustomIcon, hasCustomIcon]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="relative flex flex-col items-center gap-1">
            <a
                href={editMode ? undefined : app.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                    if (onClick) {
                        e.preventDefault();
                        onClick(e);
                    } else if (editMode) {
                        e.preventDefault();
                    }
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onEdit) {
                        onEdit(app);
                    }
                }}
                className={`flex flex-col items-center gap-1 group cursor-pointer transition-transform ${editMode ? '' : 'active:scale-90'}`}
            >
                <div className={`${sizeClasses[size]} ${(app.useFavicon || hasCustomIcon) ? 'bg-white' : app.color} flex items-center justify-center shadow-lg relative overflow-hidden ${editMode ? 'ring-2 ring-yellow-400' : ''}`}>
                    {/* 渐变光效 */}
                    {!app.useFavicon && !hasCustomIcon && (
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    )}

                    {/* 自定义图标 */}
                    {hasCustomIcon && cachedIcon && (
                        <img
                            src={cachedIcon}
                            alt={app.name}
                            className="w-full h-full object-cover absolute inset-0"
                            style={{ imageRendering: 'high-quality' }}
                        />
                    )}

                    {/* 网站 Favicon */}
                    {app.useFavicon && !hasCustomIcon && cachedIcon && !loadFailed && (
                        <img
                            src={cachedIcon}
                            alt={app.name}
                            className="w-[70%] h-[70%] object-contain relative z-10"
                            style={{ imageRendering: 'high-quality' }}
                        />
                    )}

                    {/* 加载中 */}
                    {app.useFavicon && isLoading && !cachedIcon && !hasCustomIcon && (
                        <div className="relative z-10 animate-pulse">
                            <div className="w-12 h-12 bg-white/30 rounded-lg"></div>
                        </div>
                    )}

                    {/* 文字图标 */}
                    {app.useFavicon && loadFailed && !cachedIcon && !hasCustomIcon && (
                        <div className="relative z-10 text-white font-bold">
                            <span className={`${textIconSizes[size]} drop-shadow-lg`}>
                                {initials}
                            </span>
                        </div>
                    )}

                    {/* 默认图标库图标 */}
                    {!app.useFavicon && !hasCustomIcon && (
                        <IconComponent
                            size={iconSizes[size]}
                            className="relative z-10"
                        />
                    )}
                </div>
                <span className="text-sm text-white font-medium drop-shadow-md">{app.name}</span>
            </a>
            {(editMode || showDeleteButton) && (
                <div className="absolute -top-2 -right-2 flex gap-1 z-10">
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