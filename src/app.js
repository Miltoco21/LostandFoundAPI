// import express, { json } from "express";
// import cors from "cors"

// const app = express()
// import cors from 'cors';

// // Configure CORS options
// const corsOptions = {
//   origin: 'https://pumahue-lostandfound.vercel.app', // Your frontend URL
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
//   credentials: false // Set to true if you need cookies/auth
// };

// app.use(cors(corsOptions));

// // Handle preflight requests for all routes
// app.options('*', cors(corsOptions)); // This helps with preflight


// app.use(express.json())

// console.log("🚀 INICIANDO APLICACIÓN");

// // Middleware de logging global
// app.use((req, res, next) => {
//   console.log(`🌐 GLOBAL: ${req.method} ${req.url}`);
//   console.log('📍 Path:', req.path);
//   console.log('📦 Query:', req.query);
//   next();
// });

// // Ruta de salud
// app.get('/health', (req, res) => {
//   console.log('💚 Health check solicitado');
//   res.status(200).json({
//     status: 'OK',
//     message: 'Lost & Found API funcionando',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || 'development'
//   });
// });

// // Ruta raíz
// app.get('/', (req, res) => {
//   console.log('🏠 Ruta raíz solicitada');
//   res.json({
//     message: '🚀 Lost & Found API',
//     status: 'Activa',
//     version: '1.0.0',
//     endpoints: {
//       prendas: '/api/prendas',
//       health: '/health'
//     }
//   });
// });

// // IMPORTACIÓN SEGURA DEL ROUTER
// console.log("📦 IMPORTANDO ROUTER DE PRENDAS...");
// let rutaPrendas;

// try {
//   const { default: router } = await import("../src/routes/prendas.routes.js");
//   rutaPrendas = router;
//   console.log("✅ Router de prendas importado exitosamente");
//   console.log("📊 Tipo de router:", typeof rutaPrendas);
// } catch (error) {
//   console.error("💥 ERROR IMPORTANDO ROUTER DE PRENDAS:", error);
//   console.error("📍 Error stack:", error.stack);
  
//   // Crear un router de emergencia
//   console.log("🆘 Creando router de emergencia...");
//   rutaPrendas = express.Router();
//   rutaPrendas.get('/test', (req, res) => {
//     res.json({
//       message: "Router de emergencia - hay un error en prendas.routes.js",
//       error: error.message
//     });
//   });
// }

// // REGISTRAR RUTAS
// console.log("🚀 Registrando rutas...");

// try {
//   app.use('/prendas', rutaPrendas);
//   console.log("✅ Router de /api/prendas registrado exitosamente");
// } catch (error) {
//   console.error("💥 ERROR REGISTRANDO ROUTER:", error);
// }

// // VERIFICAR QUE LAS RUTAS SE REGISTRARON
// console.log("🔍 VERIFICANDO RUTAS REGISTRADAS:");
// let routesFound = 0;

// if (app._router && app._router.stack) {
//   app._router.stack.forEach((layer, index) => {
//     if (layer.regexp) {
//       const routePath = layer.regexp.toString();
//       console.log(`   ${index}: ${routePath}`);
//       if (routePath.includes('api') && routePath.includes('prendas')) {
//         routesFound++;
//         console.log("   ↳ ✅ Ruta de prendas encontrada");
//       }
//     }
//   });
// }

// console.log(`📊 Total de rutas de prendas encontradas: ${routesFound}`);

// if (routesFound === 0) {
//   console.error("🚨 ¡PROBLEMA! No se encontraron rutas de prendas registradas");
// }

// // Middleware para rutas no encontradas
// app.use((req, res, next) => {
//   console.log(`❌ RUTA NO ENCONTRADA: ${req.method} ${req.url}`);
  
//   res.status(404).json({
//     message: 'La ruta solicitada no existe',
//     attempted: req.url,
//     method: req.method,
//     debug: {
//       originalUrl: req.originalUrl,
//       path: req.path,
//       baseUrl: req.baseUrl,
//       routesFound: routesFound
//     },
//     availableRoutes: {
//       health: 'GET /health',
//       info: 'GET /',
//       prendas: 'GET|POST /api/prendas (si está funcionando)'
//     }
//   });
// });

// // Manejo global de errores
// app.use((error, req, res, next) => {
//   console.error('💥 Error global capturado:', error);
//   console.error('📍 En ruta:', req.url);
//   console.error('🔧 Método:', req.method);
  
//   res.status(500).json({
//     error: 'Error interno del servidor',
//     message: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal',
//     path: req.url,
//     method: req.method
//   });
// });


// export default app

import express, { json } from "express";
import cors from "cors";
import prendasRouter from './routes/prendasRoutes.js'; // Adjust the path to your routes file

const app = express();

// Configuración CORS específica para tu frontend
const corsOptions = {
  origin: [
    'https://pumahue-lostandfound.vercel.app',
    'http://localhost:5173', // Para desarrollo local
    'http://localhost:3000'  // Para desarrollo local alternativo
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};

app.use(cors(corsOptions));

// Middleware para manejar preflight requests
app.options('*', cors(corsOptions));
app.use('/api/prendas', prendasRouter);

// ... el resto de tu configuración ...
console.log("✅ CORS configurado para:", corsOptions.origin);