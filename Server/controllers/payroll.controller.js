// controllers/payroll.controller.js - Updated with advance deduction
import Labour from '../models/Labour.js';
import Attendance from '../models/Attendance.js';
import AdvancePayment from '../models/advancePayment.js';

const calculateAllSalaries = async (req, res) => {
  try {
    const { month, year, period, overtimeRate } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Month and year are required'
      });
    }

    // Get all active labours
    const labours = await Labour.find({ isActive: true });
    
    if (labours.length === 0) {
      return res.json({
        success: true,
        message: 'No active labours found',
        salaries: []
      });
    }

    // Calculate date range
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    // Get pending advances for this payroll period
    const pendingAdvances = await AdvancePayment.find({
      dateGiven: { $lte: endDate },
      status: 'pending',
      isActive: true
    });

    // Group advances by labourId
    const advancesByLabour = pendingAdvances.reduce((acc, advance) => {
      if (!acc[advance.labourId]) {
        acc[advance.labourId] = {
          totalAmount: 0,
          advances: []
        };
      }
      acc[advance.labourId].totalAmount += advance.amount;
      acc[advance.labourId].advances.push(advance);
      return acc;
    }, {});

    const salaryPromises = labours.map(async (labour) => {
      try {
        // Get attendance records for the labour in the specified month
        const attendance = await Attendance.find({
          labourId: labour.labourId,
          date: { $gte: startDate, $lte: endDate }
        });

        // Calculate working days in the month
        const workingDays = endDate.getDate();
        const presentDays = attendance.filter(att => 
          att.status === 'present' || att.status === 'overtime'
        ).length;

        // Calculate total hours and overtime
        const totalHours = attendance.reduce((sum, att) => sum + (att.totalHours || 0), 0);
        const totalOvertime = attendance.reduce((sum, att) => sum + (att.overtime || 0), 0);
        const regularHours = Math.max(0, totalHours - totalOvertime);

        // Calculate attendance rate
        const attendanceRate = workingDays > 0 ? (presentDays / workingDays) * 100 : 0;

        // Calculate salary components
        const baseSalary = regularHours * labour.hourlyRate;
        const overtimePay = totalOvertime * labour.hourlyRate * parseFloat(overtimeRate || 1.5);
        const grossSalary = baseSalary + overtimePay;

        // Get advance amount for this labour
        const labourAdvances = advancesByLabour[labour.labourId] || { totalAmount: 0, advances: [] };
        const totalAdvanceAmount = labourAdvances.totalAmount;

        // Calculate net salary after advance deduction
        const netSalary = Math.max(0, grossSalary - totalAdvanceAmount);

        return {
          labourId: labour.labourId,
          name: labour.name,
          category: labour.category,
          phone: labour.phone,
          hourlyRate: labour.hourlyRate,
          siteId: labour.assignedSite,
          totalHours: Math.round(totalHours * 100) / 100,
          regularHours: Math.round(regularHours * 100) / 100,
          overtimeHours: Math.round(totalOvertime * 100) / 100,
          workingDays,
          presentDays,
          attendanceRate: Math.round(attendanceRate * 100) / 100,
          baseSalary: Math.round(baseSalary),
          overtimePay: Math.round(overtimePay),
          grossSalary: Math.round(grossSalary), // NEW: Gross salary before deductions
          totalAdvanceAmount: Math.round(totalAdvanceAmount), // NEW: Total advances
          netSalary: Math.round(netSalary), // NEW: Net salary after advances
          totalSalary: Math.round(netSalary), // Keep for backward compatibility
          period: period || 'monthly',
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          advances: labourAdvances.advances.map(adv => ({
            advanceId: adv.advanceId,
            amount: adv.amount,
            reason: adv.reason,
            dateGiven: adv.dateGiven,
            description: adv.description
          }))
        };
      } catch (error) {
        console.error(`Error calculating salary for ${labour.labourId}:`, error);
        return null;
      }
    });

    const salaries = (await Promise.all(salaryPromises)).filter(salary => salary !== null);

    // Mark advances as deducted
    const allAdvanceIds = Object.values(advancesByLabour)
      .flatMap(labourAdv => labourAdv.advances.map(adv => adv._id));

    if (allAdvanceIds.length > 0) {
      await AdvancePayment.updateMany(
        { _id: { $in: allAdvanceIds } },
        { 
          status: 'deducted',
          'deductedInPayroll.month': parseInt(month),
          'deductedInPayroll.year': parseInt(year),
          'deductedInPayroll.deductedDate': new Date()
        }
      );
    }

    res.json({
      success: true,
      message: `Payroll calculated for ${salaries.length} labours`,
      salaries,
      summary: {
        totalLabours: salaries.length,
        totalGrossSalary: salaries.reduce((sum, s) => sum + s.grossSalary, 0),
        totalAdvances: salaries.reduce((sum, s) => sum + s.totalAdvanceAmount, 0),
        totalNetSalary: salaries.reduce((sum, s) => sum + s.netSalary, 0)
      }
    });

  } catch (error) {
    console.error('Error calculating payroll:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating payroll',
      error: error.message
    });
  }
};

export { calculateAllSalaries };
