import mongoose from "mongoose";

const siteSchema = new mongoose.Schema({
  siteId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: "Sites"
});

// Drop existing index to prevent conflicts
siteSchema.index({ siteId: 1 }, { unique: true });

const Site = mongoose.model("Site", siteSchema);
export default Site;
