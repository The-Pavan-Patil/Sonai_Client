// models/AdvancePayment.js - Separate model for advance tracking
import mongoose from "mongoose";

const advancePaymentSchema = new mongoose.Schema({
  advanceId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  labourId: {
    type: String,
    required: true,
    ref: "Labour"
  },
  siteId: {
    type: String,
    required: true,
    ref: "Site"
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  reason: {
    type: String,
    required: true,
    enum: ["emergency", "medical", "family", "festival", "transport", "other"]
  },
  description: {
    type: String,
    default: ""
  },
  dateGiven: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "deducted", "cancelled"],
    default: "pending"
  },
  deductedInPayroll: {
    month: { type: Number },
    year: { type: Number },
    deductedAmount: { type: Number, default: 0 },
    deductedDate: { type: Date }
  },
  approvedBy: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true, 
  collection: "AdvancePayments" 
});

const AdvancePayment = mongoose.model("AdvancePayment", advancePaymentSchema);
export default AdvancePayment;
