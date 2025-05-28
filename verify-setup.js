#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🦝 TanukiMCP Atlas - Setup Verification');
console.log('=====================================\n');

const checks = [
  {
    name: 'Root package.json exists',
    check: () => fs.existsSync('package.json'),
    fix: 'Run setup script again'
  },
  {
    name: 'Main package exists',
    check: () => fs.existsSync('packages/main/package.json'),
    fix: 'Run setup script again'
  },
  {
    name: 'Renderer package exists',
    check: () => fs.existsSync('packages/renderer/package.json'),
    fix: 'Run setup script again'
  },
  {
    name: 'Node modules installed (root)',
    check: () => fs.existsSync('node_modules'),
    fix: 'Run: npm install'
  },
  {
    name: 'Node modules installed (main)',
    check: () => fs.existsSync('packages/main/node_modules'),
    fix: 'Run: cd packages/main && npm install'
  },
  {
    name: 'Node modules installed (renderer)',
    check: () => fs.existsSync('packages/renderer/node_modules'),
    fix: 'Run: cd packages/renderer && npm install'
  },
  {
    name: 'Environment file exists',
    check: () => fs.existsSync('.env'),
    fix: 'Create .env file with required variables'
  },
  {
    name: 'Setup scripts exist',
    check: () => fs.existsSync('setup.bat') && fs.existsSync('setup.sh'),
    fix: 'Setup scripts missing - check repository'
  },
  {
    name: 'Start scripts exist',
    check: () => fs.existsSync('start.bat') && fs.existsSync('start.sh'),
    fix: 'Start scripts missing - check repository'
  }
];

let allPassed = true;

console.log('Running verification checks...\n');

checks.forEach((check, index) => {
  const passed = check.check();
  const status = passed ? '✅' : '❌';
  const message = passed ? 'PASS' : 'FAIL';
  
  console.log(`${index + 1}. ${check.name}: ${status} ${message}`);
  
  if (!passed) {
    console.log(`   Fix: ${check.fix}`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 All checks passed! Your setup is complete.');
  console.log('\n📋 Next steps:');
  console.log('  Windows: Double-click start.bat');
  console.log('  Unix/Linux/macOS: ./start.sh');
  console.log('  Manual: npm run dev (then npm start in another terminal)');
} else {
  console.log('❌ Some checks failed. Please fix the issues above.');
  console.log('\n🔧 Quick fixes:');
  console.log('  1. Re-run the setup script for your platform');
  console.log('  2. Check that Node.js and npm are properly installed');
  console.log('  3. Ensure you have proper permissions in the directory');
}

console.log('\n🆘 Need help? Check the README.md for troubleshooting tips.');

// Try to get version info
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`\n📊 Environment info:`);
  console.log(`  Node.js: ${nodeVersion}`);
  console.log(`  npm: ${npmVersion}`);
  console.log(`  Platform: ${process.platform}`);
  console.log(`  Architecture: ${process.arch}`);
} catch (error) {
  console.log('\n⚠️  Could not get environment info');
} 