import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import Doctor from "../models/Doctor.js";
import protect from "../middlewares/authMiddleware.js";
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";

const router = express.Router();

// Create Doctor (Only Hospital Can Do This)
router.post("/create", protect, async (req, res) => {
  const { name, email, password, specialization } = req.body;

  try {
    // Check if user is a hospital
    if (req.user.role !== "hospital") {
      return res.status(403).json({ message: "Only hospitals can create doctor accounts." });
    }

    // Check if doctor already exists
    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) return res.status(400).json({ message: "Doctor already exists" });

    // Hash password & Create doctor
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = await Doctor.create({
      hospitalId: req.user._id, // Ensure correct ID
      name,
      email,
      password: hashedPassword,
      specialization,
    });

    res.status(201).json({ message: "Doctor account created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Doctor Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const doctor = await Doctor.findOne({ email });
      if (!doctor) return res.status(400).json({ message: "Doctor not found" });
  
      const isMatch = await bcrypt.compare(password, doctor.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign(
        { id: doctor._id, role: "doctor" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      res.json({ token, doctor: { id: doctor._id, name: doctor.name, specialization: doctor.specialization } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // View Doctor's Appointments
router.get("/appointments", protect, async (req, res) => {
    try {
      if (req.user.role !== "doctor") {
        return res.status(403).json({ message: "Access denied! Only doctors can view appointments." });
      }
  
      const appointments = await Appointment.find({ doctorId: req.user.id }).populate("patientId", "name email");
  
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create Prescription
router.post("/create-prescription", protect, async (req, res) => {
    const { appointmentId, medicines } = req.body;
  
    try {
      if (req.user.role !== "doctor") {
        return res.status(403).json({ message: "Only doctors can create prescriptions." });
      }
  
      const prescription = await Prescription.create({
        appointmentId,
        doctorId: req.user._id,
        patientId: req.body.patientId, // Frontend should send patientId
        medicines,
      });
  
      res.status(201).json({ message: "Prescription created successfully", prescription });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;
