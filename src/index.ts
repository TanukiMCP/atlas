import { appInitService } from './services/appInitService';

/**
 * Initialize the application
 */
async function initializeApp() {
  try {
    console.log('Starting TanukiMCP Atlas...');
    await appInitService.initialize();
    console.log('TanukiMCP Atlas started successfully');
  } catch (error) {
    console.error('Failed to start TanukiMCP Atlas:', error);
  }
}

// Start the application
initializeApp(); 