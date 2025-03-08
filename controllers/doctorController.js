import asyncHandler from 'express-async-handler';
//import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Hospital from "../models/hospitalModel.js";
import Doctor from "../models/doctorModel.js";
import bcrypt from "bcryptjs";

// @desc    Create a doctor
// @route   POST /api/doctors
// @access  Private (Hospital Admin)
export const createDoctor = asyncHandler(async (req, res) => {
    const { name, specialization, experience, email, phone, hospitalId } = req.body;

    // Create doctor credentials in User model
    const doctorUser = await User.create({
        name,
        email,
        password: 'doctor123', // Default password (should be changed later)
        role: 'doctor',
    });

    // Create doctor record
    const doctor = new Doctor({
        name,
        specialization,
        experience,
        hospital: hospitalId,
        email,
        phone,
        credentials: doctorUser._id,
    });

    const createdDoctor = await doctor.save();
    res.status(201).json(createdDoctor);
});

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find().populate('hospital', 'name location');
    res.json(doctors);
});
