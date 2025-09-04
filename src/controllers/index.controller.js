import { pool } from "../db.js";
export const getquery =async (req, res) => {
  const [result] = await pool.query('SELECT "pong" AS RESULTADO ');
  res.json(result[0]);
};
