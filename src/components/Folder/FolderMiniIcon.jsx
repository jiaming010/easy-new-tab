import React from 'react';
import { iconLibrary } from '../../utils/iconLibrary';
import { fetchIconWithCache } from '../../utils/iconCache';
import { getInitials } from '../../utils/helpers';

export default function FolderMiniIcon({ app }) {
    const [cachedIcon, setCachedIcon] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [loadFailed, setLoadFailed] = React.useState(false);
    const hasCustomIcon = app.useCustomIcon && app.customIcon;
    const IconComponent = iconLibrary[app.iconName] || iconLibrary.Globe;
    const initials = getInitials(app.name);

    React.useEffect(() => {
        if (hasCustomIcon) {
            setCachedIcon(app.customIcon);
            setIsLoading(false);
            setLoadFailed(false);
        } else if (app.useFavicon && app.url && !app.iconLoadFailed) {
            setIsLoading(true);
            setLoadFailed(false);
            fetchIconWithCache(app.url, { timeout: 5000 })
                .then(dataUrl => {
                    if (dataUrl) {
                        setCachedIcon(dataUrl);
                        setLoadFailed(false);
                    } else {
                        setLoadFailed(true);
                    }
                })
                .catch(() => {
                    setLoadFailed(true);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [app.customIcon, app.useCustomIcon, app.useFavicon, app.url, app.iconLoadFailed, hasCustomIcon]);

    return (
        <div className={`aspect-square rounded-md overflow-hidden ${(app.useFavicon || hasCustomIcon) ? 'bg-white' : app.color} flex items-center justify-center relative shadow-sm`}>
            {/* 渐变光效 - 与 AppIcon 统一 */}
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
                    <div className="w-3 h-3 bg-white/30 rounded"></div>
                </div>
            )}

            {/* 文字图标 - 加载失败时显示 */}
            {app.useFavicon && (loadFailed || !cachedIcon) && !isLoading && !hasCustomIcon && (
                <span className="text-[10px] font-bold text-white relative z-10 drop-shadow-sm">
                    {initials}
                </span>
            )}

            {/* 默认图标库图标 */}
            {!app.useFavicon && !hasCustomIcon && (
                <IconComponent size={12} className="relative z-10" />
            )}
        </div>
    );
}