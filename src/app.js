import express from 'express';
import cors from 'cors';
import prendasRoutes from './routes/prendas.routes.js';
import searchRoutes from './routes/search.routes.js'; // ← AGREGADO

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log de rutas registradas (opcional, para debugging)
console.log('📍 Registrando rutas...');

// Mount routes BEFORE the 404 handler
app.use('/api', searchRoutes);   // Mount search routes FIRST
app.use('/api', prendasRoutes);  // Then mount prendas routes


console.log('✅ Rutas registradas correctamente');

// Basic routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Ruta raíz con información de endpoints
app.get('/', (req, res) => {
  res.json({
    message: 'API de Prendas Perdidas',
    version: '2.0',
    endpoints: {
      prendas: {
        'POST /api/prendas': 'Registrar nueva prenda',
        'GET /api/prendas': 'Obtener todas las prendas',
        'PUT /api/prendas/:id': 'Actualizar prenda completa',
        'PATCH /api/prendas/:id/estado': 'Actualizar estado de devolución'
      },
      busqueda: {
        'GET /api/buscar?rut=XX': 'Buscar por RUT',
        'GET /api/buscar-email?email=XX': 'Buscar por email',
        'GET /api/buscar-tipo?tipo=XX': 'Buscar por tipo de prenda',
        'GET /api/buscar-avanzada?rut=XX&tipo=XX': 'Búsqueda con múltiples filtros'
      },
      diagnostico: {
        'GET /api/diagnostico-emails': 'Verificar configuración de emails',
        'POST /api/test-email': 'Enviar email de prueba'
      },
      health: {
        'GET /health': 'Health check del servidor'
      }
    }
  });
});

// 404 Handler - MUST BE LAST
app.use((req, res) => {
  res.status(404).json({
    message: "La ruta solicitada no existe",
    attempted: req.originalUrl,
    method: req.method,
    debug: {
      timestamp: new Date().toISOString(),
      hint: "Verifica que la ruta y el método HTTP sean correctos"
    },
    availableRoutes: {
      GET: [
        '/health',
        '/',
        '/api/prendas',
        '/api/buscar?rut=XX',
        '/api/buscar-email?email=XX',
        '/api/buscar-tipo?tipo=XX',
        '/api/buscar-avanzada',
        '/api/diagnostico-emails'
      ],
      POST: [
        '/api/prendas',
        '/api/test-email'
      ],
      PUT: [
        '/api/prendas/:id'
      ],
      PATCH: [
        '/api/prendas/:id/estado'
      ]
    }
  });
});

export default app;