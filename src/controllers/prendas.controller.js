// import { pool } from "../db.js";
// import  { sendGarmentFoundEmail } from '../utils/emailsender.js';


// export const registroPrendas = async (req, res) => {
//   console.log("=== INICIO registroPrendas ===");
//   console.log("Método:", req.method);
//   console.log("URL:", req.url);
//   console.log("Headers:", req.headers);
//   console.log("Body recibido:", req.body);
  
//   try {
//     const { nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones } = req.body;

//     // Validar que los campos obligatorios estén presentes
//     if (!nombre || !rut || !email || !tipo_prenda || !telefono || !talla || !estado) {
//       console.log("❌ Campos faltantes detectados");
//       return res.status(400).json({ 
//         message: "Faltan campos obligatorios",
//         received: req.body,
//         required: ["nombre", "rut", "email", "tipo_prenda", "telefono", "talla", "estado"]
//       });
//     }

//     console.log("✅ Todos los campos obligatorios presentes");

//     // ELIMINAMOS LA VERIFICACIÓN DE DUPLICADOS
//     // Cada prenda es única por su ID generado automáticamente
//     // Una persona puede tener múltiples prendas del mismo tipo y talla
    
//     console.log("📝 Procediendo con el registro directo (sin verificar duplicados)");

//     // Insertar en la base de datos
//     const insertQuery = "INSERT INTO prendas(nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
//     console.log("💾 Ejecutando inserción:", insertQuery);
//     console.log("💾 Parámetros:", [nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones]);

//     const [rows] = await pool.query(insertQuery, [nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones]);

//     console.log("✅ Inserción exitosa. Resultado:", rows);
//     console.log("🎉 ID único de prenda creada:", rows.insertId);
    
//     const response = {
//       message: "Prenda guardada con éxito",
//       id: rows.insertId,
//       prenda: {
//         id: rows.insertId,
//         nombre, 
//         rut, 
//         email, 
//         tipo_prenda, 
//         telefono, 
//         talla, 
//         estado, 
//         observaciones,
//         fecha_registro: new Date().toISOString()
//       }
//     };

//     console.log("📤 Enviando respuesta:", response);
//     res.status(201).json(response);

//   } catch (error) {
//     console.error("💥 ERROR COMPLETO:", error);
//     console.error("💥 Mensaje:", error.message);
//     console.error("💥 Stack:", error.stack);
//     console.error("💥 Code:", error.code);
    
//     // Verificar si es un error de clave duplicada específicamente en el ID
//     if (error.code === 'ER_DUP_ENTRY' && error.message.includes('PRIMARY')) {
//       console.error("🔴 Error de ID duplicado (muy raro - problema de BD)");
//       return res.status(500).json({
//         message: "Error interno: problema con la generación de ID único",
//         error: "Contacte al administrador del sistema"
//       });
//     }
    
//     return res.status(500).json({
//       message: "Error interno del servidor",
//       error: error.message,
//       code: error.code,
//       sqlMessage: error.sqlMessage || 'No SQL error'
//     });
//   } finally {
//     console.log("=== FIN registroPrendas ===\n");
//   }
// };

// export const getPrendasByRut = async (req, res) => {
//   try {
//     console.log("🎯 getPrendasByRut INICIANDO");
//     console.log("📦 req.query completo:", req.query);
    
//     const { rut } = req.query;
//     console.log("📋 RUT extraído:", rut);
//     console.log("🔗 Pool disponible:", !!pool);
    
//     if (!rut) {
//       console.log("❌ RUT no proporcionado");
//       return res.status(400).json({ 
//         message: "El parámetro RUT es requerido",
//         received: req.query 
//       });
//     }

//     console.log("🔍 Ejecutando query SQL para RUT:", rut);
    
//     // Verificar que pool está disponible
//     if (!pool) {
//       console.error("💥 POOL NO DISPONIBLE");
//       return res.status(500).json({
//         message: "Error de conexión a base de datos - Pool no disponible"
//       });
//     }

//     const [rows] = await pool.query(
//       "SELECT * FROM prendas WHERE rut = ? ORDER BY fecha_registro DESC", 
//       [rut]
//     );
    
//     console.log(`✅ Query exitosa. Prendas encontradas para RUT ${rut}: ${rows.length}`);
//     console.log("📊 Datos encontrados:", rows);
    
//     // Asegurarse de que siempre devolvemos un array
//     const results = Array.isArray(rows) ? rows : [];
    
//     console.log("📤 Enviando respuesta:", results);
//     res.status(200).json(results);
    
