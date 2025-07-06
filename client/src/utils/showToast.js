// utils/showToast.js
import { message } from 'antd';

const shownMessages = new Set();

/**
 * Show a toast only once per unique key within a short period.
 * 
 * @param {string} key - Unique key to prevent repeat messages.
 * @param {'success'|'error'|'info'|'warning'} type - Type of message.
 * @param {string} content - Message content.
 * @param {number} duration - Optional duration (default 5s).
 */
export const showToast = (key, type = 'success', content = '', duration = 5) => {
  if (shownMessages.has(key)) return;

  message[type](content, duration);
  shownMessages.add(key);

  setTimeout(() => shownMessages.delete(key), duration * 1000);
};
