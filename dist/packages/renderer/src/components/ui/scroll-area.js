"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollArea = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
exports.ScrollArea = react_1.default.forwardRef(({ children, className = '', ...props }, ref) => {
    return ((0, jsx_runtime_1.jsx)("div", { ref: ref, className: `overflow-auto ${className}`, ...props, children: children }));
});
exports.ScrollArea.displayName = 'ScrollArea';
//# sourceMappingURL=scroll-area.js.map