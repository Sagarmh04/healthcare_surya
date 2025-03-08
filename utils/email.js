const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAppointmentConfirmation = async (email, appointmentDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Appointment Confirmation',
    text: `Your appointment has been booked for ${new Date(
      appointmentDetails.date
    ).toLocaleString()}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendAppointmentConfirmation };