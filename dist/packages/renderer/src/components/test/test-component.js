"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestComponent = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const TestComponent = () => {
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            padding: '20px',
            backgroundColor: 'red',
            color: 'white',
            fontSize: '16px'
        }, children: [(0, jsx_runtime_1.jsx)("h3", { children: "TEST COMPONENT RENDERING" }), (0, jsx_runtime_1.jsx)("div", { children: "This should appear as styled HTML, not as text" }), (0, jsx_runtime_1.jsx)("button", { children: "Test Button" })] }));
};
exports.TestComponent = TestComponent;
//# sourceMappingURL=test-component.js.map