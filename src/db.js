
import { createPool } from 'mysql2/promise';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } from './config.js';

export const pool = createPool({
  host: DB_HOST || 'localhost',
  port: DB_PORT || 5432,
  user: DB_USER || 'postgres',
  password: DB_PASSWORD || 'password',
  database: DB_DATABASE || 'lostandfound',
  // Para producción en Render
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Prueba la conexión
pool.getConnection()
  .then(connection => {
    console.log('✅ Conexión a DB exitosa');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Error conectando a DB:', error);
  });