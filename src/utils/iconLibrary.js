import {
    Search, Plus, X, Folder, Globe,
    Github, Mail, Music, Image as ImageIcon,
    Settings, Compass, MessageSquare, Video,
    Twitter, ShoppingBag, Calendar, Bookmark,
    Home, FileText, Code, Coffee, Smartphone,
    Book, Briefcase, Camera, Clock, Cloud,
    Database, Edit, Film, Heart, Key,
    Layers, Link, MapPin, Monitor, Package,
    Phone, Printer, Radio, Server, Share,
    Shield, Star, Terminal, Trash, Upload,
    User, Users, Wifi, Youtube, Facebook,
    Instagram, Linkedin, Slack, Trello,
    Figma, Dribbble, Chrome, Zap,
    History // 1. 新增引入 History 图标
} from 'lucide-react';

// 图标库
export const iconLibrary = {
    Search, Plus, X, Folder, Globe,
    Github, Mail, Music, ImageIcon,
    Settings, Compass, MessageSquare, Video,
    Twitter, ShoppingBag, Calendar, Bookmark,
    Home, FileText, Code, Coffee, Smartphone,
    Book, Briefcase, Camera, Clock, Cloud,
    Database, Edit, Film, Heart, Key,
    Layers, Link, MapPin, Monitor, Package,
    Phone, Printer, Radio, Server, Share,
    Shield, Star, Terminal, Trash, Upload,
    User, Users, Wifi, Youtube, Facebook,
    Instagram, Linkedin, Slack, Trello,
    Figma, Dribbble, Chrome, Zap,
    History // 2. 导出 History 图标
};

// 颜色预设
export const colorPresets = [
    { name: '灰色', value: 'bg-gray-500 text-white' },
    { name: '红色', value: 'bg-red-500 text-white' },
    { name: '橙色', value: 'bg-orange-500 text-white' },
    { name: '黄色', value: 'bg-yellow-500 text-white' },
    { name: '绿色', value: 'bg-green-500 text-white' },
    { name: '青色', value: 'bg-teal-500 text-white' },
    { name: '蓝色', value: 'bg-blue-500 text-white' },
    { name: '靛蓝', value: 'bg-indigo-500 text-white' },
    { name: '紫色', value: 'bg-purple-500 text-white' },
    { name: '粉色', value: 'bg-pink-500 text-white' },
    { name: '黑色', value: 'bg-gray-900 text-white' },
    { name: '白色', value: 'bg-white text-gray-800' },
];

// 默认应用数据
export const DEFAULT_APPS = [
    { id: '1', type: 'app', name: 'Google', url: 'https://google.com', iconName: 'Search', color: 'bg-white text-gray-800', useFavicon: true },
    { id: '2', type: 'app', name: 'GitHub', url: 'https://github.com', iconName: 'Github', color: 'bg-gray-900 text-white', useFavicon: true },
    { id: '3', type: 'app', name: 'Gmail', url: 'https://mail.google.com', iconName: 'Mail', color: 'bg-red-500 text-white', useFavicon: true },
    { id: '4', type: 'app', name: 'YouTube', url: 'https://youtube.com', iconName: 'Youtube', color: 'bg-red-600 text-white', useFavicon: true },
    { id: '5', type: 'app', name: 'Twitter', url: 'https://x.com', iconName: 'Twitter', color: 'bg-blue-400 text-white', useFavicon: true },
    { id: '6', type: 'app', name: 'Instagram', url: 'https://instagram.com', iconName: 'Instagram', color: 'bg-pink-500 text-white', useFavicon: true },
    // 3. 新增两个默认应用：历史记录和书签
    { id: '7', type: 'app', name: 'History', url: 'chrome://history', iconName: 'History', color: 'bg-orange-500 text-white', useFavicon: false },
    { id: '8', type: 'app', name: 'Bookmarks', url: 'chrome://bookmarks', iconName: 'Bookmark', color: 'bg-teal-500 text-white', useFavicon: false },
];