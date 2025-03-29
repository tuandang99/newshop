import mysql from 'mysql2/promise';
import {
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type BlogPost,
  type InsertBlogPost,
  type Testimonial,
  type InsertTestimonial,
  type Order,
  type InsertOrder,
  type ContactSubmission,
  type InsertContact,
} from "@shared/schema";

const pool = mysql.createPool({
  host: process.env.MARIADB_HOST || '0.0.0.0',
  port: parseInt(process.env.MARIADB_PORT || '3306'),
  user: process.env.MARIADB_USER || 'root',
  password: process.env.MARIADB_PASSWORD || '',
  database: process.env.MARIADB_DATABASE || 'naturenutriv2',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database tables
async function initDb() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admin_keys (
        id INT AUTO_INCREMENT PRIMARY KEY,
        \`key\` VARCHAR(255) NOT NULL UNIQUE,
        label VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT TRUE
      )
    `);

    // Insert default admin key if none exists
    const [keys] = await conn.query('SELECT COUNT(*) as count FROM admin_keys');
    if ((keys as any[])[0].count === 0) {
      await conn.query(
        'INSERT INTO admin_keys (`key`, label) VALUES (?, ?)',
        [process.env.ADMIN_KEY || 'secret-admin-key', 'Default Admin Key']
      );
    }

    await conn.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        image TEXT NOT NULL
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        price DOUBLE NOT NULL,
        old_price DOUBLE NULL,
        image TEXT NOT NULL,
        category_id INT NOT NULL,
        rating DOUBLE DEFAULT 5,
        is_new BOOLEAN DEFAULT FALSE,
        is_organic BOOLEAN DEFAULT TRUE,
        is_bestseller BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        image TEXT NOT NULL,
        category VARCHAR(255) NOT NULL,
        tags TEXT NULL,
        author VARCHAR(255) NULL,
        meta_title VARCHAR(255) NULL,
        meta_description TEXT NULL,
        featured BOOLEAN DEFAULT FALSE,
        status VARCHAR(50) DEFAULT 'published',
        date DATETIME NOT NULL
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        avatar TEXT NOT NULL,
        rating DOUBLE NOT NULL,
        comment TEXT NOT NULL
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        items TEXT NOT NULL,
        total DOUBLE NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } finally {
    conn.release();
  }
}

// Initialize the database
initDb().catch(console.error);

export const storage = {
  async getCategories(): Promise<Category[]> {
    const [rows] = await pool.query('SELECT * FROM categories');
    return rows as Category[];
  },

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [rows] = await pool.query('SELECT * FROM categories WHERE slug = ?', [slug]);
    return (rows as Category[])[0];
  },

  async getProducts(): Promise<Product[]> {
    const [rows] = await pool.query('SELECT * FROM products');
    return rows as Product[];
  },

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const [rows] = await pool.query('SELECT * FROM products WHERE category_id = ?', [categoryId]);
    return rows as Product[];
  },

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [rows] = await pool.query('SELECT * FROM products WHERE slug = ?', [slug]);
    return (rows as Product[])[0];
  },

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY RAND() LIMIT ?', [limit]);
    return rows as Product[];
  },

  async createProduct(product: InsertProduct): Promise<Product> {
    const [result] = await pool.query(
      'INSERT INTO products SET ?',
      product
    );
    const [newProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [(result as any).insertId]);
    return (newProduct as Product[])[0];
  },

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    await pool.query('UPDATE products SET ? WHERE id = ?', [product, id]);
    const [updated] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return (updated as Product[])[0];
  },

  async deleteProduct(id: number): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  },

  async getBlogPosts(): Promise<BlogPost[]> {
    const [rows] = await pool.query('SELECT * FROM blog_posts ORDER BY date DESC');
    return rows as BlogPost[];
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [rows] = await pool.query('SELECT * FROM blog_posts WHERE slug = ?', [slug]);
    return (rows as BlogPost[])[0];
  },

  async getRecentBlogPosts(limit = 3): Promise<BlogPost[]> {
    const [rows] = await pool.query('SELECT * FROM blog_posts ORDER BY date DESC LIMIT ?', [limit]);
    return rows as BlogPost[];
  },

  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost> {
    const [result] = await pool.query('INSERT INTO blog_posts SET ?', blogPost);
    const [newPost] = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [(result as any).insertId]);
    return (newPost as BlogPost[])[0];
  },

  async updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    await pool.query('UPDATE blog_posts SET ? WHERE id = ?', [blogPost, id]);
    const [updated] = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [id]);
    return (updated as BlogPost[])[0];
  },

  async deleteBlogPost(id: number): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM blog_posts WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const [rows] = await pool.query('SELECT * FROM testimonials');
    return rows as Testimonial[];
  },

  async createOrder(order: InsertOrder): Promise<Order> {
    const [result] = await pool.query('INSERT INTO orders SET ?', order);
    const [newOrder] = await pool.query('SELECT * FROM orders WHERE id = ?', [(result as any).insertId]);
    return (newOrder as Order[])[0];
  },

  async submitContactForm(contact: InsertContact): Promise<ContactSubmission> {
    const [result] = await pool.query('INSERT INTO contact_submissions SET ?', contact);
    const [submission] = await pool.query('SELECT * FROM contact_submissions WHERE id = ?', [(result as any).insertId]);
    return (submission as ContactSubmission[])[0];
  },

  async verifyAdminKey(key: string): Promise<boolean> {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM admin_keys WHERE `key` = ? AND active = TRUE', [key]);
    return (rows as any[])[0].count > 0;
  },

  async updateAdminKey(oldKey: string, newKey: string): Promise<boolean> {
    const [result] = await pool.query('UPDATE admin_keys SET `key` = ? WHERE `key` = ? AND active = TRUE', [newKey, oldKey]);
    return (result as any).affectedRows > 0;
  }
};