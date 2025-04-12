
import pkg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const { Pool } = pkg;

let pool: pkg.Pool;

if (process.env.DBURL) {
  // Use connection URL if available
  pool = new Pool({
    connectionString: process.env.DBURL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  // Fall back to individual parameters
  if (!process.env.PGDATABASE || !process.env.PGHOST || !process.env.PGPORT || !process.env.PGUSER || !process.env.PGPASSWORD) {
    throw new Error(
      "Either DBURL or PGDATABASE, PGHOST, PGPORT, PGUSER, and PGPASSWORD must be set in the environment variables."
    );
  }

  pool = new Pool({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT, 10),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

export const db = drizzle(pool, { schema });
