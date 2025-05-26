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
exports.AnalyticsDashboard = void 0;
const react_1 = __importStar(require("react"));
const METRICS = [
    { title: 'Total Tasks Completed', value: '1,247', change: '+12%', trend: 'up', icon: '✅' },
    { title: 'Workflow Executions', value: '856', change: '+8%', trend: 'up', icon: '⚡' },
    { title: 'Tools Used', value: '34', change: '+3', trend: 'up', icon: '🛠️' },
    { title: 'Success Rate', value: '94.7%', change: '-0.2%', trend: 'down', icon: '📊' }
];
const ACTIVITIES = [
    { id: 1, action: 'Workflow completed', time: '2 min ago', status: 'success' },
    { id: 2, action: 'Tool installed', time: '15 min ago', status: 'info' },
    { id: 3, action: 'Agent activated', time: '1 hour ago', status: 'success' }
];
const AnalyticsDashboard = () => {
    const [selectedPeriod, setSelectedPeriod] = (0, react_1.useState)('7d');
    return (<div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
      <div style={{ padding: '20px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' }}>📊 Analytics Dashboard</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>Performance metrics and insights</p>
      </div>

      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
        }}>
          {METRICS.map((metric, index) => (<div key={index} style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>{metric.icon}</span>
                <span style={{
                fontSize: '12px',
                color: metric.trend === 'up' ? '#059669' : metric.trend === 'down' ? '#dc2626' : '#6b7280'
            }}>
                  {metric.change}
                </span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>
                {metric.value}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {metric.title}
              </div>
            </div>))}
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Recent Activities</h3>
          </div>
          <div style={{ padding: '20px' }}>
            {ACTIVITIES.map(activity => (<div key={activity.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: activity.status === 'success' ? '#059669' : '#3b82f6'
            }}/>
                <div>
                  <div style={{ fontSize: '14px' }}>{activity.action}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{activity.time}</div>
                </div>
              </div>))}
          </div>
        </div>
      </div>
    </div>);
};
exports.AnalyticsDashboard = AnalyticsDashboard;
//# sourceMappingURL=analytics-dashboard.js.map