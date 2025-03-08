import express from "express";
import protect from "../middlewares/authMiddleware.js";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";

const router = express.Router();

// Search Hospitals
router.get("/search/hospitals", async (req, res) => {
  try {
    const hospitals = await User.find({ role: "hospital" }).select("-password");
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search Doctors by Specialization
router.get("/search/doctors", async (req, res) => {
  const { specialization } = req.query;
  try {
    const query = specialization ? { specialization: new RegExp(specialization, "i") } : {};
    const doctors = await Doctor.find(query).populate("hospitalId", "name email");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Book an Appointment
router.post("/book-appointment", protect, async (req, res) => {
    const { doctorId, date } = req.body;
  
    try {
      if (req.user.role !== "patient") {
        return res.status(403).json({ message: "Only patients can book appointments." });
      }
  
      const appointment = await Appointment.create({
        doctorId,
        patientId: req.user._id,
        date,
      });
  
      res.status(201).json({ message: "Appointment booked successfully", appointment });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // View Prescriptions
router.get("/prescriptions", protect, async (req, res) => {
    try {
      if (req.user.role !== "patient") {
        return res.status(403).json({ message: "Only patients can view prescriptions." });
      }
  
      const prescriptions = await Prescription.find({ patientId: req.user._id })
        .populate("doctorId", "name specialization")
        .populate("appointmentId", "date");
  
      res.json(prescriptions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;
