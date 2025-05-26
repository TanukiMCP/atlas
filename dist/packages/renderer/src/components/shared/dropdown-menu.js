"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownMenu = void 0;
const react_1 = __importStar(require("react"));
const DropdownMenu = ({ label, items }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    return (<div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="px-3 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
        {label}
      </button>
      
      {isOpen && (<div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {items.map((item, index) => (item.type === 'separator' ? (<div key={index} className="border-t border-gray-200 dark:border-gray-700 my-1"/>) : (<button key={index} onClick={() => {
                    item.action?.();
                    setIsOpen(false);
                }} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center">
                <span>{item.label}</span>
                {item.shortcut && (<span className="text-xs text-gray-500">{item.shortcut}</span>)}
              </button>)))}
        </div>)}
    </div>);
};
exports.DropdownMenu = DropdownMenu;
//# sourceMappingURL=dropdown-menu.js.map