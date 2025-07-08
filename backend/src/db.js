import 'dotenv/config';
import { Pool } from 'pg';

export const pool = new Pool({
  host:     process.env.DB_HOST,
  port:    +process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // if your RDS requires SSL
  },
  max:       10,
});

