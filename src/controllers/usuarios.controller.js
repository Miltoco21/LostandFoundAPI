import { pool } from "../db.js";

export const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: "Algo salio mal ",
    });
  }
};
export const createUsers = async (req, res) => {
  const {
    nombres,
    apellidos,
    email,
    direccion,
    telefono,
    comuna,
    region,
    codigoPostal,
    rut,
    codigoUsuario,
    clave,
    remuneracion,
    credito,
  } = req.body;
  try {
    const [rows] = await pool.query(
      "INSERT INTO usuarios SET ?",
      {
        nombres,
        apellidos,
        email,
        direccion,
        telefono,
        comuna,
        region,
        codigoPostal,
        rut,
        codigoUsuario,
        clave,
        remuneracion,
        credito,
      },
      [
        nombres,
        apellidos,
        email,
        direccion,
        telefono,
        comuna,
        region,
        codigoPostal,
        rut,
        codigoUsuario,
        clave,
        remuneracion,
        credito,
      ]
    );
    res.status(200).json({
      message: "Guardado con exito ",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Algo salio mal ",
    });
  }
};
// export const getEmployeesbyId = async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM empleados WHERE id = ?", [
//       req.params.id,
//     ]);
//     console.log(rows);
//     if (rows.length <= 0)
//       return res.status(404).json({
//         message: "Empleado no encontrado",
//       });

//     res.send(rows[0]);
//   } catch (error) {
//     return res.status(500).json({
//       message: "Algo salio mal ",
//     });
//   }
// };

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
      message: "Algo salio mal ",
    });
  }
};
