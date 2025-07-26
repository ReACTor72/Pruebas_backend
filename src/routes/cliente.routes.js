import { Router } from "express";
import {createCliente,
        getClientes,
        updateCliente,
        getCliente,
        getClienteCompras} from "../controllers/cliente.controller.js"

const router = Router();

router.get("/clientes", getClientes);
router.post("/clientes", createCliente);
router.put("/clientes/:id", updateCliente);
//mostrar un solo registro
router.get("/clientes/:id", getCliente);
//mostrar compras de un cliente
router.get("/clientes/:id/ventas", getClienteCompras);

export default router;