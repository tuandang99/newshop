
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
        price DECIMAL(10,2) NOT NULL,
        old_price DECIMAL(10,2) NULL,
        image TEXT NOT NULL,
        category_id INT NOT NULL,
        rating DECIMAL(3,2) DEFAULT 5,
        is_new TINYINT DEFAULT 0,
        is_organic TINYINT DEFAULT 1,
        is_bestseller TINYINT DEFAULT 0,
        details JSON NULL,
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
        tags TEXT,
        author VARCHAR(255),
        metaTitle VARCHAR(255),
        metaDescription TEXT,
        featured BOOLEAN DEFAULT FALSE,
        status ENUM('published', 'draft', 'archived') DEFAULT 'published',
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        avatar TEXT NOT NULL,
        rating INT NOT NULL,
        comment TEXT NOT NULL
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        email VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        phone VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        address TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        items TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

  } finally {
    conn.release();
  }
}

// Initialize the database when the server starts
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
    return (rows as Product[]).map(product => {
      if (product.details) {
        product.details = JSON.parse(product.details as unknown as string);
      }
      return product;
    });
  },

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const [rows] = await pool.query('SELECT * FROM products WHERE category_id = ?', [categoryId]);
    return rows as Product[];
  },

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [rows] = await pool.query('SELECT * FROM products WHERE slug = ?', [slug]);
    const product = (rows as Product[])[0];
    if (product && product.details) {
      product.details = JSON.parse(product.details as unknown as string);
    }
    return product;
  },

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY RAND() LIMIT ?', [limit]);
    return rows as Product[];
  },

  async createProduct(product: InsertProduct): Promise<Product> {
    const [result] = await pool.query(
      'INSERT INTO products SET ?',
      {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        old_price: product.oldPrice,
        image: product.image,
        category_id: product.categoryId,
        rating: product.rating,
        is_new: product.isNew ? 1 : 0,
        is_organic: product.isOrganic ? 1 : 0,
        is_bestseller: product.isBestseller ? 1 : 0,
        details: JSON.stringify(product.details)
      }
    );
    const [newProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [(result as any).insertId]);
    return (newProduct as Product[])[0];
  },

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const dbProduct = {
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      old_price: product.oldPrice,
      image: product.image,
      category_id: product.categoryId,
      rating: product.rating,
      is_new: product.isNew ? 1 : 0,
      is_organic: product.isOrganic ? 1 : 0,
      is_bestseller: product.isBestseller ? 1 : 0,
      details: product.details ? JSON.stringify(product.details) : null
    };
    await pool.query('UPDATE products SET ? WHERE id = ?', [dbProduct, id]);
    const [updated] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    const result = (updated as Product[])[0];
    if (result && result.details) {
      result.details = JSON.parse(result.details as unknown as string);
    }
    return result;
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
    const [result] = await pool.query('INSERT INTO contacts SET ?', contact);
    const [submission] = await pool.query('SELECT * FROM contacts WHERE id = ?', [(result as any).insertId]);
    return (submission as ContactSubmission[])[0];
  },

  async verifyAdminKey(key: string): Promise<boolean> {
    return key === process.env.ADMIN_KEY;
  },

  async updateAdminKey(oldKey: string, newKey: string): Promise<boolean> {
    if (oldKey === process.env.ADMIN_KEY) {
      process.env.ADMIN_KEY = newKey;
      return true;
    }
    return false;
  }
};
