import asyncHandler from 'express-async-handler';
import Prescription from '../models/Prescription.js';

// @desc    Create a prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor Only)
export const createPrescription = asyncHandler(async (req, res) => {
    const { patientId, appointmentId, medicines, notes } = req.body;

    const prescription = new Prescription({
        patient: patientId,
        doctor: req.user._id,
        appointment: appointmentId,
        medicines,
        notes,
    });

    const createdPrescription = await prescription.save();
    res.status(201).json(createdPrescription);
});

// @desc    Get prescriptions for a patient
// @route   GET /api/prescriptions/:patientId
// @access  Private (Patient & Doctor)
/* export const getPrescriptions = asyncHandler(async (req, res) => {
    const prescriptions = await Prescription.find({ patient: req.params.patientId }).populate('doctor', 'name specialization');
    res.json(prescriptions);
}); */
export const getPrescriptions = async (req, res) => {
    try {
      const { patientId } = req.params;
  
      if (!patientId) {
        return res.status(400).json({ message: "Patient ID is required" });
      }
  
      const prescriptions = await Prescription.find({ patient: patientId });
  
      if (!prescriptions) {
        return res.status(404).json({ message: "No prescriptions found" });
      }
  
      res.json(prescriptions);
    } catch (error) {
      console.error("Error in getPrescriptions:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  
