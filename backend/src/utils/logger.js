import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory (ES modules don't have __dirname by default)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logPath = path.join(__dirname, '../../logs/messages.txt');

// Ensure logs directory exists
const logsDir = path.dirname(logPath);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Log a message to the messages.txt file
 * @param {Object} messageData - Message object to log
 */
export function logMessage(messageData) {
  const logEntry = `[${messageData.timestamp}] ${messageData.sender}: ${messageData.message}\n`;
  fs.appendFileSync(logPath, logEntry);
}

/**
 * Get all logged messages from file
 * @returns {Array} Array of log entries
 */
export function getLoggedMessages() {
  if (!fs.existsSync(logPath)) {
    return [];
  }
  
  const content = fs.readFileSync(logPath, 'utf-8');
  return content.split('\n').filter(line => line.trim());
}

/**
 * Clear the log file
 */
export function clearLogs() {
  fs.writeFileSync(logPath, '');
}
// summary 
// Backs up all messages to a text file
// Useful for disaster recovery
// Can retrieve message history even after restart