import React from 'react';
import { iconLibrary } from '../../utils/iconLibrary';
import { fetchIconWithCache } from '../../utils/iconCache';
import { getInitials } from '../../utils/helpers';

export default function FolderMiniIcon({ app }) {
    const [cachedIcon, setCachedIcon] = React.useState(null);
    const hasCustomIcon = app.useCustomIcon && app.customIcon;
    const IconComponent = iconLibrary[app.iconName] || iconLibrary.Globe;
    const initials = getInitials(app.name);

    React.useEffect(() => {
        if (hasCustomIcon) {
            setCachedIcon(app.customIcon);
        } else if (app.useFavicon && app.url && !app.iconLoadFailed) {
            fetchIconWithCache(app.url, { timeout: 5000 })
                .then(dataUrl => {
                    if (dataUrl) setCachedIcon(dataUrl);
                })
                .catch(() => {});
        }
    }, [app.customIcon, app.useCustomIcon, app.useFavicon, app.url, app.iconLoadFailed, hasCustomIcon]);

    return (
        <div className="aspect-square rounded-md overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center relative shadow-sm">
            {hasCustomIcon && cachedIcon && (
                <img
                    src={cachedIcon}
                    alt={app.name}
                    className="w-full h-full object-cover"
                />
            )}

            {app.useFavicon && !hasCustomIcon && cachedIcon && (
                <img
                    src={cachedIcon}
                    alt={app.name}
                    className="w-4/5 h-4/5 object-contain"
                />
            )}

            {app.useFavicon && !cachedIcon && (
                <span className="text-[10px] font-bold text-white">
                    {initials}
                </span>
            )}

            {!app.useFavicon && !hasCustomIcon && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    <div className={`absolute inset-0 ${app.color}`} />
                    <IconComponent size={12} className="relative z-10" />
                </>
            )}
        </div>
    );
}