import TelegramBot from 'node-telegram-bot-api';
import { Order, CartItem } from '@shared/schema';
import { log } from './vite';

// Telegram Bot instance (will be initialized when token is available)
let bot: TelegramBot | null = null;
let chatId: string | null = null;

/**
 * Initialize the Telegram bot with the provided token
 */
export function initTelegramBot(token: string, adminChatId: string) {
  try {
    if (!token) {
      log('Telegram bot token not provided', 'telegram');
      return;
    }

    if (!adminChatId) {
      log('Telegram admin chat ID not provided', 'telegram');
      return;
    }

    // Initialize bot with token
    bot = new TelegramBot(token, { polling: false });
    chatId = adminChatId;
    
    log('Telegram bot initialized successfully', 'telegram');
    
    // Send a test message to confirm it's working
    sendAdminMessage('🔔 NatureNutri E-commerce Bot is now online and ready to receive order notifications.');
  } catch (error) {
    log(`Error initializing Telegram bot: ${error}`, 'telegram');
    bot = null;
  }
}

/**
 * Send a message to the admin
 */
export function sendAdminMessage(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!bot || !chatId) {
      log('Telegram bot not initialized or chat ID not set', 'telegram');
      resolve(false);
      return;
    }

    // Ensure chatId is treated as a number if it's numeric
    // This handles negative chat IDs correctly (for groups/channels)
    const numericChatId = parseInt(chatId);
    const targetChatId = isNaN(numericChatId) ? chatId : numericChatId;

    log(`Sending message to chat ID: ${targetChatId}`, 'telegram');
    
    bot.sendMessage(targetChatId, message, { parse_mode: 'HTML' })
      .then(() => {
        log('Telegram notification sent successfully', 'telegram');
        resolve(true);
      })
      .catch((error) => {
        log(`Error sending Telegram notification: ${error}`, 'telegram');
        resolve(false);
      });
  });
}

/**
 * Generate and send an order notification
 */
export async function sendOrderNotification(order: Order, items: CartItem[]): Promise<boolean> {
  try {
    if (!bot || !chatId) {
      log('Telegram bot not initialized or chat ID not set', 'telegram');
      return false;
    }

    // Create a formatted message with order details
    const message = formatOrderMessage(order, items);
    
    return await sendAdminMessage(message);
  } catch (error) {
    log(`Error sending order notification: ${error}`, 'telegram');
    return false;
  }
}

/**
 * Format the order details for the notification message
 */
function formatOrderMessage(order: Order, items: CartItem[]): string {
  // Calculate total
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Format items list
  const itemsList = items
    .map(item => `• ${item.quantity}x ${item.name} - $${item.price.toFixed(2)}`)
    .join('\n');
  
  return `🛒 <b>New Order #${order.id}</b>\n\n` +
    `<b>Customer:</b> ${order.name}\n` +
    `<b>Email:</b> ${order.email}\n` +
    `<b>Phone:</b> ${order.phone}\n` +
    `<b>Address:</b> ${order.address}\n\n` +
    `<b>Order Items:</b>\n${itemsList}\n\n` +
    `<b>Total Amount:</b> $${total.toFixed(2)}\n` +
    `<b>Status:</b> ${order.status}\n` +
    `<b>Order Date:</b> ${new Date(order.createdAt).toLocaleString()}\n`;
}

// Initialize the bot when the server starts if environment variables are set
const token = process.env.TELEGRAM_BOT_TOKEN;
const adminId = process.env.TELEGRAM_ADMIN_CHAT_ID;

if (token && adminId) {
  initTelegramBot(token, adminId);
} else {
  log('Telegram bot not initialized: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID', 'telegram');
}