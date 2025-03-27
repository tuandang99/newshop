import TelegramBot from 'node-telegram-bot-api';
import { Order, CartItem } from '@shared/schema';

// Initialize Telegram bot with the token
const token = process.env.TELEGRAM_BOT_TOKEN;
let bot: TelegramBot | null = null;
let chatIds: number[] = [];

// Store active chat IDs here
// In a real app, you'd store these in a database
const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

/**
 * Initializes the Telegram bot if a token is available
 */
export function initTelegramBot() {
  if (!token) {
    console.warn('TELEGRAM_BOT_TOKEN not provided. Telegram notifications disabled.');
    return;
  }

  try {
    bot = new TelegramBot(token, { polling: true });
    console.log('Telegram bot initialized successfully');

    // Store chat IDs when users start the bot
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      if (!chatIds.includes(chatId)) {
        chatIds.push(chatId);
        bot?.sendMessage(chatId, 'You will now receive notifications about new orders from NatureNutri.');
      }
    });

    // If admin chat ID is provided, add it to the list
    if (ADMIN_CHAT_ID && !isNaN(Number(ADMIN_CHAT_ID))) {
      const adminChatId = Number(ADMIN_CHAT_ID);
      if (!chatIds.includes(adminChatId)) {
        chatIds.push(adminChatId);
      }
    }
  } catch (error) {
    console.error('Failed to initialize Telegram bot:', error);
    bot = null;
  }
}

/**
 * Formats an order into a readable message for Telegram
 */
function formatOrderMessage(order: Order): string {
  // Parse items if stored as string
  let items: CartItem[] = [];
  try {
    if (typeof order.items === 'string') {
      items = JSON.parse(order.items);
    } else if (Array.isArray(order.items)) {
      items = order.items;
    }
  } catch (error) {
    console.error('Error parsing order items:', error);
  }

  // Format items
  const itemsList = items.map(
    item => `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');

  return `
🛒 *NEW ORDER #${order.id}*
-------------------
*Customer*: ${order.name}
*Email*: ${order.email}
*Phone*: ${order.phone}
*Address*: ${order.address}

*Items*:
${itemsList}

*Total*: $${order.total.toFixed(2)}
*Order Date*: ${new Date(order.createdAt).toLocaleString()}
-------------------
`;
}

/**
 * Sends a notification about a new order to all registered chats
 */
export function sendOrderNotification(order: Order): Promise<boolean> {
  return new Promise((resolve) => {
    if (!bot || chatIds.length === 0) {
      console.warn('Telegram bot not initialized or no chat IDs available. Notification not sent.');
      resolve(false);
      return;
    }

    const message = formatOrderMessage(order);
    
    // Send to all registered chats
    const promises = chatIds.map(chatId => 
      bot!.sendMessage(chatId, message, { parse_mode: 'Markdown' })
        .catch(error => {
          console.error(`Failed to send notification to chat ${chatId}:`, error);
          return null;
        })
    );

    Promise.all(promises)
      .then(results => {
        const success = results.some(result => result !== null);
        resolve(success);
      })
      .catch(error => {
        console.error('Error sending Telegram notifications:', error);
        resolve(false);
      });
  });
}