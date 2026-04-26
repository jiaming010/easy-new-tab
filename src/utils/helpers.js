export const getInitials = (name) => {
    if (!name) return '?';
    if (/[\u4e00-\u9fa5]/.test(name)) return name.slice(0, 2);

    const words = name.trim().split(/\s+/);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
};

export const formatTime = (date) => {
    return date.toLocaleTimeString('zh-CN', { hour: 'numeric', minute: '2-digit', hour12: false });
};

export const formatDate = (date) => {
    return date.toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' });
};
