// 获取网站名称首字母用于文字图标
export const getInitials = (name) => {
    if (!name) return '?';
    // 如果是中文或包含中文字符，取前两个字符
    if (/[\u4e00-\u9fa5]/.test(name)) {
        return name.slice(0, 2);
    }
    // 英文取首字母，最多两个
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

// 时间格式化
export const formatTime = (date) => {
    return date.toLocaleTimeString('zh-CN', { hour: 'numeric', minute: '2-digit', hour12: false });
};

// 日期格式化
export const formatDate = (date) => {
    return date.toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' });
};