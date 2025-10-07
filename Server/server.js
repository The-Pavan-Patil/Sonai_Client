import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import labourRoutes from "./routes/labour.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import payrollRoutes from "./routes/payroll.routes.js";
import siteRoutes from "./routes/site.routes.js";
import authRoutes from "./routes/auth.routes.js";      
import authenticateToken from "./middlewares/auth.middleware.js";



dotenv.config();



connectDB();

const app = express();



app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json()); 

app.use(express.urlencoded({ extended: true }));



app.use("/api/auth", authRoutes);


app.use("/api/portfolio", portfolioRoutes);
app.use("/api/labour", authenticateToken, labourRoutes);
app.use("/api/attendance", authenticateToken, attendanceRoutes);
app.use("/api/payroll", authenticateToken, payrollRoutes);
app.use("/api/sites", authenticateToken, siteRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});


// Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
