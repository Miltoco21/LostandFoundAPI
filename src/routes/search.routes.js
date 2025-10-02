// File: routes/search.routes.js
import { Router } from "express";
import { buscarPorRut } from "../controllers/search.controller.js"; // Ensure this path is correct


const router = Router();
console.log('🔍 Search routes are being registered...'); // Add this line
router.get("/buscar", buscarPorRut);

export default router; // This must be a default export