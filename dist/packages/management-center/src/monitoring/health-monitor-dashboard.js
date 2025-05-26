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
exports.HealthMonitorDashboard = void 0;
const react_1 = __importStar(require("react"));
const HealthMonitorDashboard = () => {
    const [timeRange, setTimeRange] = (0, react_1.useState)('1h');
    const [isMonitoring, setIsMonitoring] = (0, react_1.useState)(true);
    const healthMetrics = [
        { title: 'Overall Health', value: '98%', status: 'good', icon: '💓' },
        { title: 'CPU Usage', value: '45%', status: 'good', icon: '🔥' },
        { title: 'Memory Usage', value: '60%', status: 'warning', icon: '💾' },
        { title: 'Active Servers', value: '5/5', status: 'good', icon: '🔧' }
    ];
    const serverStatuses = [
        { id: '1', name: 'Built-in MCP Server', status: 'healthy' },
        { id: '2', name: 'External MCP Server 1', status: 'healthy' },
        { id: '3', name: 'External MCP Server 2', status: 'warning' },
        { id: '4', name: 'Tool Router', status: 'healthy' },
        { id: '5', name: 'LLM Enhanced', status: 'healthy' }
    ];
    const getStatusColor = (status) => {
        switch (status) {
            case 'good':
            case 'healthy':
                return 'bg-green-500';
            case 'warning':
                return 'bg-yellow-500';
            case 'error':
            case 'offline':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };
    return (<div className="health-monitor p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Health Monitoring</h1>
          <p className="text-gray-600 dark:text-gray-400">Real-time system health and performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}/>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isMonitoring ? 'Live' : 'Stopped'}
            </span>
          </div>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthMetrics.map((metric, index) => (<div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
              </div>
              <div className="text-2xl">{metric.icon}</div>
            </div>
            <div className={`mt-2 w-full h-2 rounded-full ${getStatusColor(metric.status)}`}/>
          </div>))}
      </div>

      {/* Server Status List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Server Status</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {serverStatuses.map((server) => (<div key={server.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status)}`}/>
                <span className="text-gray-900 dark:text-white">{server.name}</span>
              </div>
              <span className={`text-sm font-medium ${server.status === 'healthy' ? 'text-green-600' :
                server.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
                {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
              </span>
            </div>))}
        </div>
      </div>
    </div>);
};
exports.HealthMonitorDashboard = HealthMonitorDashboard;
//# sourceMappingURL=health-monitor-dashboard.js.map