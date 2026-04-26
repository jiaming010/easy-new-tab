import {
    Bookmark, Briefcase, Calendar, Camera, Chrome, Clock, Cloud, Code, Coffee, Compass,
    Database, Dribbble, Edit, Facebook, Figma, FileText, Film, Folder, Github, Globe,
    Heart, History, Home, Image as ImageIcon, Instagram, Key, Layers, Linkedin, Link,
    Mail, MapPin, MessageSquare, Monitor, Music, Package, Phone, Plus, Printer, Radio,
    Search, Server, Settings, Share, Shield, ShoppingBag, Slack, Smartphone, Star,
    Terminal, Trash, Trello, Twitter, Upload, User, Users, Video, Wifi, X, Youtube, Zap
} from 'lucide-react';

export const iconLibrary = {
    Search, Plus, X, Folder, Globe,
    Github, Mail, Music, ImageIcon,
    Settings, Compass, MessageSquare, Video,
    Twitter, ShoppingBag, Calendar, Bookmark,
    Home, FileText, Code, Coffee, Smartphone,
    Book: FileText, Briefcase, Camera, Clock, Cloud,
    Database, Edit, Film, Heart, Key,
    Layers, Link, MapPin, Monitor, Package,
    Phone, Printer, Radio, Server, Share,
    Shield, Star, Terminal, Trash, Upload,
    User, Users, Wifi, Youtube, Facebook,
    Instagram, Linkedin, Slack, Trello,
    Figma, Dribbble, Chrome, Zap, History
};

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

export const DEFAULT_APPS = [
    { id: '1', type: 'app', name: 'Google', url: 'https://google.com', iconName: 'Search', color: 'bg-white text-gray-800', useFavicon: true },
    { id: '2', type: 'app', name: 'GitHub', url: 'https://github.com', iconName: 'Github', color: 'bg-gray-900 text-white', useFavicon: true },
    { id: '3', type: 'app', name: 'Gmail', url: 'https://mail.google.com', iconName: 'Mail', color: 'bg-red-500 text-white', useFavicon: true },
    { id: '4', type: 'app', name: 'YouTube', url: 'https://youtube.com', iconName: 'Youtube', color: 'bg-red-600 text-white', useFavicon: true },
    { id: '5', type: 'app', name: 'X', url: 'https://x.com', iconName: 'Twitter', color: 'bg-slate-900 text-white', useFavicon: true },
    { id: '6', type: 'app', name: 'Instagram', url: 'https://instagram.com', iconName: 'Instagram', color: 'bg-pink-500 text-white', useFavicon: true },
    { id: '7', type: 'app', name: 'History', url: 'chrome://history', iconName: 'History', color: 'bg-orange-500 text-white', useFavicon: false, target: '_self' },
    { id: '8', type: 'app', name: 'Bookmarks', url: 'chrome://bookmarks', iconName: 'Bookmark', color: 'bg-teal-500 text-white', useFavicon: false, target: '_self' },
];
