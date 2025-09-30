// controllers/labour.controller.js
import Labour from '../models/Labour.js';
import Attendance from '../models/Attendance.js';

// Get all labours
const getLabours = async (req, res) => {
  try {
    const labours = await Labour.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: labours.length,
      labours
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single labour
const getLabourById = async (req, res) => {
  try {
    const labour = await Labour.findOne({ labourId: req.params.id });
    if (!labour) {
      return res.status(404).json({ success: false, message: 'Labour not found' });
    }
    res.json({ success: true, labour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new labour
const createLabour = async (req, res) => {
  try {
    // Always generate a new Labour ID
    let labourId;
    let isUnique = false;
    let attempts = 0;
    
    // Try to generate a unique ID (max 10 attempts)
    while (!isUnique && attempts < 10) {
      attempts++;
      
      // Get count of existing labours and add 1
      const count = await Labour.countDocuments();
      labourId = `LAB${String(count + attempts).padStart(4, '0')}`;
      
      // Check if this ID already exists
      const existingLabour = await Labour.findOne({ labourId });
      if (!existingLabour) {
        isUnique = true;
      }
    }
    
    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: 'Unable to generate unique Labour ID after multiple attempts'
      });
    }
    
    // Create labour with generated ID
    const labourData = {
      ...req.body,
      labourId
    };
    
    const labour = new Labour(labourData);
    const savedLabour = await labour.save();
    
    res.status(201).json({
      success: true,
      message: 'Labour registered successfully',
      labour: savedLabour
    });
    
  } catch (error) {
    console.error('Error creating labour:', error);
    
    if (error.code === 11000) {
      res.status(400).json({ 
        success: false, 
        message: 'Labour ID conflict. Please try again.',
        error: 'DUPLICATE_KEY'
      });
    } else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      });
    }
  }
};

// Update labour
const updateLabour = async (req, res) => {
  try {
    const labour = await Labour.findOneAndUpdate(
      { labourId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!labour) {
      return res.status(404).json({ success: false, message: 'Labour not found' });
    }

    res.json({
      success: true,
      message: 'Labour updated successfully',
      labour
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete labour
const deleteLabour = async (req, res) => {
  try {
    const { id } = req.params;
    
    const labour = await Labour.findOneAndDelete({ labourId: id });
    
    if (!labour) {
      return res.status(404).json({ 
        success: false, 
        message: 'Labour not found' 
      });
    }

    res.json({
      success: true,
      message: 'Labour deleted successfully',
      deletedLabour: labour
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export { getLabours, getLabourById, createLabour, updateLabour, deleteLabour };
