// controllers/advance.controller.js
import AdvancePayment from '../models/advancePayment.js';
import Labour from '../models/Labour.js';

// Get all advances
const getAdvances = async (req, res) => {
  try {
    const { labourId, status, month, year } = req.query;
    const filter = {};
    
    if (labourId) filter.labourId = labourId;
    if (status && status !== 'all') filter.status = status;
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      filter.dateGiven = { $gte: startDate, $lte: endDate };
    }

    const advances = await AdvancePayment.find(filter)
      .populate('labourId', 'name phone')
      .populate('siteId', 'name location')
      .sort({ createdAt: -1 });

    res.json({ success: true, advances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create advance payment
const createAdvance = async (req, res) => {
  try {
    // Generate Advance ID
    const count = await AdvancePayment.countDocuments();
    const advanceId = `ADV${String(count + 1).padStart(4, '0')}`;

    const advance = new AdvancePayment({
      ...req.body,
      advanceId
    });

    await advance.save();
    
    res.status(201).json({
      success: true,
      message: 'Advance payment recorded successfully',
      advance
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get advances for payroll calculation
const getAdvancesForPayroll = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Month and year are required'
      });
    }

    // Get all pending advances up to the payroll month
    const payrollDate = new Date(year, month - 1, 31);
    
    const advances = await AdvancePayment.find({
      dateGiven: { $lte: payrollDate },
      status: 'pending',
      isActive: true
    }).populate('labourId', 'name phone');

    // Group by labourId
    const advancesByLabour = advances.reduce((acc, advance) => {
      if (!acc[advance.labourId]) {
        acc[advance.labourId] = {
          labourId: advance.labourId,
          totalAdvance: 0,
          advances: []
        };
      }
      acc[advance.labourId].totalAdvance += advance.amount;
      acc[advance.labourId].advances.push(advance);
      return acc;
    }, {});

    res.json({ 
      success: true, 
      advancesByLabour: Object.values(advancesByLabour) 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark advances as deducted
const markAdvancesDeducted = async (req, res) => {
  try {
    const { advances, month, year } = req.body;
    
    const updatePromises = advances.map(advanceId => 
      AdvancePayment.findByIdAndUpdate(advanceId, {
        status: 'deducted',
        'deductedInPayroll.month': month,
        'deductedInPayroll.year': year,
        'deductedInPayroll.deductedDate': new Date()
      })
    );

    await Promise.all(updatePromises);
    
    res.json({ 
      success: true, 
      message: 'Advances marked as deducted' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAdvances, createAdvance, getAdvancesForPayroll, markAdvancesDeducted };