//   } catch (error) {
//     console.error("💥 ERROR EN getPrendasByRut:", error);
//     console.error("📊 Error completo:", {
//       message: error.message,
//       stack: error.stack,
//       code: error.code,
//       sqlState: error.sqlState,
//       sqlMessage: error.sqlMessage
//     });
    
//     return res.status(500).json({
//       message: "Error al buscar prendas por RUT",
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
//     });
//   }
// };

// export const getPrendas = async (req, res) => {
//   try {
//     console.log("🎯 getPrendas INICIANDO (sin RUT)");
    
//     if (!pool) {
//       console.error("💥 POOL NO DISPONIBLE en getPrendas");
//       return res.status(500).json({
//         message: "Error de conexión a base de datos - Pool no disponible"
//       });
//     }

//     const [rows] = await pool.query("SELECT * FROM prendas ORDER BY fecha_registro DESC");
    
//     console.log(`✅ getPrendas exitosa. Total prendas: ${rows.length}`);
//     res.status(200).json(rows);
    
//   } catch (error) {
//     console.error("💥 ERROR EN getPrendas:", error);
//     return res.status(500).json({
//       message: "Error al obtener prendas",
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
//     });
//   }
// };

// // Actualizar estado de devolución de una prenda

// export const updateEstadoDevolucion = async (req, res) => {
//   console.log("=== INICIO updateEstadoDevolucion ===");
  
//   try {
//     const { id } = req.params;
//     const { estado_devolucion } = req.body;

//     if (!estado_devolucion) {
//       return res.status(400).json({ 
//         message: "El campo estado_devolucion es requerido" 
//       });
//     }

//     // Actualizar el estado de devolución y la fecha
//     const updateQuery = "UPDATE prendas SET estado_devolucion = ?, fecha_devolucion = NOW() WHERE id = ?";
//     const [result] = await pool.query(updateQuery, [estado_devolucion, id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Prenda no encontrada" });
//     }

//     // Si la prenda fue marcada como encontrada, enviar email
//     if (estado_devolucion.includes("Encontrada")) {
//       // Obtener los detalles completos de la prenda
//       const [garmentRows] = await pool.query(
//         "SELECT * FROM prendas WHERE id = ?", 
//         [id]
//       );
      
//       if (garmentRows.length > 0) {
//         const garment = garmentRows[0];
        
//         // Enviar email de notificación
//         const emailSent = await sendGarmentFoundEmail(
//           garment.email, 
//           garment
//         );
        
//         if (emailSent) {
//           console.log("✅ Email de notificación enviado correctamente");
//         } else {
//           console.log("⚠️ Email de notificación no pudo ser enviado");
//         }
//       }
//     }

//     console.log("✅ Actualización exitosa. Filas afectadas:", result.affectedRows);
    
//     res.json({ 
//       message: "Estado de devolución actualizado correctamente",
//       affectedRows: result.affectedRows 
//     });

//   } catch (error) {
//     console.error("💥 ERROR al actualizar estado:", error);
//     return res.status(500).json({
//       message: "Error interno del servidor al actualizar el estado",
//       error: error.message
//     });
//   } finally {
//     console.log("=== FIN updateEstadoDevolucion ===\n");
//   }
// };

// // Obtener prendas por RUT



// // Actualizar una prenda completa


// // Actualizar una prenda completa
// export const updatePrenda = async (req, res) => {
//   console.log("=== INICIO updatePrenda ===");
//   console.log("Método:", req.method);
//   console.log("Params:", req.params);
//   console.log("Body recibido:", req.body);
  
//   try {
//     const { id } = req.params;
//     const { nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones, estado_devolucion } = req.body;

//     // Validar que los campos obligatorios estén presentes
//     if (!nombre || !rut || !email || !tipo_prenda || !telefono || !talla || !estado) {
//       console.log("❌ Campos faltantes detectados");
//       return res.status(400).json({ 
//         message: "Faltan campos obligatorios",
//         required: ["nombre", "rut", "email", "tipo_prenda", "telefono", "talla", "estado"]
//       });
//     }

//     // Actualizar la prenda en la base de datos
//     const updateQuery = `
//       UPDATE prendas 
//       SET nombre = ?, rut = ?, email = ?, tipo_prenda = ?, telefono = ?, talla = ?, estado = ?, observaciones = ?, estado_devolucion = ?, fecha_devolucion = ?
//       WHERE id = ?
//     `;
    
//     console.log("💾 Ejecutando actualización:", updateQuery);
//     console.log("💾 Parámetros:", [nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones, estado_devolucion, fecha_devolucion, id]);

//     const [result] = await pool.query(updateQuery, [
//       nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones, 
//       estado_devolucion, fecha_devolucion, id
//     ]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Prenda no encontrada" });
//     }

