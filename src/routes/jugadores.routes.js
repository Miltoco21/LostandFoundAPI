import { Router } from "express";
import { registroJugadores,getJugadores} from "../controllers/jugadores.controller.js";

const router = Router();

router.get("/jugadores", getJugadores);
router.post("/jugadores", registroJugadores);
// router.put("/equipos/:id", (req, res, next) => {
//   console.log("ID recibido:", req.params.id);
//   next();
// }, editarEquipo);

// // router.put("/equipos/:id", editarEquipo);
// router.delete("/equipos/:id", eliminarEquipo);




export default router;
