import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '../shared/schema';
import 'dotenv/config';

const { Pool } = pg;

async function migrate() {
  // Kiểm tra biến môi trường
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('Migrating database...');

  // Kết nối đến cơ sở dữ liệu
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Tạo schema
  const db = drizzle(pool, { schema });

  try {
    // Xác minh kết nối
    await pool.query('SELECT 1');
    console.log('Database connection successful');

    // Tạo các bảng
    console.log('Creating tables...');
    const createTables = `
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      image TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT NOT NULL,
      price DOUBLE PRECISION NOT NULL,
      old_price DOUBLE PRECISION,
      image TEXT NOT NULL,
      category_id INTEGER NOT NULL REFERENCES categories(id),
      rating DOUBLE PRECISION DEFAULT 5,
      is_new BOOLEAN DEFAULT false,
      is_organic BOOLEAN DEFAULT true,
      is_bestseller BOOLEAN DEFAULT false,
      details JSON DEFAULT '[]',
      discount INTEGER,
      has_variants BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id),
      image_path TEXT NOT NULL,
      is_main BOOLEAN DEFAULT false,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id),
      name VARCHAR(255) NOT NULL,
      price DOUBLE PRECISION NOT NULL,
      old_price DOUBLE PRECISION,
      sku VARCHAR(255),
      stock INTEGER DEFAULT 0,
      is_default BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      content TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      image TEXT NOT NULL,
      category VARCHAR(255) NOT NULL,
      tags TEXT,
      author VARCHAR(255),
      meta_title VARCHAR(255),
      meta_description TEXT,
      featured BOOLEAN DEFAULT false,
      status VARCHAR(20) DEFAULT 'published',
      date TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      avatar TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      address TEXT NOT NULL,
      items TEXT NOT NULL,
      total DOUBLE PRECISION NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS admin_keys (
      id SERIAL PRIMARY KEY,
      key VARCHAR(255) NOT NULL,
      label VARCHAR(255) NOT NULL,
      active BOOLEAN DEFAULT true
    );
    `;

    await pool.query(createTables);
    console.log('Tables created successfully');

    // Tạo dữ liệu mẫu cho danh mục và sản phẩm
    console.log('Creating sample data...');
    const createSampleData = `
    -- Thêm dữ liệu mẫu cho categories
    INSERT INTO categories (name, slug, image) VALUES 
      ('Rau củ', 'rau-cu', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=1000'),
      ('Trái cây', 'trai-cay', 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1000'),
      ('Thực phẩm hữu cơ', 'thuc-pham-huu-co', 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000')
    ON CONFLICT (slug) DO NOTHING;

    -- Thêm dữ liệu mẫu cho products
    INSERT INTO products (name, slug, description, price, old_price, image, category_id, is_organic, has_variants) VALUES 
      ('Cà rốt hữu cơ', 'ca-rot-huu-co', 'Cà rốt hữu cơ tươi ngon, giàu vitamin A', 25000, 30000, 'https://images.unsplash.com/photo-1447175008436-054170c2e979?q=80&w=1000', 1, true, true),
      ('Táo đỏ Mỹ', 'tao-do-my', 'Táo đỏ nhập khẩu từ Mỹ, giòn ngọt', 60000, 70000, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=1000', 2, true, true),
      ('Bột yến mạch', 'bot-yen-mach', 'Bột yến mạch hữu cơ, không chất bảo quản', 80000, 95000, 'https://images.unsplash.com/photo-1586765501019-cbe3294828fe?q=80&w=1000', 3, true, true)
    ON CONFLICT (slug) DO NOTHING;

    -- Lấy ID sản phẩm đã thêm
    WITH product_ids AS (
      SELECT id, name FROM products WHERE name IN ('Cà rốt hữu cơ', 'Táo đỏ Mỹ', 'Bột yến mạch')
    )
    -- Thêm biến thể cho sản phẩm
    INSERT INTO product_variants (product_id, name, price, old_price, is_default)
    SELECT 
      p.id, 
      CASE 
        WHEN p.name = 'Cà rốt hữu cơ' THEN '500gr'
        WHEN p.name = 'Táo đỏ Mỹ' THEN '500gr'
        WHEN p.name = 'Bột yến mạch' THEN '500gr'
      END,
      CASE 
        WHEN p.name = 'Cà rốt hữu cơ' THEN 25000
        WHEN p.name = 'Táo đỏ Mỹ' THEN 60000
        WHEN p.name = 'Bột yến mạch' THEN 80000
      END,
      CASE 
        WHEN p.name = 'Cà rốt hữu cơ' THEN 30000
        WHEN p.name = 'Táo đỏ Mỹ' THEN 70000
        WHEN p.name = 'Bột yến mạch' THEN 95000
      END,
      true
    FROM product_ids p
    ON CONFLICT DO NOTHING;

    INSERT INTO product_variants (product_id, name, price, old_price)
    SELECT 
      p.id, 
      CASE 
        WHEN p.name = 'Cà rốt hữu cơ' THEN '1kg'
        WHEN p.name = 'Táo đỏ Mỹ' THEN '1kg'
        WHEN p.name = 'Bột yến mạch' THEN '1kg'
      END,
      CASE 
        WHEN p.name = 'Cà rốt hữu cơ' THEN 45000
        WHEN p.name = 'Táo đỏ Mỹ' THEN 110000
        WHEN p.name = 'Bột yến mạch' THEN 150000
      END,
      CASE 
        WHEN p.name = 'Cà rốt hữu cơ' THEN 55000
        WHEN p.name = 'Táo đỏ Mỹ' THEN 130000
        WHEN p.name = 'Bột yến mạch' THEN 180000
      END
    FROM product_ids p
    ON CONFLICT DO NOTHING;
    `;

    await pool.query(createSampleData);
    console.log('Sample data created successfully');

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Đóng kết nối
    await pool.end();
    console.log('Database connection closed');
  }
}

migrate();