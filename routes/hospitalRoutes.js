import express from "express";
import protect from "../middlewares/authMiddleware.js";
import Doctor from "../models/Doctor.js";
import Hospital from "../models/Hospital.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();



/** 
 * @route   POST /api/hospital/create
 * @desc    Create a new hospital
 * @access  Private (Only hospital admins)
 */
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name, location, contact } = req.body;

    if (!name || !location || !contact) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const newHospital = new Hospital({
      name,
      location,
      contact,
      admin: req.user._id, // Assign the logged-in user as the admin
    });

    await newHospital.save();

    res.status(201).json(newHospital);
  } catch (error) {
    console.error("Error creating hospital:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/** 
 * @route   POST /api/hospital/add-doctor
 * @desc    Add a doctor to a hospital
 * @access  Private (Only hospital admins)
 */

router.post("/create-doctor", authMiddleware, async (req, res) => {
  try {
    const { name, email, password, specialty, hospitalId } = req.body;

    // Ensure all fields are provided
    if (!name || !email || !password || !specialty || !hospitalId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new doctor
    const newDoctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      specialty,
      hospitalId,
    });

    await newDoctor.save();

    res.status(201).json({ message: "Doctor created successfully!" });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/** 
 * @route   GET /api/hospital/doctors
 * @desc    Get all doctors in a hospital
 * @access  Private (Only hospital admins)
 */
router.get("/doctors", authMiddleware, async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ admin: req.user._id }).populate("doctors");
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.json(hospital.doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Search for hospitals & doctors
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Search query is required" });

    const hospitals = await Hospital.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
      ],
    }).populate("doctors");

    res.json(hospitals);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Get All Doctors Created by Hospital
router.get("/doctors", protect, async (req, res) => {
  try {
    if (req.user.role !== "hospital") {
      return res.status(403).json({ message: "Only hospital admins can view doctors." });
    }

    const doctors = await Doctor.find({ hospitalId: req.user._id }).select("-password");

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a Doctor
router.delete("/delete-doctor/:doctorId", protect, async (req, res) => {
  try {
    if (req.user.role !== "hospital") {
      return res.status(403).json({ message: "Only hospital admins can delete doctors." });
    }

    await Doctor.findOneAndDelete({ _id: req.params.doctorId, hospitalId: req.user._id });

    res.json({ message: "Doctor removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
