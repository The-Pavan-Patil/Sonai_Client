// routes/payroll.routes.js
import express from "express";
import { calculateAllSalaries } from "../controllers/payroll.controller.js";

const router = express.Router();

router.get("/calculate-all", calculateAllSalaries);

export default router;
