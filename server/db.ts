import pkg from 'pg'; // Import toàn bộ module pg
import { drizzle } from 'drizzle-orm/node-postgres'; // Adapter của drizzle
import * as schema from "@shared/schema";

const { Pool } = pkg; // Lấy Pool từ module pg

// Kiểm tra các biến môi trường cần thiết
if (!process.env.PGDATABASE || !process.env.PGHOST || !process.env.PGPORT || !process.env.PGUSER || !process.env.PGPASSWORD) {
  throw new Error(
    "PGDATABASE, PGHOST, PGPORT, PGUSER, and PGPASSWORD must be set in the environment variables."
  );
}

// Cấu hình kết nối cơ sở dữ liệu
export const pool = new Pool({
  host: process.env.PGHOST,       // Địa chỉ máy chủ
  port: parseInt(process.env.PGPORT, 10), // Cổng PostgreSQL
  user: process.env.PGUSER,       // Tên người dùng
  password: process.env.PGPASSWORD, // Mật khẩu
  database: process.env.PGDATABASE, // Tên cơ sở dữ liệu
});

export const db = drizzle(pool, { schema });