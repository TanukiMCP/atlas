"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cn = cn;
exports.formatFileSize = formatFileSize;
exports.formatTimeAgo = formatTimeAgo;
exports.truncateText = truncateText;
exports.getFileExtension = getFileExtension;
exports.isImageFile = isImageFile;
exports.isCodeFile = isCodeFile;
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
// TanukiMCP specific utilities
function formatFileSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0)
        return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}
function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60)
        return 'just now';
    if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}
function truncateText(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength - 3) + '...';
}
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}
function isImageFile(filename) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'];
    return imageExtensions.includes(getFileExtension(filename).toLowerCase());
}
function isCodeFile(filename) {
    const codeExtensions = [
        'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go',
        'rs', 'swift', 'kt', 'dart', 'vue', 'svelte', 'html', 'css', 'scss', 'sass',
        'less', 'json', 'xml', 'yaml', 'yml', 'toml', 'ini', 'cfg', 'conf'
    ];
    return codeExtensions.includes(getFileExtension(filename).toLowerCase());
}
//# sourceMappingURL=utils.js.map