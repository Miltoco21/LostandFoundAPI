
import { createPool } from 'mysql2/promise';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } from './config.js';

export const pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
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