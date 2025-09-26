// routes/attendance.routes.js
import express from "express";
import { markAttendance, getAttendanceByLabour, updateAttendance, calculateSalary, getAllAttendance } from "../controllers/attendance.controller.js";

const router = express.Router();

router.get("/", getAllAttendance);
router.post("/", markAttendance);
router.get("/labour/:labourId", getAttendanceByLabour);
router.put("/:id", updateAttendance);
router.get("/salary/:labourId", calculateSalary);

export default router;
