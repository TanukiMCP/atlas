import os from 'os';
import path from 'path';

/**
 * Get the user's home directory path
 */
export const getUserHomeDir = (): string => {
  return os.homedir();
};

/**
 * Get the path to the user's Atlas configuration directory
 */
export const getAtlasConfigDir = (): string => {
  return path.join(getUserHomeDir(), '.tanuki-atlas');
};

/**
 * Get the path to the user's MCP configuration file
 */
export const getUserMCPConfigPath = (): string => {
  return path.join(getAtlasConfigDir(), 'mcp.json');
}; 