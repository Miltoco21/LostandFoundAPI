// import { config } from "dotenv";

// config();

// // Puerto - Render lo asigna dinámicamente en producción
// export const PORT = process.env.PORT || 8080;

// // Configuración de Base de Datos MySQL (Clever Cloud)
// export const DB_HOST = process.env.DB_HOST || 'bhjxindtujbn50irv41z-mysql.services.clever-cloud.com';
// export const DB_DATABASE = process.env.DB_DATABASE || 'bhjxindtujbn50irv41z';
// export const DB_USER = process.env.DB_USER || 'uqoc6n99ne1pcphz';
// export const DB_PASSWORD = process.env.DB_PASSWORD || 'E98vXJF2IrVrb8AiPzTT';
// export const DB_PORT = process.env.DB_PORT || 3306;

// // Configuración de Email
// export const EMAIL_USER = process.env.EMAIL_USER || 'milton206@gmail.com';
// export const EMAIL_PASS = process.env.EMAIL_PASS || 'dszfmwvcruslvwsr';
// export const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';

// // Configuración del entorno
// export const NODE_ENV = process.env.NODE_ENV || 'development';
// export const IS_PRODUCTION = NODE_ENV === 'production';

// // URL base de la aplicación
// export const BASE_URL = IS_PRODUCTION 
//   ? 'https://lostandfoundapi-kfe8.onrender.com' 
//   : `http://localhost:${PORT}`;

// // URLs permitidas para CORS - Agrega tu frontend aquí
// export const ALLOWED_ORIGINS = [
//   'http://localhost:3000',    // React dev
//   'http://localhost:5173',    // Vite dev  
//   'http://localhost:4200',    // Angular dev
//   'http://localhost:8080',    // Tu puerto actual
//   'http://127.0.0.1:3000',
//   'http://127.0.0.1:8080',
//   // Agrega aquí la URL de tu frontend en producción cuando la tengas
//   // 'https://tu-frontend.vercel.app',
//   // 'https://tu-frontend.netlify.app',
// ];

// // URL completa de conexión MySQL
// export const DATABASE_URL = `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

// // Log de configuración (solo mostrar en desarrollo)
// if (NODE_ENV !== 'production') {
//   console.log('🔧 Configuración Lost & Found API:');
//   console.log(`   - Puerto: ${PORT}`);
//   console.log(`   - Entorno: ${NODE_ENV}`);
//   console.log(`   - URL Base: ${BASE_URL}`);
//   console.log(`   - Base de Datos: ${DB_HOST}:${DB_PORT}/${DB_DATABASE}`);
//   console.log(`   - Usuario DB: ${DB_USER}`);
//   console.log(`   - Email configurado: ${EMAIL_USER}`);
//   console.log(`   - CORS Origins configurados: ${ALLOWED_ORIGINS.length} orígenes`);
// } else {
//   console.log('🚀 API en producción iniciada');
//   console.log(`📡 Escuchando en puerto: ${PORT}`);
//   console.log(`🗄️ Conectado a: ${DB_HOST}`);
// }

import { config } from "dotenv";

config();

// Puerto - Render lo asigna dinámicamente en producción
export const PORT = process.env.PORT || 8080;

// Configuración de Base de Datos MySQL (Clever Cloud)
export const DB_HOST = process.env.DB_HOST || 'bhjxindtujbn50irv41z-mysql.services.clever-cloud.com';
export const DB_DATABASE = process.env.DB_DATABASE || 'bhjxindtujbn50irv41z';
export const DB_USER = process.env.DB_USER || 'uqoc6n99ne1pcphz';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'E98vXJF2IrVrb8AiPzTT';
export const DB_PORT = process.env.DB_PORT || 3306;

// Configuración de Email
export const EMAIL_USER = process.env.EMAIL_USER || 'milton206@gmail.com';
export const EMAIL_PASS = process.env.EMAIL_PASS || 'dszfmwvcruslvwsr';
export const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';
export const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'gmail'; // Por defecto gmail, pero puede ser 'resend'
export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

// Configuración del entorno
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';

// URL base de la aplicación
export const BASE_URL = IS_PRODUCTION 
  ? 'https://lostandfoundapi-kfe8.onrender.com' 
  : `http://localhost:${PORT}`;

// URLs permitidas para CORS - Agrega tu frontend aquí
export const ALLOWED_ORIGINS = [
  'http://localhost:3000',    // React dev
  'http://localhost:5173',    // Vite dev  
  'http://localhost:4200',    // Angular dev
  'http://localhost:8080',    // Tu puerto actual
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8080',
  // Agrega aquí la URL de tu frontend en producción cuando la tengas
  // 'https://tu-frontend.vercel.app',
  // 'https://tu-frontend.netlify.app',
];

// URL completa de conexión MySQL
export const DATABASE_URL = `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

// Log de configuración (solo mostrar en desarrollo)
if (NODE_ENV !== 'production') {
  console.log('🔧 Configuración Lost & Found API:');
  console.log(`   - Puerto: ${PORT}`);
  console.log(`   - Entorno: ${NODE_ENV}`);
  console.log(`   - URL Base: ${BASE_URL}`);
  console.log(`   - Base de Datos: ${DB_HOST}:${DB_PORT}/${DB_DATABASE}`);
  console.log(`   - Usuario DB: ${DB_USER}`);
  console.log(`   - Email configurado: ${EMAIL_USER}`);
  console.log(`   - Email Provider: ${EMAIL_PROVIDER}`);
  console.log(`   - CORS Origins configurados: ${ALLOWED_ORIGINS.length} orígenes`);
} else {
  console.log('🚀 API en producción iniciada');
  console.log(`📡 Escuchando en puerto: ${PORT}`);
  console.log(`🗄️ Conectado a: ${DB_HOST}`);
}