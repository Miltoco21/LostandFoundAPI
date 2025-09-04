// import express, { json } from "express";
// import rutaEmpleados from '../src/routes/empleados.routes.js'
// import rutaIndex from '../src/routes/index.routes.js'
// import rutaRegistro from '../src/routes/registro.routes.js'
// import rutaLogin from '../src/routes/login.routes.js'
// import rutaUsuarios from '../src/routes/usuarios.routes.js'
// import rutaHome from "../src/routes/home.routes.js"
// import rutaEquipos from "../src/routes/equipos.routes.js"
// import rutaJugadores from "../src/routes/jugadores.routes.js"
// import rutaPrendas from "../src/routes/prendas.routes.js"

// import cors from "cors"


// const app = express()
// app.use(cors())
 
// app.use(express.json())//json antesde las rutas 




// // app.use('/',rutaEmpleados)
// // app.use('/',rutaHome)
// // app.use('/',rutaIndex)
// // app.use('/',rutaRegistro)
// // app.use('/',rutaLogin)
// // app.use('/',rutaUsuarios)
// // app.use('/',rutaEquipos)
// // app.use('/',rutaJugadores)

// app.use('/empleados', rutaEmpleados);
// app.use('/home', rutaHome);
// app.use('/registro', rutaRegistro);
// app.use('/login', rutaLogin);
// app.use('/usuarios', rutaUsuarios);
// app.use('/equipos', rutaEquipos);
// app.use('/jugadores', rutaJugadores);
// app.use('/prendas', rutaPrendas);



// app.use((req,res,next )=>{
//   res.status(404).json({
//     message:'La ruta solicitada no existeeeee'
//   })
// })


// export default app



import express, { json } from "express";
//import rutaEmpleados from '../src/routes/empleados.routes.js'
import rutaIndex from '../src/routes/index.routes.js'
//import rutaRegistro from '../src/routes/registro.routes.js'
//import rutaLogin from '../src/routes/login.routes.js'
//import rutaUsuarios from '../src/routes/usuarios.routes.js'
//import rutaHome from "../src/routes/home.routes.js"
//import rutaEquipos from "../src/routes/equipos.routes.js"
//import rutaJugadores from "../src/routes/jugadores.routes.js"
import rutaPrendas from "../src/routes/prendas.routes.js"

import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

// Middleware de logging global
app.use((req, res, next) => {
  console.log(`🌐 GLOBAL: ${req.method} ${req.url}`);
  console.log('📍 Path:', req.path);
  console.log('📦 Body:', req.body);
  next();
});

// Registrar rutas
console.log("🚀 Registrando rutas...");

// app.use('/empleados', rutaEmpleados);
// app.use('/home', rutaHome);
// app.use('/registro', rutaRegistro);
// app.use('/login', rutaLogin);
// app.use('/usuarios', rutaUsuarios);
// app.use('/equipos', rutaEquipos);
// app.use('/jugadores', rutaJugadores);
app.use('/prendas', rutaPrendas);

// console.log("✅ Rutas registradas:");
// console.log("   /empleados");
// console.log("   /home");
// console.log("   /registro");
// console.log("   /login");
// console.log("   /usuarios");
// console.log("   /equipos");
// console.log("   /jugadores");
console.log("   /prendas ← ESTA ES LA QUE NOS INTERESA");

// Middleware para rutas no encontradas
app.use((req, res, next) => {
  console.log(`❌ RUTA NO ENCONTRADA: ${req.method} ${req.url}`);
  res.status(404).json({
    message: 'La ruta solicitada no existee',
    attempted: req.url,
    method: req.method
  });
});

export default app