import { Router } from "express";
import {getVentas,
        createVenta,
        updateVenta,
        getVenta,
        getVentaDetalles} from "../controllers/venta.controller.js"

const router = Router();

router.get("/ventas", getVentas);
router.post("/ventas", createVenta);
router.put("/ventas/:id", updateVenta);
//mostrar un solo registro
router.get("/ventas/:id", getVenta);
router.get("/ventas/:id/detalles", getVentaDetalles);


export default router;