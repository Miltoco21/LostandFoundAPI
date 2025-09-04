import { pool } from "../db.js";
import bcrypt from 'bcrypt'

export const registro = async (req, res) => {
  try {
    const { nombre, apellido, email, password,  } = req.body;

    const checkQuery = "SELECT * FROM usuario WHERE email = ?";
    const [checkResults] = await pool.query(checkQuery, [email]);

    if (checkResults.length > 0) {
      return res.status(409).json({ message: "Email ya existe en los registros" });
    }

    const hash = await bcrypt.hash(password, 10);

    const [rows] = await pool.query(
      "INSERT INTO usuario( nombre,apellido,email,password ) VALUES(?,?,?,?)",
      [nombre, apellido, email, hash]
    );
    res.status(200).json({
      message: "Guardado con exito ",
    });
  } catch (error) {
    console.error("Error during registration:", error);

    return res.status(500).json({
      message: "Algo salio mal ",
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuario");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: "Algo salio mal ",
    });
  }
};
