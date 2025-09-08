import { pool } from "../db.js";
import  { sendGarmentFoundEmail } from '../utils/emailsender.js';


export const registroPrendas = async (req, res) => {
  console.log("=== INICIO registroPrendas ===");
  console.log("Método:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", req.headers);
  console.log("Body recibido:", req.body);
  
  try {
    const { nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones } = req.body;

    // Validar que los campos obligatorios estén presentes
    if (!nombre || !rut || !email || !tipo_prenda || !telefono || !talla || !estado) {
      console.log("❌ Campos faltantes detectados");
      return res.status(400).json({ 
        message: "Faltan campos obligatorios",
        received: req.body,
        required: ["nombre", "rut", "email", "tipo_prenda", "telefono", "talla", "estado"]
      });
    }

    console.log("✅ Todos los campos obligatorios presentes");

    // ELIMINAMOS LA VERIFICACIÓN DE DUPLICADOS
    // Cada prenda es única por su ID generado automáticamente
    // Una persona puede tener múltiples prendas del mismo tipo y talla
    
    console.log("📝 Procediendo con el registro directo (sin verificar duplicados)");

    // Insertar en la base de datos
    const insertQuery = "INSERT INTO prendas(nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
    console.log("💾 Ejecutando inserción:", insertQuery);
    console.log("💾 Parámetros:", [nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones]);

    const [rows] = await pool.query(insertQuery, [nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones]);

    console.log("✅ Inserción exitosa. Resultado:", rows);
    console.log("🎉 ID único de prenda creada:", rows.insertId);
    
    const response = {
      message: "Prenda guardada con éxito",
      id: rows.insertId,
      prenda: {
        id: rows.insertId,
        nombre, 
        rut, 
        email, 
        tipo_prenda, 
        telefono, 
        talla, 
        estado, 
        observaciones,
        fecha_registro: new Date().toISOString()
      }
    };

    console.log("📤 Enviando respuesta:", response);
    res.status(201).json(response);

  } catch (error) {
    console.error("💥 ERROR COMPLETO:", error);
    console.error("💥 Mensaje:", error.message);
    console.error("💥 Stack:", error.stack);
    console.error("💥 Code:", error.code);
    
    // Verificar si es un error de clave duplicada específicamente en el ID
    if (error.code === 'ER_DUP_ENTRY' && error.message.includes('PRIMARY')) {
      console.error("🔴 Error de ID duplicado (muy raro - problema de BD)");
      return res.status(500).json({
        message: "Error interno: problema con la generación de ID único",
        error: "Contacte al administrador del sistema"
      });
    }
    
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage || 'No SQL error'
    });
  } finally {
    console.log("=== FIN registroPrendas ===\n");
  }
};

