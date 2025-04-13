
import TelegramBot from 'node-telegram-bot-api';
import { Order, CartItem, ContactSubmission } from '@shared/schema';
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
    sendAdminMessage('🔔 TUHOTUHO E-commerce Bot is now online and ready to receive order notifications.');
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
    .map(item => `• ${item.quantity}x ${item.name} - ${item.price.toFixed(2)} VND`)
    .join('\n');
  
  return `🛒 <b>Đơn Hàng Mới #${order.id}</b>\n\n` +
    `<b>Khách hàng:</b> ${order.name}\n` +
    `<b>SĐT:</b> ${order.phone}\n` +
    `<b>Địa chỉ:</b> ${order.address}\n\n` +
    `<b>Chi tiết đơn hàng:</b>\n${itemsList}\n\n` +
    `<b>Tổng tiền:</b> ${total.toFixed(2)} VND\n` +
    `<b>Trạng thái:</b> ${order.status}\n` +
    `<b>Ngày đặt:</b> ${new Date().toLocaleString('vi-VN')}\n`;
}

/**
 * Send a contact form notification
 */
export async function sendContactNotification(contact: ContactSubmission): Promise<boolean> {
  const message = `📧 <b>Liên Hệ Mới</b>\n\n` +
    `<b>Họ tên:</b> ${contact.name}\n` +
    `<b>Email:</b> ${contact.email}\n` +
    `<b>Chủ đề:</b> ${contact.subject}\n` +
    `<b>Nội dung:</b>\n${contact.message}\n` +
    `<b>Thời gian:</b> ${new Date(contact.createdAt).toLocaleString()}\n`;

  return await sendAdminMessage(message);
}

/**
 * Send a newsletter subscription notification
 */
export async function sendNewsletterNotification(email: string): Promise<boolean> {
  const message = `📬 <b>Đăng Ký Nhận Tin Mới</b>\n\n` +
    `<b>Email:</b> ${email}\n` +
    `<b>Thời gian:</b> ${new Date().toLocaleString()}\n`;

  return await sendAdminMessage(message);
}

// Initialize the bot when the server starts if environment variables are set
const token = process.env.TELEGRAM_BOT_TOKEN;
const adminId = process.env.TELEGRAM_ADMIN_CHAT_ID;

if (token && adminId) {
  initTelegramBot(token, adminId);
} else {
  log('Telegram bot not initialized: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID', 'telegram');
}
