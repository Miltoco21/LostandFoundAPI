import { Router } from "express";
import { pool } from "../db.js";
import {getquery} from '../controllers/index.controller.js';

//router como metodo en reemplazo de app

const router = Router();

router.get("/ping",getquery );


export default router;
