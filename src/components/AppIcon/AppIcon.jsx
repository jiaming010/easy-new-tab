import React from 'react';
import { Minus } from 'lucide-react';
import { iconLibrary } from '../../utils/iconLibrary';
import { fetchIconWithCache } from '../../utils/iconCache';
import { getInitials } from '../../utils/helpers';

const sizeClasses = {
    sm: 'h-16 w-16 rounded-2xl',
    md: 'h-20 w-20 rounded-[1.35rem]',
    lg: 'h-28 w-28 rounded-[1.7rem]'
};

const iconSizes = {
    sm: 28,
    md: 40,
    lg: 56
};

const textIconSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
};

export default function AppIcon({
    app,
    size = 'md',
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
                .then((dataUrl) => {
                    if (dataUrl) {
                        setCachedIcon(dataUrl);
                        setLoadFailed(false);
                        if (app.iconLoadFailed && onUpdateApp) onUpdateApp({ ...app, iconLoadFailed: false });
                    } else {
                        setLoadFailed(true);
                        if (onUpdateApp) onUpdateApp({ ...app, iconLoadFailed: true });
                    }
                })
                .catch(() => {
                    setLoadFailed(true);
                    if (onUpdateApp) onUpdateApp({ ...app, iconLoadFailed: true });
                })
                .finally(() => setIsLoading(false));
        }
    }, [app, hasCustomIcon, onUpdateApp]);

    return (
        <div className="group relative flex flex-col items-center gap-2 rounded-2xl p-2">
            <a
                href={editMode ? undefined : app.url}
                target={app.target || '_blank'}
                rel="noopener noreferrer"
                onClick={(event) => {
                    if (onClick) {
                        event.preventDefault();
                        onClick(event);
                    } else if (editMode) {
                        event.preventDefault();
                        onEdit?.(app);
                    } else if (app.url && (app.url.startsWith('chrome://') || app.url.startsWith('edge://'))) {
                        event.preventDefault();
                        if (globalThis.chrome?.tabs) globalThis.chrome.tabs.create({ url: app.url });
                    }
                }}
                onContextMenu={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onEdit?.(app);
                }}
                className={`flex flex-col items-center gap-2 outline-none transition-transform ${editMode ? 'wiggle-animation' : 'active:scale-95'}`}
            >
                <div className={`${sizeClasses[size]} ${(app.useFavicon || hasCustomIcon) ? 'bg-white' : app.color} relative flex items-center justify-center overflow-hidden border border-white/25 shadow-[0_18px_35px_rgba(0,0,0,0.25)] transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_24px_45px_rgba(0,0,0,0.32)] ${editMode ? 'ring-2 ring-white/80' : ''}`}>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-black/10" />

                    {hasCustomIcon && cachedIcon && (
                        <img src={cachedIcon} alt={app.name} className="absolute inset-0 h-full w-full object-cover" />
                    )}

                    {app.useFavicon && !hasCustomIcon && cachedIcon && !loadFailed && (
                        <img src={cachedIcon} alt={app.name} className="relative z-10 h-[68%] w-[68%] object-contain" />
                    )}

                    {app.useFavicon && isLoading && !cachedIcon && !hasCustomIcon && (
                        <div className="relative z-10 h-12 w-12 animate-pulse rounded-xl bg-slate-200" />
                    )}

                    {app.useFavicon && loadFailed && !cachedIcon && !hasCustomIcon && (
                        <span className={`relative z-10 font-bold text-slate-900 ${textIconSizes[size]}`}>{initials}</span>
                    )}

                    {!app.useFavicon && !hasCustomIcon && (
                        <IconComponent size={iconSizes[size]} className="relative z-10" />
                    )}
                </div>

                <span className="max-w-24 truncate text-sm font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                    {app.name}
                </span>
            </a>

            {(editMode || showDeleteButton) && (
                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        onDelete?.(app.id);
                    }}
                    className="absolute left-0 top-0 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-slate-950/70 text-white shadow-lg backdrop-blur-md transition hover:bg-red-500"
                    title="删除"
                >
                    <Minus size={14} strokeWidth={3} />
                </button>
            )}
        </div>
    );
}
