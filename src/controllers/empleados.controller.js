import { pool } from "../db.js";

export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM empleados");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: "Algo salio mal ",
    });
  }
};
export const getEmployeesbyId = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM empleados WHERE id = ?", [
      req.params.id,
    ]);
    console.log(rows);
    if (rows.length <= 0)
      return res.status(404).json({
        message: "Empleado no encontrado",
      });

    res.send(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Algo salio mal ",
    });
  }
};

export const createEmployee = async (req, res) => {
  const { nombre, salario } = req.body;
  try {
    const [rows] = await pool.query(
      "INSERT INTO empleados( nombre,salario ) VALUES(?,?)",
      [nombre, salario]
    );
    res.send({
      id: rows.insertId,
      nombre,
      salario,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Algo salio mal ",
    });
  }
};
export const deleteEmployee = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM empleados WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: "Empleado no encontrado",
      });
    else
      return res.status(200).json({
        message: "Empleado Eliminado correctamente",
      });
  } catch (error) {
    return res.status(500).json({
      message: "Algo salio mal ",
    });
  }
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { nombre, salario } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE empleados SET nombre = IFNULL(?,nombre), salario = IFNULL(?,salario) WHERE id = ? ",
      [nombre, salario, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: "Empleado no encontrado",
      });

    const [rows] = await pool.query("SELECT * FROM empleados WHERE id = ?", [
      id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message:'Algo salio mal '
    })
  }
};
