import { pool } from "../db.js";

export const registroJugadores = async (req, res) => {
  try {
    const { nombre, posicion, email, rut, fechaNacimiento,equipo_id } = req.body;

    // Log the incoming request body
    console.log("Incoming data for registro Jugadores:", req.body);

    const checkQuery = "SELECT * FROM jugadores WHERE rut = ?";
    const [checkResults] = await pool.query(checkQuery, [rut]);

    if (checkResults.length > 0) {
      return res
        .status(409)
        .json({ message: "Jugador ya existe en los registros" });
    }

    const [rows] = await pool.query(
      "INSERT INTO jugadores( nombre, posicion, email, rut, fechaNacimiento,equipo_id ) VALUES(?,?,?,?,?,?)",
      [nombre, posicion, email, rut, fechaNacimiento,equipo_id ]
    );

    console.log("Data inserted successfully:", { nombre, posicion, email, rut, fechaNacimiento,equipo_id  });
    
    res.status(200).json({
      message: "Jugador Guardado con exito",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    console.log("Error during registration:", error);

    return res.status(500).json({
      message: "Algo salio mal",
    });
  }
};

export const getJugadores= async (req, res) => {
  try {
    // Log the query execution
    console.log("Executing query to fetch Jugadores");

    const [rows] = await pool.query("SELECT * FROM jugadores");

    // Log the results fetched from the database
    console.log("Jugadores fetched:", rows);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching equipos:", error);

    return res.status(500).json({
      message: "Algo salio mal",
    });
  }
};