export const getPrendasByRut = async (req, res) => {
  try {
    console.log("🎯 getPrendasByRut INICIANDO");
    console.log("📦 req.query completo:", req.query);
    
    const { rut } = req.query;
    console.log("📋 RUT extraído:", rut);
    console.log("🔗 Pool disponible:", !!pool);
    
    if (!rut) {
      console.log("❌ RUT no proporcionado");
      return res.status(400).json({ 
        message: "El parámetro RUT es requerido",
        received: req.query 
      });
    }

    console.log("🔍 Ejecutando query SQL para RUT:", rut);
    
    // Verificar que pool está disponible
    if (!pool) {
      console.error("💥 POOL NO DISPONIBLE");
      return res.status(500).json({
        message: "Error de conexión a base de datos - Pool no disponible"
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM prendas WHERE rut = ? ORDER BY fecha_registro DESC", 
      [rut]
    );
    
    console.log(`✅ Query exitosa. Prendas encontradas para RUT ${rut}: ${rows.length}`);
    console.log("📊 Datos encontrados:", rows);
    
    // Asegurarse de que siempre devolvemos un array
    const results = Array.isArray(rows) ? rows : [];
    
    console.log("📤 Enviando respuesta:", results);
    res.status(200).json(results);
    
  } catch (error) {
    console.error("💥 ERROR EN getPrendasByRut:", error);
    console.error("📊 Error completo:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    return res.status(500).json({
      message: "Error al buscar prendas por RUT",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

export const getPrendas = async (req, res) => {
  try {
    console.log("🎯 getPrendas INICIANDO (sin RUT)");
    
    if (!pool) {
      console.error("💥 POOL NO DISPONIBLE en getPrendas");
      return res.status(500).json({
        message: "Error de conexión a base de datos - Pool no disponible"
      });
    }

    const [rows] = await pool.query("SELECT * FROM prendas ORDER BY fecha_registro DESC");
    
    console.log(`✅ getPrendas exitosa. Total prendas: ${rows.length}`);
    res.status(200).json(rows);
    
  } catch (error) {
    console.error("💥 ERROR EN getPrendas:", error);
    return res.status(500).json({
      message: "Error al obtener prendas",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

// Actualizar estado de devolución de una prenda

export const updateEstadoDevolucion = async (req, res) => {
  console.log("=== INICIO updateEstadoDevolucion ===");
  
  try {
    const { id } = req.params;
    const { estado_devolucion } = req.body;

    if (!estado_devolucion) {
      return res.status(400).json({ 
        message: "El campo estado_devolucion es requerido" 
      });
    }

    // Actualizar el estado de devolución y la fecha
    const updateQuery = "UPDATE prendas SET estado_devolucion = ?, fecha_devolucion = NOW() WHERE id = ?";
    const [result] = await pool.query(updateQuery, [estado_devolucion, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Prenda no encontrada" });
    }

    // Si la prenda fue marcada como encontrada, enviar email
    if (estado_devolucion.includes("Encontrada")) {
      // Obtener los detalles completos de la prenda
      const [garmentRows] = await pool.query(
        "SELECT * FROM prendas WHERE id = ?", 
        [id]
      );
      
      if (garmentRows.length > 0) {
        const garment = garmentRows[0];
        
        // Enviar email de notificación
        const emailSent = await sendGarmentFoundEmail(
          garment.email, 
          garment
        );
        
        if (emailSent) {
          console.log("✅ Email de notificación enviado correctamente");
        } else {
          console.log("⚠️ Email de notificación no pudo ser enviado");
        }
      }
    }

    console.log("✅ Actualización exitosa. Filas afectadas:", result.affectedRows);
    
    res.json({ 
      message: "Estado de devolución actualizado correctamente",
      affectedRows: result.affectedRows 
    });

  } catch (error) {
    console.error("💥 ERROR al actualizar estado:", error);
    return res.status(500).json({
      message: "Error interno del servidor al actualizar el estado",
      error: error.message
    });
  } finally {
    console.log("=== FIN updateEstadoDevolucion ===\n");
  }
};

// Obtener prendas por RUT



// Actualizar una prenda completa


// Actualizar una prenda completa
export const updatePrenda = async (req, res) => {
  console.log("=== INICIO updatePrenda ===");
  console.log("Método:", req.method);
  console.log("Params:", req.params);
  console.log("Body recibido:", req.body);
  
  try {
    const { id } = req.params;
    const { nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones, estado_devolucion } = req.body;

    // Validar que los campos obligatorios estén presentes
    if (!nombre || !rut || !email || !tipo_prenda || !telefono || !talla || !estado) {
      console.log("❌ Campos faltantes detectados");
      return res.status(400).json({ 
        message: "Faltan campos obligatorios",
        required: ["nombre", "rut", "email", "tipo_prenda", "telefono", "talla", "estado"]
      });
    }

    // Actualizar la prenda en la base de datos
    const updateQuery = `
      UPDATE prendas 
      SET nombre = ?, rut = ?, email = ?, tipo_prenda = ?, telefono = ?, talla = ?, estado = ?, observaciones = ?, estado_devolucion = ?, fecha_devolucion = ?
      WHERE id = ?
    `;
    
    console.log("💾 Ejecutando actualización:", updateQuery);
    console.log("💾 Parámetros:", [nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones, estado_devolucion, fecha_devolucion, id]);

    const [result] = await pool.query(updateQuery, [
      nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones, 
      estado_devolucion, fecha_devolucion, id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Prenda no encontrada" });
    }

    console.log("✅ Actualización exitosa. Filas afectadas:", result.affectedRows);
    
    res.json({ 
      message: "Prenda actualizada correctamente",
      affectedRows: result.affectedRows 
    });

  } catch (error) {
    console.error("💥 ERROR al actualizar prenda:", error);
    console.error("💥 Mensaje:", error.message);
    
    return res.status(500).json({
      message: "Error interno del servidor al actualizar la prenda",
      error: error.message
    });
  } finally {
    console.log("=== FIN updatePrenda ===\n");
  }
};