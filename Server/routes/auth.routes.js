// routes/auth.routes.js
import express from "express";
import { login, verifyToken, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.get("/verify", verifyToken);
router.post("/logout", logout);

export default router;
