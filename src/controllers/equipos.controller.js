import { pool } from "../db.js";

export const registroEquipos = async (req, res) => {
  try {
    const { nombre, logo, email, representante, capitan } = req.body;

    // Log the incoming request body
    console.log("Incoming data for registroEquipos:", req.body);

    const checkQuery = "SELECT * FROM equipos WHERE logo = ?";
    const [checkResults] = await pool.query(checkQuery, [logo]);

    if (checkResults.length > 0) {
      return res
        .status(409)
        .json({ message: "Equipo ya existe en los registros" });
    }

    const [rows] = await pool.query(
      "INSERT INTO equipos( nombre, logo, email, representante, capitan ) VALUES(?,?,?,?,?)",
      [nombre, logo, email, representante, capitan]
    );

    console.log("Data inserted successfully:", { nombre, logo, email, representante, capitan });
    
    res.status(200).json({
      message: "Equipo Guardado con exito",
    });
  } catch (error) {
    console.error("Error during registration:", error);

    return res.status(500).json({
      message: "Algo salio mal",
    });
  }
};

export const getEquipos = async (req, res) => {
  try {
    // Log the query execution
    console.log("Executing query to fetch equipos");

    const [rows] = await pool.query("SELECT * FROM equipos");

    // Log the results fetched from the database
    console.log("Equipos fetched:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching equipos:", error);

    return res.status(500).json({
      message: "Algo salio mal",
    });
  }
};

export const editarEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, logo, email, representante, capitan } = req.body;

    // Log de los datos recibidos
    console.log("Updating team with ID:", id);
    console.log("New data:", { nombre, logo, email, representante, capitan });

    // Verificación de la existencia del equipo
    const checkQuery = "SELECT * FROM equipos WHERE id = ?";
    const [existingTeam] = await pool.query(checkQuery, [id]);

    if (existingTeam.length === 0) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    // Actualización del equipo
    const updateQuery = "UPDATE equipos SET nombre = ?, logo = ?, email = ?, representante = ?, capitan = ? WHERE id = ?";
    const [result] = await pool.query(updateQuery, [nombre, logo, email, representante, capitan, id]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: "No se pudo actualizar el equipo" });
    }

    // Log de la respuesta exitosa
    console.log("Equipo actualizado exitosamente:", { id, nombre, logo, email, representante, capitan });

    res.status(200).json({ message: "Equipo actualizado exitosamente" });
  } catch (error) {
    console.error("Error updating team:", error);
    return res.status(500).json({ message: "Algo salió mal" });
  }
};



export const eliminarEquipo = async (req, res) => {
  try {
    const { id } = req.params;

    // Log the incoming data
    console.log("Deleting team with ID:", id);

    const deleteQuery = "DELETE FROM equipos WHERE id = ?";
    const [result] = await pool.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    res.status(200).json({ message: "Equipo eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting team:", error);
    return res.status(500).json({ message: "Algo salió mal" });
  }
};

