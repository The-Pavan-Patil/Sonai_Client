// controllers/attendance.controller.js
import Attendance from '../models/Attendance.js';
import Labour from '../models/Labour.js';

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const { labourId, date, checkIn, checkOut, status, notes, project } = req.body;

    // Validate required fields
    if (!labourId) {
      return res.status(400).json({
        success: false,
        message: 'Labour ID is required'
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    if (!checkIn) {
      return res.status(400).json({
        success: false,
        message: 'Check-in time is required'
      });
    }

    // Verify labour exists
    const labour = await Labour.findOne({ labourId });
    if (!labour) {
      return res.status(404).json({ success: false, message: 'Labour not found' });
    }

    // Calculate hours if checkOut is provided
    let totalHours = 0;
    let overtime = 0;

    if (checkIn && checkOut) {
      const checkInTime = new Date(`${date} ${checkIn}`);
      const checkOutTime = new Date(`${date} ${checkOut}`);
      totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
      
      if (totalHours > 8) {
        overtime = totalHours - 8;
      }
    }

    const attendanceData = {
      labourId,
      date: new Date(date),
      checkIn,
      checkOut: checkOut || null,
      totalHours: Math.max(0, totalHours),
      overtime: Math.max(0, overtime),
      status: status || 'present',
      notes: notes || ''
    };

    console.log('Creating attendance with data:', attendanceData); // Debug log

    const attendance = new Attendance(attendanceData);
    await attendance.save();

    
    
    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance
    });
    
  } catch (error) {
    console.error('Attendance marking error:', error); // Debug log
    
    if (error.code === 11000) {
      res.status(400).json({ 
        success: false, 
        message: 'Attendance already marked for this labour on this date' 
      });
    } else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ 
        success: false, 
        message: 'Attendance validation failed',
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


// Update attendance
const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('project', 'name');

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      attendance
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Calculate salary
const calculateSalary = async (req, res) => {
  try {
    const { labourId } = req.params;
    const { month, year } = req.query;

    const labour = await Labour.findOne({ labourId });
    if (!labour) {
      return res.status(404).json({ success: false, message: 'Labour not found' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendance = await Attendance.find({
      labourId,
      date: { $gte: startDate, $lte: endDate }
    });

    const totalHours = attendance.reduce((sum, att) => sum + att.totalHours, 0);
    const totalOvertime = attendance.reduce((sum, att) => sum + att.overtime, 0);

    const baseSalary = totalHours * labour.hourlyRate;
    const overtimePay = totalOvertime * labour.hourlyRate * 1.5; // 1.5x for overtime
    const totalSalary = baseSalary + overtimePay;

    res.json({
      success: true,
      salary: {
        labourId,
        labourName: labour.name,
        month: parseInt(month),
        year: parseInt(year),
        hourlyRate: labour.hourlyRate,
        totalHours: Math.round(totalHours * 100) / 100,
        totalOvertime: Math.round(totalOvertime * 100) / 100,
        baseSalary: Math.round(baseSalary * 100) / 100,
        overtimePay: Math.round(overtimePay * 100) / 100,
        totalSalary: Math.round(totalSalary * 100) / 100,
        workingDays: attendance.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('labourId', 'name') // Assuming labourId is ref to Labour
      .sort({ date: -1 });

    res.json({
      success: true,
      attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getAttendanceByLabour = async (req, res) => {
  try {
    const { labourId } = req.params;
    const { month, year } = req.query;

    let filter = { labourId };
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(filter)
      .populate('project', 'name')
      .sort({ date: -1 });

    // Calculate performance metrics
    const totalDays = attendance.length;
    const totalHours = attendance.reduce((sum, att) => sum + att.totalHours, 0);
    const totalOvertime = attendance.reduce((sum, att) => sum + att.overtime, 0);
    const presentDays = attendance.filter(att => 
      att.status === 'present' || att.status === 'overtime'
    ).length;

    const performance = {
      totalDays,
      presentDays,
      totalHours: Math.round(totalHours * 100) / 100,
      totalOvertime: Math.round(totalOvertime * 100) / 100,
      attendanceRate: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0
    };

    res.json({
      success: true,
      attendance,
      performance
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export { markAttendance, getAttendanceByLabour, updateAttendance, calculateSalary, getAllAttendance };
