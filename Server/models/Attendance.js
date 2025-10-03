// models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  labourId: {
    type: String,
    required: true
  },
  site: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Site",
    required: true
  },
  date: {
    type: Date,
    required: true,
  },
  checkIn: {
    type: String,
    required: true,
  },
  checkOut: {
    type: String,
  },
  totalHours: {
    type: Number,
    default: 0
  },
  overtime: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["present", "absent", "half-day", "overtime"],
    default: "present"
  },
  notes: {
    type: String,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  }
}, { 
  timestamps: true, 
  collection: "Attendance" 
});

// Compound index for unique attendance per labour per date
attendanceSchema.index({ labourId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
