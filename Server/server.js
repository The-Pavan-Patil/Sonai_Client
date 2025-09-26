import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import labourRoutes from "./routes/labour.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import payrollRoutes from "./routes/payroll.routes.js";

// Load env variables
dotenv.config();

// Connecting DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // replaces bodyParser.json()
app.use(express.urlencoded({ extended: true }));


app.use("/api/portfolio", portfolioRoutes);
app.use("/api/labours", labourRoutes);
app.use("/api/attendances", attendanceRoutes);
app.use("/api/attendance", attendanceRoutes); 
app.use("/api/payroll", payrollRoutes);


// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});


// Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