//     console.log("✅ Actualización exitosa. Filas afectadas:", result.affectedRows);
    
//     res.json({ 
//       message: "Prenda actualizada correctamente",
//       affectedRows: result.affectedRows 
//     });

//   } catch (error) {
//     console.error("💥 ERROR al actualizar prenda:", error);
//     console.error("💥 Mensaje:", error.message);
    
//     return res.status(500).json({
//       message: "Error interno del servidor al actualizar la prenda",
//       error: error.message
//     });
//   } finally {
//     console.log("=== FIN updatePrenda ===\n");
//   }
// };

import { pool } from "../db.js";
import { sendStatusUpdateEmail, sendGarmentFoundEmail } from '../utils/emailsender.js';

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

// Actualizar estado de devolución de una prenda - VERSIÓN MEJORADA CON EMAILS DINÁMICOS
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

    console.log(`🔄 Actualizando prenda ${id} a estado: ${estado_devolucion}`);

    // Obtener el estado anterior de la prenda ANTES de actualizar
    const [prevStateRows] = await pool.query("SELECT estado_devolucion FROM prendas WHERE id = ?", [id]);
    const previousState = prevStateRows.length > 0 ? prevStateRows[0].estado_devolucion : null;
    
    console.log(`📊 Estado anterior: ${previousState} -> Estado nuevo: ${estado_devolucion}`);

    // Actualizar el estado de devolución y la fecha
    const updateQuery = "UPDATE prendas SET estado_devolucion = ?, fecha_devolucion = NOW() WHERE id = ?";
    const [result] = await pool.query(updateQuery, [estado_devolucion, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Prenda no encontrada" });
    }

    console.log("✅ Actualización exitosa. Filas afectadas:", result.affectedRows);

    // Obtener los detalles completos de la prenda actualizada
    const [garmentRows] = await pool.query("SELECT * FROM prendas WHERE id = ?", [id]);
    
    if (garmentRows.length > 0) {
      const garment = garmentRows[0];
      
      // Solo enviar email si el estado realmente cambió
      if (previousState !== estado_devolucion) {
        console.log(`📧 Enviando email para cambio de estado: ${previousState} -> ${estado_devolucion}`);
        
        try {
          // Usar la nueva función dinámica de emails
          const emailResult = await sendStatusUpdateEmail(
            garment.email, 
            garment, 
            estado_devolucion
          );
          
          if (emailResult.sent) {
            console.log(`✅ Email enviado correctamente. ID: ${emailResult.messageId}`);
          } else {
            console.log(`⚠️ Email no enviado. Razón: ${emailResult.reason || emailResult.error}`);
          }
          
          // Incluir información del email en la respuesta
          res.json({ 
            message: "Estado de devolución actualizado correctamente",
            affectedRows: result.affectedRows,
            emailStatus: {
              sent: emailResult.sent,
              reason: emailResult.reason,
              messageId: emailResult.messageId
            },
            estadoAnterior: previousState,
            estadoNuevo: estado_devolucion
          });
          
        } catch (emailError) {
          console.error("💥 Error al enviar email:", emailError);
          
          // El estado se actualizó correctamente, pero el email falló
          res.json({ 
            message: "Estado de devolución actualizado correctamente",
            affectedRows: result.affectedRows,
            emailStatus: {
              sent: false,
              error: "Error al enviar notificación por email",
              details: emailError.message
            },
            estadoAnterior: previousState,
            estadoNuevo: estado_devolucion
          });
        }
      } else {
        console.log("📧 No se envía email - el estado no cambió");
        res.json({ 
          message: "Estado de devolución actualizado correctamente",
          affectedRows: result.affectedRows,
          emailStatus: {
            sent: false,
            reason: "Estado no cambió"
          }
        });
      }
    } else {
      // Esto no debería pasar, pero por seguridad
      res.json({ 
        message: "Estado de devolución actualizado correctamente",
        affectedRows: result.affectedRows,
        emailStatus: {
          sent: false,
          reason: "No se pudo obtener información de la prenda para el email"
        }
      });
    }

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

// Actualizar una prenda completa - VERSIÓN MEJORADA CON EMAILS DINÁMICOS
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

    // Obtener el estado anterior de devolución ANTES de actualizar
    const [prevStateRows] = await pool.query("SELECT estado_devolucion FROM prendas WHERE id = ?", [id]);
    const previousState = prevStateRows.length > 0 ? prevStateRows[0].estado_devolucion : null;
    
    console.log(`📊 Estado anterior: ${previousState} -> Estado nuevo: ${estado_devolucion}`);

    // Determinar la fecha de devolución
    const fecha_devolucion = estado_devolucion ? new Date() : null;

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

    // Si el estado de devolución cambió, enviar email
    if (estado_devolucion && previousState !== estado_devolucion) {
      console.log(`📧 Estado de devolución cambió: ${previousState} -> ${estado_devolucion}`);
      
      try {
        // Obtener los datos actualizados de la prenda para el email
        const updatedGarment = {
          id,
          nombre,
          rut,
          email,
          tipo_prenda,
          telefono,
          talla,
          estado,
          observaciones,
          estado_devolucion,
          fecha_devolucion
        };

        // Enviar email dinámico basado en el nuevo estado
        const emailResult = await sendStatusUpdateEmail(
          email, 
          updatedGarment, 
          estado_devolucion
        );
        
        if (emailResult.sent) {
          console.log(`✅ Email enviado correctamente. ID: ${emailResult.messageId}`);
        } else {
          console.log(`⚠️ Email no enviado. Razón: ${emailResult.reason || emailResult.error}`);
        }
        
        // Incluir información del email en la respuesta
        res.json({ 
          message: "Prenda actualizada correctamente",
          affectedRows: result.affectedRows,
          emailStatus: {
            sent: emailResult.sent,
            reason: emailResult.reason,
            messageId: emailResult.messageId
          },
          estadoAnterior: previousState,
          estadoNuevo: estado_devolucion
        });
        
      } catch (emailError) {
        console.error("💥 Error al enviar email:", emailError);
        
        // La prenda se actualizó correctamente, pero el email falló
        res.json({ 
          message: "Prenda actualizada correctamente",
          affectedRows: result.affectedRows,
          emailStatus: {
            sent: false,
            error: "Error al enviar notificación por email",
            details: emailError.message
          },
          estadoAnterior: previousState,
          estadoNuevo: estado_devolucion
        });
      }
    } else {
      console.log("📧 No se envía email - el estado de devolución no cambió o es nulo");
      res.json({ 
        message: "Prenda actualizada correctamente",
        affectedRows: result.affectedRows,
        emailStatus: {
          sent: false,
          reason: "Estado de devolución no cambió o es nulo"
        }
      });
    }

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
export const diagnosticoEmails = async (req, res) => {
  console.log("🔧 ========== DIAGNÓSTICO DE EMAILS ==========");
  
  try {
    // 1. Verificar configuración
    const configTest = await testEmailConfiguration();
    console.log("📧 Configuración de email:", configTest);
    
    // 2. Obtener estados disponibles
    const availableStates = getAvailableStatuses();
    console.log("📋 Estados disponibles:", availableStates);
    
    // 3. Verificar variables de entorno
    const envCheck = {
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASS: !!process.env.EMAIL_PASS,
      EMAIL_USER_VALUE: process.env.EMAIL_USER || 'NO_CONFIGURADO'
    };
    console.log("🔐 Variables de entorno:", envCheck);
    
    res.json({
      message: "Diagnóstico de emails completado",
      timestamp: new Date().toISOString(),
      configuration: configTest,
      availableStates: availableStates,
      environment: envCheck,
      status: configTest.configured ? "✅ CONFIGURADO" : "❌ ERROR"
    });
    
  } catch (error) {
    console.error("💥 Error en diagnóstico:", error);
    res.status(500).json({
      message: "Error en diagnóstico de emails",
      error: error.message
    });
  }
};

// Función para probar envío de email específico (para testing)
export const testEmail = async (req, res) => {
  console.log("🧪 ========== TEST DE EMAIL ==========");
  
  try {
    const { email, estado, prendasDatos } = req.body;
    
    if (!email || !estado) {
      return res.status(400).json({
        message: "Se requieren 'email' y 'estado' en el body"
      });
    }
    
    // Datos de prueba si no se proporcionan
    const testGarment = prendasDatos || {
      id: 999,
      tipo_prenda: "Poleron TEST",
      talla: "M",
      estado: "Bueno",
      observaciones: "Prenda de prueba para testing",
      nombre: "Usuario Test"
    };
    
    console.log(`🧪 Probando envío a: ${email}`);
    console.log(`📊 Estado: ${estado}`);
    console.log(`📦 Datos: ${JSON.stringify(testGarment)}`);
    
    const emailResult = await sendStatusUpdateEmail(email, testGarment, estado);
    
    res.json({
      message: "Test de email completado",
      timestamp: new Date().toISOString(),
      emailResult: emailResult,
      testData: {
        email,
        estado,
        garment: testGarment
      }
    });
    
  } catch (error) {
    console.error("💥 Error en test de email:", error);
    res.status(500).json({
      message: "Error en test de email",
      error: error.message
    });
  }
};