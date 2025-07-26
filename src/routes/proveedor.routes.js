import { Router } from "express";

import {
  registrarProveedor,
  buscarProveedor,
  editarProveedor,
  listarProveedor,
} from "../controllers/proveedor.controller.js";
const router = Router();

//router.get('/',listarProveedor);
router.post("/", registrarProveedor);
router.get("/:id", buscarProveedor);
router.put("/:id", editarProveedor);
router.get("/", listarProveedor);

export default router;