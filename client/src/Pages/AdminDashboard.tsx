// components/AdminDashboard.tsx
import { useEffect, useState } from "react";
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  Plus,
  Search,
  Filter,
  UserPlus,
  FileText,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  X,
  MapPin,
  Calculator
} from "lucide-react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Attendance {
  _id: string;
  labourId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  totalHours: number;
  overtime: number;
  status: string;
  notes?: string;
}
interface Labour {
  labourId: string;
  name: string;
  phone: string;
  address?: string;
  category: "helper" | "welder" | "fitter" | "supervisor" | "site-engineer";
  hourlyRate: number;
  joinDate: string;
  isActive: boolean;
  site?: {
    siteId: string;
    name: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
  };
}

interface PayrollData {
  labourId: string;
  name: string;
  category: string;
  phone: string;
  hourlyRate: number;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  workingDays: number;
  presentDays: number;
  attendanceRate: number;
  baseSalary: number;
  overtimePay: number;
  totalSalary: number;
  period: string;
  startDate: string;
  endDate: string;
  attendanceRecords?: Array<{
    date: string;
    checkIn: string;
    checkOut?: string;
    hours: number;
    overtime: number;
    status: string;
  }>;
}

interface EditingLabour {
  labourId: string;
  name: string;
  phone: string;
  category: "helper" | "welder" | "fitter" | "supervisor" | "site-engineer";
  hourlyRate: number;
  joinDate: string;
  isActive: boolean;
  site: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [labours, setLabours] = useState<Labour[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [selectedLabour, setSelectedLabour] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showAddLabour, setShowAddLabour] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [payrollData, setPayrollData] = useState<PayrollData[]>([]);
  const [payrollLoading, setPayrollLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedLabourForView, setSelectedLabourForView] =
    useState<Labour | null>(null);
  const [editingLabour, setEditingLabour] = useState<EditingLabour | null>(null);
  const [payrollForm, setPayrollForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    period: "monthly",
    overtimeRate: 1.5,
  });
  const [showAddSite, setShowAddSite] = useState(false);
  const [showViewSite, setShowViewSite] = useState(false);
  const [showEditSite, setShowEditSite] = useState(false);
  const [selectedSiteForView, setSelectedSiteForView] = useState<{
    siteId: string;
    name: string;
    address: string;
    location: string;
    isActive: boolean;
  } | null>(null);
  const [editingSite, setEditingSite] = useState<{
    siteId: string;
    name: string;
    location: string;
    address: string;
  } | null>(null);
  const [siteSearchTerm, setSiteSearchTerm] = useState<string>("");

  // Search and filter function
  const filteredLabours = labours.filter((labour) => {
    const matchesSearch =
      labour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      labour.labourId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      labour.phone.includes(searchTerm);

    const matchesCategory =
      categoryFilter === "all" || labour.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });
  // Add new site form state
  const [newSite, setNewSite] = useState({
    name: "",
    location: "",
    address: "",
  });
  // Site management functions
  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/sites", newSite);
      setShowAddSite(false);
      setNewSite({
        name: "",
        location: "",
        address: "",
      });
      fetchSites();
      alert("Site created successfully!");
    } catch (error) {
      console.error("Error adding site:", error);
      alert("Error creating site. Please try again.");
    }
  };
  const handleViewSite = (site: { siteId: string; name: string; address: string; location: string; isActive: boolean }) => {
    setSelectedSiteForView(site);
    setShowViewSite(true);
  };

  const handleEditSite = (site: {
    siteId: string;
    name: string;
    location: string;
    address: string;
    isActive: boolean;
  }) => {
    setEditingSite({ ...site });
    setShowEditSite(true);
  };

  const handleUpdateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSite) return;

    try {
      await axios.put(
        `http://localhost:5001/api/sites/${editingSite.siteId}`,
        editingSite
      );
      setShowEditSite(false);
      setEditingSite(null);
      await fetchSites();
      alert("Site updated successfully!");
    } catch (error) {
      console.error("Error updating site:", error);
      alert("Error updating site. Please try again.");
    }
  };

  const handleDeleteSite = async (site: { siteId: string; name: string; address: string; location: string; isActive: boolean }) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${site.name}? This action cannot be undone.`
      )
    ) {
      try {
        await axios.delete(`http://localhost:5001/api/sites/${site.siteId}`);
        await fetchSites();
        alert("Site deleted successfully!");
      } catch (error) {
        console.error("Error deleting site:", error);
        alert("Error deleting site. Please try again.");
      }
    }
  };

  // New state for sites
  const [sites, setSites] = useState<Array<{ siteId: string; name: string; address: string; location: string; isActive: boolean }>>([]);
  const [siteFilter, setSiteFilter] = useState<string>("");

  // Filter sites
  const filteredSites = sites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(siteSearchTerm.toLowerCase()) ||
      site.siteId.toLowerCase().includes(siteSearchTerm.toLowerCase()) ||
      (site.location &&
        site.location.toLowerCase().includes(siteSearchTerm.toLowerCase()));

    return matchesSearch;
  });

  // View labour function
  const handleViewLabour = (labour: Labour) => {
    setSelectedLabourForView(labour);
    setShowViewModal(true);
  };

  // Edit labour function
  const handleEditLabour = (labour: Labour) => {
    setEditingLabour({
      labourId: labour.labourId,
      name: labour.name,
      phone: labour.phone,
      category: labour.category,
      hourlyRate: labour.hourlyRate,
      joinDate: labour.joinDate,
      isActive: labour.isActive,
      site: labour.site?.siteId || "",
      address: labour.address,
      emergencyContact: labour.emergencyContact,
    });
    setShowEditModal(true);
  };

  // Update labour function
  const handleUpdateLabour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLabour) return;

    try {
      await axios.put(
        `http://localhost:5001/api/labours/${editingLabour.labourId}`,
        editingLabour
      );
      setShowEditModal(false);
      setEditingLabour(null);
      await fetchLabours();
      alert("Labour updated successfully!");
    } catch (error) {
      console.error("Error updating labour:", error);
      alert("Error updating labour. Please try again.");
    }
  };

  // Delete labour function
  const handleDeleteLabour = async (labour: Labour) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${labour.name}? This action cannot be undone.`
      )
    ) {
      try {
        await axios.delete(
          `http://localhost:5001/api/labours/${labour.labourId}`
        );
        await fetchLabours();
        alert("Labour deleted successfully!");
      } catch (error) {
        console.error("Error deleting labour:", error);
        alert("Error deleting labour. Please try again.");
      }
    }
  };

  // Add this function to calculate payroll
  const calculatePayroll = async () => {
    try {
      setPayrollLoading(true);
      const { month, year, period, overtimeRate } = payrollForm;

      const response = await axios.get(
        `http://localhost:5001/api/payroll/calculate-all`,
        {
          params: { month, year, period, overtimeRate },
        }
      );

      setPayrollData(response.data.salaries || []);
      console.log("Payroll calculated:", response.data);
    } catch (error) {
      console.error("Error calculating payroll:", error);
      alert("Error calculating payroll. Please try again.");
    } finally {
      setPayrollLoading(false);
    }
  };
  // Add this function to export to Excel
  const exportToExcel = () => {
    if (payrollData.length === 0) {
      alert("No payroll data to export. Please calculate payroll first.");
      return;
    }

    // Prepare data for Excel
    const excelData = payrollData.map((labour) => ({
      "Labour ID": labour.labourId,
      Name: labour.name,
      Category: labour.category,
      Phone: labour.phone,
      "Hourly Rate (₹)": labour.hourlyRate,
      "Working Days": labour.workingDays,
      "Present Days": labour.presentDays,
      "Attendance Rate (%)": labour.attendanceRate,
      "Total Hours": labour.totalHours,
      "Regular Hours": labour.regularHours,
      "Overtime Hours": labour.overtimeHours,
      "Base Salary (₹)": labour.baseSalary,
      "Overtime Pay (₹)": labour.overtimePay,
      "Total Salary (₹)": labour.totalSalary,
      Period: labour.period,
      "Start Date": labour.startDate,
      "End Date": labour.endDate,
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 12 }, // Labour ID
      { wch: 20 }, // Name
      { wch: 15 }, // Category
      { wch: 15 }, // Phone
      { wch: 15 }, // Hourly Rate
      { wch: 12 }, // Working Days
      { wch: 12 }, // Present Days
      { wch: 15 }, // Attendance Rate
      { wch: 12 }, // Total Hours
      { wch: 12 }, // Regular Hours
      { wch: 12 }, // Overtime Hours
      { wch: 15 }, // Base Salary
      { wch: 15 }, // Overtime Pay
      { wch: 15 }, // Total Salary
      { wch: 10 }, // Period
      { wch: 12 }, // Start Date
      { wch: 12 }, // End Date
    ];
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Payroll Report");

    // Generate Excel file and download
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `Payroll_Report_${payrollForm.period}_${payrollForm.month}-${payrollForm.year}.xlsx`;
    saveAs(data, fileName);
  };



  // New Labour Form State
  const [newLabour, setNewLabour] = useState({
    name: "",
    phone: "",
    category: "helper",
    hourlyRate: 0,
    address: "",
    emergencyContact: { name: "", phone: "" },
    site: "",
  });

  // Attendance Form State
  const [attendanceForm, setAttendanceForm] = useState({
    labourId: "",
    date: new Date().toISOString().split("T")[0],
    checkIn: "",
    checkOut: "",
    status: "present",
    notes: "",
  });

  useEffect(() => {
    fetchLabours();
    fetchSites();
  }, []);

  const fetchLabours = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5001/api/labours");
      setLabours(response.data.labours || []);
    } catch (error) {
      console.error("Error fetching labours:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSites = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/sites");
      setSites(response.data.sites || []);
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  const [monthFilter, setMonthFilter] = useState<string>("");

  const fetchAttendance = async (labourId: string, monthYear?: string) => {
    try {
      setAttendanceLoading(true);
      console.log(
        "Fetching attendance for:",
        labourId,
        "with month filter:",
        monthYear
      ); // Debug log

      let url = `http://localhost:5001/api/attendance/labour/${labourId}`;
      if (monthYear) {
        const [year, month] = monthYear.split("-");
        // Fix: pass year and month as query params, month as number
        url += `?year=${parseInt(year)}&month=${parseInt(month)}`;
      }

      // Add site filter if set
      if (siteFilter) {
        url += monthYear ? `&siteId=${siteFilter}` : `?siteId=${siteFilter}`;
      }

      const response = await axios.get(url);
      console.log("Attendance response:", response.data); // Debug log

      setAttendance(response.data.attendance || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setAttendance([]);
    } finally {
      setAttendanceLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLabour) {
      fetchAttendance(selectedLabour, monthFilter);
    } else {
      setAttendance([]);
    }
  }, [selectedLabour, siteFilter, monthFilter]);

  const handleAddLabour = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending data:", newLabour);
    try {
      const response = await axios.post(
        "http://localhost:5001/api/labours",
        newLabour
      );
      console.log("Response:", response.data);
      setShowAddLabour(false);
      setNewLabour({
        name: "",
        phone: "",
        category: "helper",
        hourlyRate: 0,
        address: "",
        emergencyContact: { name: "", phone: "" },
        site: "",
      });
      fetchLabours();
    } catch (error) {
      console.error("Error adding labour:", error);
    }
  };

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!attendanceForm.labourId) {
      alert("Please select a labour");
      return;
    }

    if (!attendanceForm.date) {
      alert("Please select a date");
      return;
    }

    if (!attendanceForm.checkIn) {
      alert("Please enter check-in time");
      return;
    }

    try {
      console.log("Sending attendance data:", attendanceForm);

      await axios.post("http://localhost:5001/api/attendance", attendanceForm);

      setShowAttendance(false);

      // Reset form
      setAttendanceForm({
        labourId: "",
        date: new Date().toISOString().split("T")[0],
        checkIn: "",
        checkOut: "",
        status: "present",
        notes: "",
      });

      // Refresh attendance if we're currently viewing this labour's records
      if (selectedLabour === attendanceForm.labourId) {
        fetchAttendance(selectedLabour);
      }

      alert("Attendance marked successfully!");
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage labour attendance, performance, and payroll
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowAddLabour(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Labour
            </button>
            <button
              onClick={() => setShowAttendance(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Clock className="w-4 h-4" />
              Mark Attendance
            </button>
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border mb-8">
        <div className="flex overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "sites", label: "Site Management", icon: MapPin },
            { id: "labours", label: "Labour Management", icon: Users },
            { id: "attendance", label: "Attendance", icon: Clock },
            { id: "payroll", label: "Payroll", icon: DollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Labours</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {labours.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Labours</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {labours.filter((l) => l.isActive).length}
                  </p>
                </div>
                <UserPlus className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Today's Attendance</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Monthly Payroll</p>
                  <p className="text-2xl font-bold text-gray-900">₹0</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Site Management Tab */}
      {activeTab === "sites" && (
        <div className="space-y-6">
          {/* Site Management Header */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Site Management
                </h2>
                <p className="text-gray-600">
                  Manage all project sites and track labour assignments
                </p>
              </div>
              <button
                onClick={() => setShowAddSite(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New Site
              </button>
            </div>
          </div>

          {/* Site Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Total Sites
                  </p>
                  <p className="text-3xl font-bold">{sites.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Active Sites
                  </p>
                  <p className="text-3xl font-bold">
                    {sites.filter((s) => s.isActive).length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Total Labour
                  </p>
                  <p className="text-3xl font-bold">{labours.length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Avg Labour/Site
                  </p>
                  <p className="text-3xl font-bold">
                    {sites.length > 0
                      ? Math.round(labours.length / sites.length)
                      : 0}
                  </p>
                </div>
                <Calculator className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>

          {/* Site Management Table */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search sites by name, ID, or location..."
                      value={siteSearchTerm}
                      onChange={(e) => setSiteSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="flex items-center px-3 py-2 bg-gray-100 rounded-lg">
                  <span className="text-sm text-gray-600">
                    {filteredSites.length} of {sites.length} sites
                  </span>
                </div>
              </div>

              {/* Clear Filters */}
              {siteSearchTerm && (
                <div className="mb-4">
                  <button
                    onClick={() => setSiteSearchTerm("")}
                    className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear Search
                  </button>
                </div>
              )}

              {/* Sites Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Site ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Site Name
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Location
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Labour Count
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Categories
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSites.length > 0 ? (
                      filteredSites.map((site) => {
                        const siteLabours = labours.filter(
                          (l) => l.site?.siteId === site.siteId
                        );
                        const categories = [
                          ...new Set(siteLabours.map((l) => l.category)),
                        ];

                        return (
                          <tr
                            key={site.siteId}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 font-medium text-green-600">
                              {site.siteId}
                            </td>
                            <td className="py-3 px-4 font-semibold">
                              {site.name}
                            </td>
                            <td className="py-3 px-4">
                              {site.location || "N/A"}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                  {siteLabours.length} workers
                                </span>
                                {siteLabours.length > 0 && (
                                  <span className="text-green-600 text-xs">
                                    (
                                    {
                                      siteLabours.filter((l) => l.isActive)
                                        .length
                                    }{" "}
                                    active)
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {categories.slice(0, 2).map((category) => (
                                  <span
                                    key={category}
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      category === "supervisor"
                                        ? "bg-purple-100 text-purple-800"
                                        : category === "site-engineer"
                                        ? "bg-green-100 text-green-800"
                                        : category === "welder"
                                        ? "bg-orange-100 text-orange-800"
                                        : category === "fitter"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {category}
                                  </span>
                                ))}
                                {categories.length > 2 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                    +{categories.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  site.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {site.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleViewSite(site)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                  title="View Site Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEditSite(site)}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                  title="Edit Site"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSite(site)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                  title="Delete Site"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-12 text-center">
                          <div className="flex flex-col items-center">
                            <MapPin className="w-12 h-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {siteSearchTerm
                                ? "No matching sites found"
                                : "No sites found"}
                            </h3>
                            <p className="text-gray-600">
                              {siteSearchTerm
                                ? "Try adjusting your search criteria."
                                : "Add your first site to get started."}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "labours" && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6">
            {/* Enhanced Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, ID, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="helper">Helper</option>
                <option value="welder">Welder</option>
                <option value="fitter">Fitter</option>
                <option value="supervisor">Supervisor</option>
                <option value="site-engineer">Site Engineer</option>
              </select>

              {/* Search Results Counter */}
              <div className="flex items-center px-3 py-2 bg-gray-100 rounded-lg">
                <span className="text-sm text-gray-600">
                  {filteredLabours.length} of {labours.length} labours
                </span>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || categoryFilter !== "all") && (
              <div className="mb-4">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            )}

            {/* Enhanced Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Labour ID
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Site
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Phone
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Hourly Rate
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLabours.length > 0 ? (
                    filteredLabours.map((labour) => (
                      <tr
                        key={labour.labourId}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium text-blue-600">
                          {labour.labourId}
                        </td>
                        <td className="py-3 px-4">{labour.name}</td>
                        <td className="py-3 px-4">
                          {labour.site ? labour.site.name : "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              labour.category === "supervisor"
                                ? "bg-purple-100 text-purple-800"
                                : labour.category === "site-engineer"
                                ? "bg-green-100 text-green-800"
                                : labour.category === "welder"
                                ? "bg-orange-100 text-orange-800"
                                : labour.category === "fitter"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {labour.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">{labour.phone}</td>
                        <td className="py-3 px-4">₹{labour.hourlyRate}/hr</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              labour.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {labour.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewLabour(labour)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditLabour(labour)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              title="Edit Labour"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLabour(labour)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete Labour"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <div className="flex flex-col items-center">
                          <Users className="w-12 h-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm || categoryFilter !== "all"
                              ? "No matching labours found"
                              : "No labours found"}
                          </h3>
                          <p className="text-gray-600">
                            {searchTerm || categoryFilter !== "all"
                              ? "Try adjusting your search or filter criteria."
                              : "Add your first labour to get started."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Add Labour Modal */}
      {showAddLabour && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Labour
              </h3>

              <form onSubmit={handleAddLabour} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newLabour.name}
                    onChange={(e) =>
                      setNewLabour({ ...newLabour, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={newLabour.phone}
                    onChange={(e) =>
                      setNewLabour({ ...newLabour, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newLabour.category}
                    onChange={(e) =>
                      setNewLabour({ ...newLabour, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="helper">Helper</option>
                    <option value="welder">Welder</option>
                    <option value="fitter">Fitter</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="site-engineer">Site Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site
                  </label>
                  <select
                    required
                    value={newLabour.site}
                    onChange={(e) =>
                      setNewLabour({ ...newLabour, site: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                  <option value="">Select Site</option>
                  {sites.map((site) => (
                    <option key={site.siteId} value={site.siteId}>
                      {site.siteId} - {site.name}
                    </option>
                  ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Rate (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newLabour.hourlyRate}
                    onChange={(e) =>
                      setNewLabour({
                        ...newLabour,
                        hourlyRate: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddLabour(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Labour
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Mark Attendance Modal */}
      {showAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mark Attendance
              </h3>

              <form onSubmit={handleMarkAttendance} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Labour
                  </label>
                  <select
                    required
                    value={attendanceForm.labourId}
                    onChange={(e) =>
                      setAttendanceForm({
                        ...attendanceForm,
                        labourId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Labour</option>
                    {labours
                      .filter((l) => l.isActive)
                      .map((labour) => (
                        <option key={labour.labourId} value={labour.labourId}>
                          {labour.labourId} - {labour.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={attendanceForm.date}
                    onChange={(e) =>
                      setAttendanceForm({
                        ...attendanceForm,
                        date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check In
                    </label>
                    <input
                      type="time"
                      required
                      value={attendanceForm.checkIn}
                      onChange={(e) =>
                        setAttendanceForm({
                          ...attendanceForm,
                          checkIn: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check Out
                    </label>
                    <input
                      type="time"
                      value={attendanceForm.checkOut}
                      onChange={(e) =>
                        setAttendanceForm({
                          ...attendanceForm,
                          checkOut: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={attendanceForm.status}
                    onChange={(e) =>
                      setAttendanceForm({
                        ...attendanceForm,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="half-day">Half Day</option>
                    <option value="overtime">Overtime</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAttendance(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark Attendance
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Attendance Tab */}
      {activeTab === "attendance" && (
        <div className="space-y-6">
          {/* Attendance Filters */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Labour
                </label>
              <select
                value={selectedLabour}
                onChange={(e) => setSelectedLabour(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Labour to View Attendance</option>
                {labours
                  .filter((l) => l.isActive)
                  .filter((l) => (siteFilter ? l.site?.siteId === siteFilter : true))
                  .map((labour) => (
                    <option key={labour.labourId} value={labour.labourId}>
                      {labour.labourId} - {labour.name}
                    </option>
                  ))}
              </select>
              </div>

              <div className="lg:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Filter
                </label>
                <select
                  value={siteFilter}
                  onChange={(e) => {
                    setSiteFilter(e.target.value);
                    setSelectedLabour(""); // Reset selected labour when site changes
                    setAttendance([]); // Clear attendance on site change
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Sites</option>
                  {sites.map((site) => (
                    <option key={site.siteId} value={site.siteId}>
                      {site.siteId} - {site.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month Filter
                </label>
                <select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Time</option>
                  <option value="2024-09">September 2024</option>
                  <option value="2024-10">October 2024</option>
                  <option value="2024-11">November 2024</option>
                </select>
              </div>

              <div className="lg:w-32 flex items-end">
                <button
                  onClick={() =>
                    selectedLabour &&
                    fetchAttendance(selectedLabour, monthFilter)
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Attendance Records */}
          {selectedLabour ? (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Attendance Records -{" "}
                    {labours.find((l) => l.labourId === selectedLabour)?.name}
                  </h3>
                  <span className="text-sm text-gray-600">
                    Total Records: {attendance.length}
                  </span>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Loading attendance...</p>
                  </div>
                ) : attendance.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Date
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Check In
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Check Out
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Total Hours
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Overtime
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Notes
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.map((record) => (
                          <tr
                            key={record._id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 font-medium">
                              {new Date(record.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">{record.checkIn}</td>
                            <td className="py-3 px-4">
                              {record.checkOut || "-"}
                            </td>
                            <td className="py-3 px-4">
                              {record.totalHours.toFixed(2)}h
                            </td>
                            <td className="py-3 px-4">
                              {record.overtime > 0
                                ? `${record.overtime.toFixed(2)}h`
                                : "-"}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  record.status === "present"
                                    ? "bg-green-100 text-green-800"
                                    : record.status === "absent"
                                    ? "bg-red-100 text-red-800"
                                    : record.status === "half-day"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {record.status.charAt(0).toUpperCase() +
                                  record.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 max-w-32 truncate">
                              {record.notes || "-"}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Attendance Records
                    </h3>
                    <p className="text-gray-600">
                      No attendance records found for this labour.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a Labour
              </h3>
              <p className="text-gray-600">
                Choose a labour from the dropdown above to view their attendance
                records.
              </p>
            </div>
          )}
        </div>
      )}
      {/* Payroll Tab */}
      {activeTab === "payroll" && (
        <div className="space-y-6">
          {/* Simple Payroll Generator */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Generate Payroll Report
              </h2>
              <p className="text-gray-600">
                Calculate salaries for all labours with just a few clicks
              </p>
            </div>

            {/* Simple Form */}
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Month Selection */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Month & Year
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={payrollForm.month}
                      onChange={(e) =>
                        setPayrollForm({
                          ...payrollForm,
                          month: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i + 1}>
                          {new Date(2024, i).toLocaleString("default", {
                            month: "long",
                          })}
                        </option>
                      ))}
                    </select>

                    <select
                      value={payrollForm.year}
                      onChange={(e) =>
                        setPayrollForm({
                          ...payrollForm,
                          year: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value={2024}>2024</option>
                      <option value={2025}>2025</option>
                    </select>
                  </div>
                </div>

                {/* Overtime Rate */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Overtime Rate Multiplier
                  </label>
                  <div className="flex items-center space-x-4">
                    {[1.5, 2.0, 2.5].map((rate) => (
                      <label key={rate} className="flex items-center">
                        <input
                          type="radio"
                          name="overtimeRate"
                          value={rate}
                          checked={payrollForm.overtimeRate === rate}
                          onChange={(e) =>
                            setPayrollForm({
                              ...payrollForm,
                              overtimeRate: parseFloat(e.target.value),
                            })
                          }
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700 font-medium">
                          {rate}x
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Standard overtime is 1.5x regular hourly rate
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={calculatePayroll}
                  disabled={payrollLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3"
                >
                  {payrollLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Calculating Payroll...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-5 h-5" />
                      Calculate All Salaries
                    </>
                  )}
                </button>

                {payrollData.length > 0 && (
                  <button
                    onClick={exportToExcel}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <FileText className="w-5 h-5" />
                    Download Excel Report
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Summary Cards */}
          {payrollData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">
                      Total Labours
                    </p>
                    <p className="text-3xl font-bold">{payrollData.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">
                      Total Payout
                    </p>
                    <p className="text-3xl font-bold">
                      ₹
                      {(
                        payrollData.reduce((sum, s) => sum + s.totalSalary, 0) /
                        100000
                      ).toFixed(1)}
                      L
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">
                      Total Hours
                    </p>
                    <p className="text-3xl font-bold">
                      {Math.round(
                        payrollData.reduce((sum, s) => sum + s.totalHours, 0)
                      )}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">
                      Overtime Hours
                    </p>
                    <p className="text-3xl font-bold">
                      {Math.round(
                        payrollData.reduce((sum, s) => sum + s.overtimeHours, 0)
                      )}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-200" />
                </div>
              </div>
            </div>
          )}

          {/* Simple Results Table */}
          {payrollData.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Payroll for{" "}
                    {new Date(
                      payrollForm.year,
                      payrollForm.month - 1
                    ).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {payrollData.length} Labours
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b-2 border-gray-200">
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">
                          Labour Details
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">
                          Work Summary
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">
                          Salary Breakdown
                        </th>
                        <th className="text-right py-4 px-6 font-semibold text-gray-900">
                          Total Salary
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrollData.map((labour) => (
                        <tr
                          key={labour.labourId}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {labour.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {labour.labourId}
                              </p>
                              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
                                {labour.category}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <div className="text-sm space-y-1">
                              <p>
                                <span className="font-medium">Days:</span>{" "}
                                {labour.presentDays}/{labour.workingDays}
                              </p>
                              <p>
                                <span className="font-medium">Hours:</span>{" "}
                                {labour.totalHours.toFixed(1)}h
                              </p>
                              <p>
                                <span className="font-medium">OT:</span>{" "}
                                {labour.overtimeHours.toFixed(1)}h
                              </p>
                              <p>
                                <span className="font-medium">Rate:</span> ₹
                                {labour.hourlyRate}/h
                              </p>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <div className="text-sm space-y-1">
                              <p>
                                <span className="font-medium">Base:</span> ₹
                                {labour.baseSalary.toLocaleString()}
                              </p>
                              <p>
                                <span className="font-medium">Overtime:</span> ₹
                                {labour.overtimePay.toLocaleString()}
                              </p>
                              <div className="pt-1 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                  Attendance: {labour.attendanceRate.toFixed(1)}
                                  %
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <p className="text-2xl font-bold text-green-600">
                              ₹{labour.totalSalary.toLocaleString()}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            !payrollLoading && (
              /* Empty State */
              <div className="bg-white rounded-xl shadow-sm border p-16 text-center">
                <div className="max-w-md mx-auto">
                  <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Ready to Calculate Payroll
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Select the month and year above, then click "Calculate All
                    Salaries" to generate payroll for all your labours
                    automatically.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>What we calculate:</strong>
                      <br />
                      • Regular hours + overtime hours
                      <br />
                      • Base salary + overtime pay
                      <br />
                      • Attendance rates
                      <br />• Excel export ready
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
      {showEditModal && editingLabour && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Labour
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateLabour} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Labour ID
                  </label>
                  <input
                    type="text"
                    value={editingLabour.labourId}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingLabour.name}
                    onChange={(e) =>
                      setEditingLabour({
                        ...editingLabour,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={editingLabour.phone}
                    onChange={(e) =>
                      setEditingLabour({
                        ...editingLabour,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editingLabour.category}
                    onChange={(e) =>
                      setEditingLabour({
                        ...editingLabour,
                        category: e.target.value as Labour["category"],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="helper">Helper</option>
                    <option value="welder">Welder</option>
                    <option value="fitter">Fitter</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="site-engineer">Site Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site
                  </label>
                  <select
                    required
                    value={editingLabour.site}
                    onChange={(e) =>
                      setEditingLabour({
                        ...editingLabour,
                        site: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Site</option>
                    {sites.map((site) => (
                      <option key={site.siteId} value={site.siteId}>
                        {site.siteId} - {site.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Rate (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingLabour.hourlyRate}
                    onChange={(e) =>
                      setEditingLabour({
                        ...editingLabour,
                        hourlyRate: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingLabour.isActive ? "active" : "inactive"}
                    onChange={(e) =>
                      setEditingLabour({
                        ...editingLabour,
                        isActive: e.target.value === "active",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Labour
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Add Site Modal */}
      {showAddSite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Add New Site
                </h3>
                <button
                  onClick={() => setShowAddSite(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newSite.name}
                    onChange={(e) =>
                      setNewSite({ ...newSite, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Phoenix Mall Phase 2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={newSite.location}
                    onChange={(e) =>
                      setNewSite({ ...newSite, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Mumbai, Maharashtra"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    required
                    value={newSite.address}
                    onChange={(e) =>
                      setNewSite({ ...newSite, address: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Complete site address..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddSite(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Create Site
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Site Modal */}
      {showViewSite && selectedSiteForView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Site Details
                </h3>
                <button
                  onClick={() => setShowViewSite(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Site Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Site ID
                    </label>
                    <p className="text-lg font-semibold text-green-600">
                      {selectedSiteForView.siteId}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Site Name
                    </label>
                    <p className="text-lg text-gray-900">
                      {selectedSiteForView.name}
                    </p>
                  </div>
                </div>

                {/* Labour Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Labour Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {labours.filter(
                      (l) => l.site?.siteId === selectedSiteForView.siteId
                    ).length > 0 ? (
                      <>
                        <div className="text-center p-3 bg-white rounded">
                          <p className="text-2xl font-bold text-blue-600">
                            {
                              labours.filter(
                                (l) =>
                                  l.site?.siteId === selectedSiteForView.siteId
                              ).length
                            }
                          </p>
                          <p className="text-sm text-gray-600">Total Workers</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded">
                          <p className="text-2xl font-bold text-green-600">
                            {
                              labours.filter(
                                (l) =>
                                  l.site?.siteId ===
                                    selectedSiteForView.siteId && l.isActive
                              ).length
                            }
                          </p>
                          <p className="text-sm text-gray-600">
                            Active Workers
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="col-span-2 text-center py-4">
                        <p className="text-gray-500">
                          No labours assigned to this site
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowViewSite(false);
                      const fullSite = sites.find(
                        (s) => s.siteId === selectedSiteForView.siteId
                      );
                      if (fullSite) handleEditSite(fullSite);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Edit Site
                  </button>
                  <button
                    onClick={() => setShowViewSite(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Site Modal */}
      {showEditSite && editingSite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Site
                </h3>
                <button
                  onClick={() => setShowEditSite(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateSite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site ID
                  </label>
                  <input
                    type="text"
                    value={editingSite.siteId}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSite.name}
                    onChange={(e) =>
                      setEditingSite({ ...editingSite, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSite.location}
                    onChange={(e) =>
                      setEditingSite({
                        ...editingSite,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    required
                    value={editingSite.address}
                    onChange={(e) =>
                      setEditingSite({
                        ...editingSite,
                        address: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditSite(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Update Site
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
