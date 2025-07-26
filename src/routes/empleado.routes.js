import { Router } from "express";
import { crearEmpleado, listarEmpleados, verEmpleado, actualizarEmpleado } from "../controllers/empleado.controller.js";
const router =Router();

router.get('/',listarEmpleados);
router.post('/',crearEmpleado);
router.get('/:id', verEmpleado);
router.put('/:id',actualizarEmpleado);


export default router;