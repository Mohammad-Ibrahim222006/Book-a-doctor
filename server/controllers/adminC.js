const userModel = require("../schemas/userModel");
const docModel = require("../schemas/docModel");
const appointmentModel = require("../schemas/appointmentModel");

// Get All Users
const getAllUsersControllers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password");
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Failed to fetch users", success: false });
  }
};

// Get All Doctors
const getAllDoctorsControllers = async (req, res) => {
  try {
    const doctors = await docModel.find({});
    res.status(200).send({
      message: "Doctors fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Failed to fetch doctors", success: false });
  }
};

// Approve Doctor
const getStatusApproveController = async (req, res) => {
  try {
    const { doctorId, userId } = req.body;

    if (!doctorId || !userId) {
      return res
        .status(400)
        .send({ message: "Please provide doctor ID and user ID" });
    }

    const doctor = await docModel.findByIdAndUpdate(
      doctorId,
      { status: "approved" },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).send({ message: "Doctor not found" });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { isdoctor: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.notification.push({
      type: "doctor-approved",
      message: "Your doctor application has been approved",
      data: {
        doctorId: doctor._id,
        userId: user._id,
        fullName: doctor.fullName,
        status: doctor.status,
        createdAt: doctor.createdAt,
        onClickPath: "/doctor/profile",
      },
    });
    await user.save();

    const admin = await userModel.findOne({ type: "admin" });
    if (admin) {
      admin.notification = admin.notification.filter(
        (n) => n.data && n.data.doctorId && n.data.doctorId.toString() !== doctorId.toString()
      );
      await admin.save();
    }

    res.status(200).send({
      message: "Doctor approved successfully",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Failed to approve doctor", success: false });
  }
};

// Reject Doctor
const getStatusRejectController = async (req, res) => {
  try {
    const { doctorId, userId, reason } = req.body;

    if (!doctorId || !userId) {
      return res
        .status(400)
        .send({ message: "Please provide doctor ID and user ID" });
    }

    const doctor = await docModel.findByIdAndUpdate(
      doctorId,
      { status: "rejected" },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).send({ message: "Doctor not found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.notification.push({
      type: "doctor-rejected",
      message: `Your doctor application has been rejected${reason ? `: ${reason}` : ""}`,
      data: {
        doctorId: doctor._id,
        userId: user._id,
        fullName: doctor.fullName,
        status: doctor.status,
        createdAt: doctor.createdAt,
        onClickPath: "/user/home",
      },
    });
    await user.save();

    const admin = await userModel.findOne({ type: "admin" });
    if (admin) {
      admin.notification = admin.notification.filter(
        (n) => n.data && n.data.doctorId && n.data.doctorId.toString() !== doctorId.toString()
      );
      await admin.save();
    }

    res.status(200).send({
      message: "Doctor rejected successfully",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Failed to reject doctor", success: false });
  }
};

// Get All Appointments (Admin)
const displayAllAppointmentController = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({})
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

// Delete User
const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    if (user.type === "admin") {
      return res.status(400).send({ message: "Cannot delete admin user" });
    }

    await docModel.findOneAndDelete({ userId: user._id });
    await appointmentModel.deleteMany({ userId: user._id });
    await userModel.findByIdAndDelete(userId);

    res.status(200).send({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to delete user", success: false });
  }
};

// Delete Doctor
const deleteDoctorController = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await docModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).send({ message: "Doctor not found" });
    }

    await userModel.findByIdAndUpdate(doctor.userId, { isdoctor: false });
    await appointmentModel.deleteMany({ doctorId: doctor._id });

    const admin = await userModel.findOne({ type: "admin" });
    if (admin) {
      admin.notification = admin.notification.filter(
        (n) => !(n.data && n.data.doctorId && n.data.doctorId.toString() === doctorId.toString())
      );
      await admin.save();
    }

    await docModel.findByIdAndDelete(doctorId);

    res.status(200).send({
      message: "Doctor deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to delete doctor", success: false });
  }
};

// Delete All Data (except admins)
const deleteAllDataController = async (req, res) => {
  try {
    await userModel.deleteMany({ type: { $ne: "admin" } });
    await docModel.deleteMany({});
    await appointmentModel.deleteMany({});

    const admin = await userModel.findOne({ type: "admin" });
    if (admin) {
      admin.notification = [];
      admin.seennotification = [];
      await admin.save();
    }

    res.status(200).send({
      message: "All data deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to delete all data", success: false });
  }
};

module.exports = {
  getAllUsersControllers,
  getAllDoctorsControllers,
  getStatusApproveController,
  getStatusRejectController,
  displayAllAppointmentController,
  deleteUserController,
  deleteDoctorController,
  deleteAllDataController,
};