import { Router } from "express";

import { crearProducto, listarProductos, verProducto, editarProducto,verPrecioProducto } from "../controllers/producto.controller.js";
import upload from "../middlewares/upload.js";

const router = Router();

// Ruta para crear un producto (con imagen)
router.post('/', upload.single("imagen"), crearProducto);

// Ruta para listar todos los productos
router.get('/', listarProductos);

// Ruta para ver un producto por su ID
router.get('/:id', verProducto);
router.get('/precio/:id', verPrecioProducto);


// Ruta para editar un producto por su ID (incluyendo la imagen)
router.put('/:id', upload.single("imagen"), editarProducto); // Se incluye upload.single("imagen") si deseas permitir la actualización de la imagen

export default router;
