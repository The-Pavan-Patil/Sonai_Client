// routes/labour.routes.js
import express from "express";
import { getLabours, getLabourById, createLabour, updateLabour, deleteLabour } from "../controllers/labour.controller.js";

const router = express.Router();

router.get("/", getLabours);
router.get("/:id", getLabourById);
router.post("/", createLabour);
router.put("/:id", updateLabour);
router.delete("/:id", deleteLabour);

export default router;
