import { Router } from "express";
import { postlogin } from "../controllers/login.controller.js";
const router =Router();


router.post('/',postlogin);


export default router;