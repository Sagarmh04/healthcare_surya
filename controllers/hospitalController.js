import asyncHandler from 'express-async-handler';
import Hospital from '../models/Hospital.js';

// @desc    Create a hospital
// @route   POST /api/hospitals
// @access  Private (Hospital Admin)
export const createHospital = asyncHandler(async (req, res) => {
    const { name, location, contact } = req.body;

    const hospital = new Hospital({
        name,
        location,
        contact,
        admin: req.user._id, // Hospital Admin ID
    });

    const createdHospital = await hospital.save();
    res.status(201).json(createdHospital);
});

// @desc    Get all hospitals
// @route   GET /api/hospitals
// @access  Public
export const getHospitals = asyncHandler(async (req, res) => {
    const hospitals = await Hospital.find();
    res.json(hospitals);
});
