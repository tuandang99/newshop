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

    // Log for debugging
    log(`Sending order notification for order #${order.id} with ${Array.isArray(items) ? items.length : 'non-array'} items`, 'telegram');
    if (typeof order.items === 'string') {
      log(`Order.items string: ${order.items.substring(0, 100)}${order.items.length > 100 ? '...' : ''}`, 'telegram');
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
  let itemsArray: CartItem[] = [];
  
  try {
    // Handle different possible formats of items
    if (Array.isArray(items) && items.length > 0) {
      // If items is already an array, use it directly
      itemsArray = items;
    } else if (typeof order.items === 'string') {
      // If order.items is a string, parse it
      itemsArray = JSON.parse(order.items);
    }
    
    // Validate that itemsArray is actually an array after parsing
    if (!Array.isArray(itemsArray)) {
      log(`Invalid items format in order #${order.id}: ${typeof itemsArray}`, 'telegram');
      itemsArray = [];
    }
  } catch (error) {
    log(`Error parsing order items for order #${order.id}: ${error}`, 'telegram');
    itemsArray = [];
  }
  
  // Calculate total from order
  const total = order.total;

  // Format items list or show "No products" message
  let itemsList = "Không có sản phẩm nào.";
  
  if (itemsArray && Array.isArray(itemsArray) && itemsArray.length > 0) {
    try {
      itemsList = itemsArray
        .map(item => {
          if (!item || typeof item !== 'object') {
            console.log("Invalid item:", item);
            return null;
          }
          const quantity = item.quantity || 1;
          return `• ${quantity}x ${item.name} - ${(item.price * quantity).toLocaleString('vi-VN')}₫`;
        })
        .filter(Boolean)
        .join('\n');
      
      if (!itemsList || itemsList.trim() === '') {
        itemsList = "Không có sản phẩm nào.";
      }
    } catch (err) {
      console.error("Error formatting items:", err);
      itemsList = "Không có sản phẩm nào.";
    }
  }
  
  return `🛒 <b>Đơn Hàng Mới #${order.id}</b>\n\n` +
    `<b>Khách hàng:</b> ${order.name}\n` +
    `<b>SĐT:</b> ${order.phone}\n` +
    `<b>Địa chỉ:</b> ${order.address}\n\n` +
    `<b>Chi tiết đơn hàng:</b>\n${itemsList}\n\n` +
    `<b>Tổng tiền:</b> ${total.toLocaleString('vi-VN')}₫\n` +
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
    `<b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}\n`;

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