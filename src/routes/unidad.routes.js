import { Router } from "express";
import { listarUnidades, crearUnidad, verUnidad, actualizarUnidad } from "../controllers/unidad.controller.js";
const router = Router();

router.get('/', listarUnidades);
router.post('/', crearUnidad);
router.get('/:id', verUnidad);
router.put('/:id', actualizarUnidad);

export default router;  // Exportar el router como default