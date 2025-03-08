import express from "express";
import protect from "../middlewares/authMiddleware.js";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";

const router = express.Router();

// Admin Dashboard (Total Stats)
router.get("/admin", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied! Only admins can view this dashboard." });
    }

    const totalHospitals = await User.countDocuments({ role: "hospital" });
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await User.countDocuments({ role: "patient" });

    res.json({ totalHospitals, totalDoctors, totalPatients });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User Dashboard (Doctor & Patient)
router.get("/user", protect, async (req, res) => {
  try {
    if (req.user.role === "doctor") {
      const appointments = await Appointment.find({ doctorId: req.user._id }).countDocuments();
      return res.json({ role: "doctor", totalAppointments: appointments });
    }

    if (req.user.role === "patient") {
      const appointments = await Appointment.find({ patientId: req.user._id }).countDocuments();
      return res.json({ role: "patient", totalAppointments: appointments });
    }

    res.status(403).json({ message: "Invalid user role" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
