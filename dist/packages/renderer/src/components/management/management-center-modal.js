"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementCenterModal = void 0;
const react_1 = __importDefault(require("react"));
const _management_center_1 = require("@management-center");
const ManagementCenterModal = ({ isOpen, onClose }) => {
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full h-full max-w-7xl max-h-[90vh] m-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            TanukiMCP Management Center
          </h1>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div className="h-full">
          <_management_center_1.ManagementDashboard />
        </div>
      </div>
    </div>);
};
exports.ManagementCenterModal = ManagementCenterModal;
//# sourceMappingURL=management-center-modal.js.map