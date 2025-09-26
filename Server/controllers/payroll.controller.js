// controllers/payroll.controller.js
import Labour from '../models/Labour.js';
import Attendance from '../models/Attendance.js';

// Calculate salary for all labours
const calculateAllSalaries = async (req, res) => {
  try {
    const { month, year, period = 'monthly', overtimeRate = 1.5 } = req.query;
    
    // Get all active labours
    const labours = await Labour.find({ isActive: true });
    
    if (labours.length === 0) {
      return res.json({
        success: true,
        message: 'No active labours found',
        salaries: []
      });
    }

    const salaryData = [];
    let startDate, endDate;

    // Calculate date range based on period
    if (period === 'weekly') {
      // Get current week or specific week
      const currentDate = new Date();
      const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
      startDate = firstDayOfWeek;
      endDate = new Date(firstDayOfWeek);
      endDate.setDate(endDate.getDate() + 6);
    } else {
      // Monthly calculation
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
    }

    console.log(`Calculating ${period} salaries from ${startDate} to ${endDate}`);

    // Calculate salary for each labour
    for (const labour of labours) {
      try {
        const attendance = await Attendance.find({
          labourId: labour.labourId,
          date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        // Calculate totals
        const totalHours = attendance.reduce((sum, att) => sum + (att.totalHours || 0), 0);
        const totalOvertime = attendance.reduce((sum, att) => sum + (att.overtime || 0), 0);
        const workingDays = attendance.length;
        const presentDays = attendance.filter(att => 
          att.status === 'present' || att.status === 'overtime'
        ).length;

        // Calculate salary components
        const regularHours = Math.max(0, totalHours - totalOvertime);
        const baseSalary = regularHours * labour.hourlyRate;
        const overtimePay = totalOvertime * labour.hourlyRate * parseFloat(overtimeRate);
        const totalSalary = baseSalary + overtimePay;

        // Calculate attendance rate
        const attendanceRate = workingDays > 0 ? (presentDays / workingDays) * 100 : 0;

        salaryData.push({
          labourId: labour.labourId,
          name: labour.name,
          category: labour.category,
          phone: labour.phone,
          hourlyRate: labour.hourlyRate,
          totalHours: Math.round(totalHours * 100) / 100,
          regularHours: Math.round(regularHours * 100) / 100,
          overtimeHours: Math.round(totalOvertime * 100) / 100,
          workingDays,
          presentDays,
          attendanceRate: Math.round(attendanceRate * 100) / 100,
          baseSalary: Math.round(baseSalary * 100) / 100,
          overtimePay: Math.round(overtimePay * 100) / 100,
          totalSalary: Math.round(totalSalary * 100) / 100,
          period,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          attendanceRecords: attendance.map(att => ({
            date: att.date.toISOString().split('T')[0],
            checkIn: att.checkIn,
            checkOut: att.checkOut,
            hours: att.totalHours,
            overtime: att.overtime,
            status: att.status
          }))
        });
      } catch (error) {
        console.error(`Error calculating salary for ${labour.labourId}:`, error);
        // Continue with other labours even if one fails
      }
    }

    // Calculate summary statistics
    const summary = {
      totalLabours: salaryData.length,
      totalSalaryPayout: salaryData.reduce((sum, s) => sum + s.totalSalary, 0),
      totalHours: salaryData.reduce((sum, s) => sum + s.totalHours, 0),
      totalOvertimeHours: salaryData.reduce((sum, s) => sum + s.overtimeHours, 0),
      averageAttendanceRate: salaryData.length > 0 ? 
        salaryData.reduce((sum, s) => sum + s.attendanceRate, 0) / salaryData.length : 0
    };

    res.json({
      success: true,
      period,
      dateRange: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      },
      summary,
      salaries: salaryData
    });

  } catch (error) {
    console.error('Error calculating salaries:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating salaries',
      error: error.message
    });
  }
};

export { calculateAllSalaries };

