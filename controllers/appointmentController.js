import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Patients)
export const bookAppointment = asyncHandler(async (req, res) => {
    const { doctorId, hospitalId, date } = req.body;

    const appointment = new Appointment({
        patient: req.user._id,
        doctor: doctorId,
        hospital: hospitalId,
        date,
    });

    const createdAppointment = await appointment.save();
    res.status(201).json(createdAppointment);
});

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private (Patients & Doctors)
export const getAppointments = asyncHandler(async (req, res) => {
    let appointments;

    if (req.user.role === 'doctor') {
        appointments = await Appointment.find({ doctor: req.user._id }).populate('patient', 'name email');
    } else {
        appointments = await Appointment.find({ patient: req.user._id }).populate('doctor', 'name specialization');
    }

    res.json(appointments);
});
