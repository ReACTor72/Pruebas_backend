import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json("Servidor FERRETERIA URKUPIÑA");
});

export default router;
