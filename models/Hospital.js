import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  contact: {
    type: String, // Ensure contact is a required field
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // This should refer to the hospital admin user
    required: true,
  },
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
  ],
});

const Hospital = mongoose.model("Hospital", hospitalSchema);
export default Hospital;
