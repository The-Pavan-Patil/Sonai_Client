import express from "express";
import { getProjects, createProject } from "../controllers/portfolio.controller.js";

const router = express.Router();

router.get("/projects", getProjects);
router.post("/projects", createProject);

export default router;
