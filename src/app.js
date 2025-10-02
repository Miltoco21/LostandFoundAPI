// app.js or index.js
import express from 'express';
import cors from 'cors';
import prendasRoutes from './routes/prendas.routes'; // Adjust path as needed

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register your routes with base path
app.use('/api/prendas/buscar', prendasRoutes);

// Basic health check routes (these are the ones shown in your error)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Lost and Found API', 
    version: '1.0.0',
    availableEndpoints: {
      prendas: {
        getAll: 'GET /api/prendas',
        search: 'GET /api/prendas/buscar?rut=YOUR_RUT',
        create: 'POST /api/prendas',
        update: 'PUT /api/prendas/:id',
        updateStatus: 'PATCH /api/prendas/:id/estado'
      }
    }
  });
});

// Handle 404 for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    message: "La ruta solicitada no existe",
    attempted: req.originalUrl,
    method: req.method,
    availableRoutes: {
      health: "GET /health",
      info: "GET /",
      prendas: "GET|POST /api/prendas"
    }
  });
});

export default app;