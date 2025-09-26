// models/Labour.js
import mongoose from "mongoose";

const labourSchema = new mongoose.Schema({
  labourId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    enum: ["electrician", "plumber", "hvac-tech", "general", "supervisor"],
    required: true,
    default: "general"
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emergencyContact: {
    name: { type: String, default: "" },
    phone: { type: String, default: "" }
  }
}, { 
  timestamps: true, 
  collection: "Labours"
});

// Drop existing index to prevent conflicts
labourSchema.index({ labourId: 1 }, { unique: true });

const Labour = mongoose.model("Labour", labourSchema);
export default Labour;
