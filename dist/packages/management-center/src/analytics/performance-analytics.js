"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceAnalytics = void 0;
const react_1 = __importDefault(require("react"));
const PerformanceAnalytics = () => {
    return (<div className="performance-analytics p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Analyze system performance and optimization opportunities</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-2">Average Response Time</h3>
          <p className="text-3xl font-bold text-blue-600">245ms</p>
          <p className="text-sm text-gray-500">↓ 12% from last week</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-2">Tool Execution Rate</h3>
          <p className="text-3xl font-bold text-green-600">98.5%</p>
          <p className="text-sm text-gray-500">↑ 2% from last week</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-2">Memory Efficiency</h3>
          <p className="text-3xl font-bold text-purple-600">87%</p>
          <p className="text-sm text-gray-500">→ Stable</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4">Optimization Recommendations</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium">Memory Usage Optimization</p>
              <p className="text-sm text-gray-600">Consider increasing memory allocation for external MCP servers</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium">Tool Cache Improvement</p>
              <p className="text-sm text-gray-600">Enable caching for frequently used tools to reduce response time</p>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
exports.PerformanceAnalytics = PerformanceAnalytics;
//# sourceMappingURL=performance-analytics.js.map