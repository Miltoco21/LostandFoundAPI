import { pool } from "../db.js";

// Buscar prendas por RUT
export const buscarPorRut = async (req, res) => {
  try {
    const { rut } = req.query;
    
    if (!rut) {
      return res.status(400).json({ 
        message: "El parámetro RUT es requerido",
        example: "GET /buscar?rut=17951288-2"
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM prendas WHERE rut = ? ORDER BY fecha_registro DESC", 
      [rut]
    );
    
    if (rows.length === 0) {
      return res.status(200).json({
        message: `No se encontraron prendas para el RUT ${rut}`,
        count: 0,
        data: []
      });
    }
    
    res.status(200).json({
      message: "Prendas encontradas",
      count: rows.length,
      rut: rut,
      data: rows
    });
    
  } catch (error) {
    console.error("Error al buscar por RUT:", error);
    return res.status(500).json({
      message: "Error al buscar prendas",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

// Buscar prendas por email
export const buscarPorEmail = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ 
        message: "El parámetro email es requerido",
        example: "GET /buscar-email?email=usuario@example.com"
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM prendas WHERE email = ? ORDER BY fecha_registro DESC", 
      [email]
    );
    
    if (rows.length === 0) {
      return res.status(200).json({
        message: `No se encontraron prendas para el email ${email}`,
        count: 0,
        data: []
      });
    }
    
    res.status(200).json({
      message: "Prendas encontradas",
      count: rows.length,
      email: email,
      data: rows
    });
    
  } catch (error) {
    console.error("Error al buscar por email:", error);
    return res.status(500).json({
      message: "Error al buscar prendas",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

// Buscar por tipo de prenda
export const buscarPorTipo = async (req, res) => {
  try {
    const { tipo } = req.query;
    
    if (!tipo) {
      return res.status(400).json({ 
        message: "El parámetro tipo es requerido",
        example: "GET /buscar-tipo?tipo=Poleron"
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM prendas WHERE tipo_prenda LIKE ? ORDER BY fecha_registro DESC", 
      [`%${tipo}%`]
    );
    
    if (rows.length === 0) {
      return res.status(200).json({
        message: `No se encontraron prendas del tipo ${tipo}`,
        count: 0,
        data: []
      });
    }
    
    res.status(200).json({
      message: "Prendas encontradas",
      count: rows.length,
      tipo: tipo,
      data: rows
    });
    
  } catch (error) {
    console.error("Error al buscar por tipo:", error);
    return res.status(500).json({
      message: "Error al buscar prendas",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

// Búsqueda avanzada con múltiples filtros
export const busquedaAvanzada = async (req, res) => {
  try {
    const { rut, email, tipo_prenda, estado_devolucion } = req.query;
    
    if (!rut && !email && !tipo_prenda && !estado_devolucion) {
      return res.status(400).json({ 
        message: "Se requiere al menos un parámetro de búsqueda",
        available: ["rut", "email", "tipo_prenda", "estado_devolucion"],
        example: "GET /buscar-avanzada?rut=12345678-9&tipo_prenda=Poleron"
      });
    }

    let query = "SELECT * FROM prendas WHERE 1=1";
    const params = [];

    if (rut) {
      query += " AND rut = ?";
      params.push(rut);
    }
    if (email) {
      query += " AND email = ?";
      params.push(email);
    }
    if (tipo_prenda) {
      query += " AND tipo_prenda LIKE ?";
      params.push(`%${tipo_prenda}%`);
    }
    if (estado_devolucion) {
      query += " AND estado_devolucion = ?";
      params.push(estado_devolucion);
    }

    query += " ORDER BY fecha_registro DESC";

    const [rows] = await pool.query(query, params);
    
    res.status(200).json({
      message: rows.length > 0 ? "Prendas encontradas" : "No se encontraron resultados",
      count: rows.length,
      filters: { rut, email, tipo_prenda, estado_devolucion },
      data: rows
    });
    
  } catch (error) {
    console.error("Error en búsqueda avanzada:", error);
    return res.status(500).json({
      message: "Error en búsqueda avanzada",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};