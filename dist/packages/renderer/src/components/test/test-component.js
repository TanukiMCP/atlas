"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestComponent = void 0;
const react_1 = __importDefault(require("react"));
const TestComponent = () => {
    return (<div style={{
            padding: '20px',
            backgroundColor: 'red',
            color: 'white',
            fontSize: '16px'
        }}>
      <h3>TEST COMPONENT RENDERING</h3>
      <div>This should appear as styled HTML, not as text</div>
      <button>Test Button</button>
    </div>);
};
exports.TestComponent = TestComponent;
//# sourceMappingURL=test-component.js.map