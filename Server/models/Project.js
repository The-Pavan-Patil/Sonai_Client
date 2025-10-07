// models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  client: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  projectType: {
    type: String,
    enum: ['electrical', 'plumbing', 'hvac', 'firefighting', 'automation', 'mixed'],
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'ongoing', 'upcoming'],
    default: 'completed'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  projectValue: {
    type: Number,
    min: 0
  },
  duration: {
    type: String
  },
  scope: [{
    type: String
  }],
  features: [{
    type: String
  }],
  technologies: [{
    type: String
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      default: ""
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  teamSize: {
    type: Number,
    default: 1
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'Projects'
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
