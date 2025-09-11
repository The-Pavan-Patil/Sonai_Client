import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import portfolioRoutes from "./routes/portfolio.routes.js";

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

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
