import { pool } from "../db.js";
import bcrypt from 'bcryptjs'


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Confirmar si existe el usuario
    const selectQuery = 'SELECT * FROM usuario WHERE email = ?';
    const [selectResults] = await pool.query(selectQuery, [email]);

    if (selectResults.length === 0) {
      return res.status(401).json({ error: 'Credencial inválida' });
    }

    const user = selectResults[0];

    // Comparar la contraseña proporcionada con el hash almacenado
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Eliminar el campo 'password' antes de retornar los datos del usuario
    const { password: _, ...userWithoutPassword } = user;

    // Mostrar los datos del usuario en la consola
    console.log("Datos del usuario autenticado:", userWithoutPassword);

    // Retornar los datos del usuario sin la contraseña
    return res.status(200).json(userWithoutPassword);
    
  } catch (error) {
    console.error('Error al iniciar sesión: ', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};