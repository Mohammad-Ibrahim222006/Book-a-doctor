const docModel = require("../schemas/docModel");
const appointmentModel = require("../schemas/appointmentModel");
const userModel = require("../schemas/userModel");

// Update Doctor Profile
const updateDoctorProfileController = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      specialization,
      experience,
      fees,
      timings,
    } = req.body;

    const doctor = await docModel.findOne({ userId: req.userId });
    if (!doctor) {
      return res.status(404).send({ message: "Doctor not found" });
    }

    const updatedDoctor = await docModel.findByIdAndUpdate(
      doctor._id,
      {
        fullName,
        email,
        phone,
        address,
        specialization,
        experience,
        fees,
        timings,
      },
      { new: true }
    );

    res.status(200).send({
      message: "Profile updated successfully",
      success: true,
      data: updatedDoctor,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Failed to update profile", success: false });
  }
};

// Get Doctor Appointments
const getAllDoctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await docModel.findOne({ userId: req.userId });
    if (!doctor) {
      return res.status(404).send({ message: "Doctor not found" });
    }

    const appointments = await appointmentModel
      .find({ doctorId: doctor._id })
      .sort({ createdAt: -1 });

    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Failed to fetch appointments", success: false });
  }
};

// Handle Appointment Status (Approve/Reject)
const handleStatusController = async (req, res) => {
  try {
    const { appointmentId, status, notes } = req.body;

    if (!appointmentId || !status) {
      return res
        .status(400)
        .send({ message: "Please provide appointment ID and status" });
    }

    const doctor = await docModel.findOne({ userId: req.userId });
    if (!doctor) {
      return res.status(404).send({ message: "Doctor not found" });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send({ message: "Appointment not found" });
    }

    if (appointment.doctorId.toString() !== doctor._id.toString()) {
      return res
        .status(403)
        .send({ message: "Not authorized to update this appointment" });
    }

    appointment.status = status;
    if (notes) {
      appointment.notes = notes;
    }
    await appointment.save();

    const user = await userModel.findById(appointment.userId);
    if (user) {
      user.notification.push({
        type: "appointment-status",
        message: `Your appointment has been ${status} by Dr. ${doctor.fullName}`,
        data: {
          appointmentId: appointment._id,
          doctorId: appointment.doctorId,
          fullName: doctor.fullName,
          date: appointment.date,
          status: appointment.status,
          createdAt: appointment.createdAt,
          onClickPath: "/user/appointments",
        },
      });
      await user.save();
    }

    res.status(200).send({
      message: `Appointment ${status} successfully`,
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Failed to update appointment status", success: false });
  }
};

// Get Document Download
const documentDownloadController = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const doctor = await docModel.findOne({ userId: req.userId });
    if (!doctor) {
      return res.status(404).send({ message: "Doctor not found" });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send({ message: "Appointment not found" });
    }

    if (appointment.doctorId.toString() !== doctor._id.toString()) {
      return res
        .status(403)
        .send({ message: "Not authorized to access this document" });
    }

    if (!appointment.document || !appointment.document.path) {
      return res.status(404).send({ message: "Document not found" });
    }

    res.download(appointment.document.path, appointment.document.originalname);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Failed to download document", success: false });
  }
};

module.exports = {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController,
};