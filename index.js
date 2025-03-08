import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"; // Import database connection
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";


dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS

app.get("/", (req, res) => {
  res.send("API is running...");
});

//api's
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/dashboard", dashboardRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
