const userModel = require("../schemas/userModel");
const docModel = require("../schemas/docModel");
const appointmentModel = require("../schemas/appointmentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const multer = require("multer");
const path = require("path");

// Configure multer for document upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(new Error("Only images and documents are allowed"));
  },
}).single("document");

// Register User
const registerController = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).send({ message: "Please fill all fields" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      fullName,
      email,
      password: hashedPassword,
      phone,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    res.status(201).send({
      message: "Registration successful",
      success: true,
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          isdoctor: user.isdoctor,
          type: user.type,
        },
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Registration failed", success: false });
  }
};

// Login User
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "Please fill all fields" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    res.status(200).send({
      message: "Login successful",
      success: true,
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          isdoctor: user.isdoctor,
          type: user.type,
        },
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Login failed", success: false });
  }
};

// Get User Data
const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({
      message: "User data fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to get user data", success: false });
  }
};

// Register Doctor
const docController = async (req, res) => {
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

    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !specialization ||
      !experience ||
      !fees ||
      !timings
    ) {
      return res.status(400).send({ message: "Please fill all fields" });
    }

    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const existingDoctor = await docModel.findOne({ userId: req.userId });
    if (existingDoctor) {
      return res.status(400).send({ message: "Already applied as doctor" });
    }

    const doctor = new docModel({
      userId: user._id,
      fullName,
      email,
      phone,
      address,
      specialization,
      experience,
      fees,
      timings,
      status: "pending",
    });

    await doctor.save();

    const admin = await userModel.findOne({ type: "admin" });
    if (admin) {
      admin.notification.push({
        type: "new-doctor-request",
        message: `${user.fullName} has applied for doctor`,
        data: {
          doctorId: doctor._id,
          userId: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: doctor.address,
          specialization: doctor.specialization,
          experience: doctor.experience,
          fees: doctor.fees,
          timings: doctor.timings,
          status: doctor.status,
          createdAt: doctor.createdAt,
          onClickPath: "/admin/doctors",
        },
      });
      await admin.save();
    }

    res.status(201).send({
      message: "Doctor application submitted successfully",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Failed to submit doctor application", success: false });
  }
};

// Get All Doctors for User
const getAllDoctorsControllers = async (req, res) => {
  try {
    const doctors = await docModel.find({ status: "approved" });
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

// Book Appointment
const appointmentController = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).send({ message: err.message, success: false });
    } else if (err) {
      return res.status(400).send({ message: err.message, success: false });
    }

    try {
      const { doctorId, date } = req.body;

      const userInfo =
      typeof req.body.userInfo === "string"
      ? JSON.parse(req.body.userInfo)
      : req.body.userInfo;

      const doctorInfo =
      typeof req.body.doctorInfo === "string"
    ? JSON.parse(req.body.doctorInfo)
    : req.body.doctorInfo;
      const userId = req.userId;

      if (!doctorId || !date || !userInfo || !doctorInfo) {
        return res.status(400).send({ message: "Please fill all fields" });
      }

      const document = req.file
        ? {
            path: req.file.path,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
          }
        : null;

      const appointment = new appointmentModel({
        userId,
        doctorId,
        userInfo,
        doctorInfo,
        date: moment(date, "DD-MM-YYYY").toISOString(),
        document,
        status: "pending",
      });

      await appointment.save();

      const doctor = await docModel.findById(doctorId);
      if (doctor) {
        const doctorUser = await userModel.findById(doctor.userId);
        if (doctorUser) {
          doctorUser.notification.push({
            type: "new-appointment-request",
            message: `New appointment request from ${userInfo.fullName}`,
            data: {
              appointmentId: appointment._id,
              userId: userId,
              doctorId: doctorId,
              fullName: userInfo.fullName,
              email: userInfo.email,
              phone: userInfo.phone,
              date: appointment.date,
              status: appointment.status,
              createdAt: appointment.createdAt,
              onClickPath: "/doctor/appointments",
            },
          });
          await doctorUser.save();
        }
      }

      const user = await userModel.findById(userId);
      if (user) {
        user.notification.push({
          type: "appointment-booked",
          message: `Your appointment has been booked with Dr. ${doctorInfo.fullName}`,
          data: {
            appointmentId: appointment._id,
            doctorId: doctorId,
            fullName: doctorInfo.fullName,
            date: appointment.date,
            status: appointment.status,
            createdAt: appointment.createdAt,
            onClickPath: "/user/appointments",
          },
        });
        await user.save();
      }

      res.status(201).send({
        message: "Appointment booked successfully",
        success: true,
        data: appointment,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Failed to book appointment", success: false });
    }
  });
};

// Get All Notifications
const getallnotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({
      message: "Notifications fetched successfully",
      success: true,
      data: user.notification,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Failed to fetch notifications", success: false });
  }
};

// Delete All Notifications
const deleteallnotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.seennotification.push(...user.notification);
    user.notification = [];

    await user.save();

    res.status(200).send({
      message: "All notifications deleted successfully",
      success: true,
      data: { notification: user.notification },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Failed to delete notifications", success: false });
  }
};

// Get User Appointments
const getAllUserAppointments = async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await appointmentModel
      .find({ userId })
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

// Get Docs for User
const getDocsController = async (req, res) => {
  try {
    const userId = req.userId;
    const doctor = await docModel.findOne({ userId });

    res.status(200).send({
      message: "Doctor data fetched successfully",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Failed to fetch doctor data", success: false });
  }
};

// Register User + Doctor Application in one step
const registerDocAndUserController = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      address,
      specialization,
      experience,
      fees,
      timings,
    } = req.body;

    if (!fullName || !email || !password || !phone || !address || !specialization || !experience || !fees || !timings) {
      return res.status(400).send({ message: "Please fill all fields" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      fullName,
      email,
      password: hashedPassword,
      phone,
      isdoctor: true,
    });
    await user.save();

    const doctor = new docModel({
      userId: user._id,
      fullName,
      email,
      phone,
      address,
      specialization,
      experience,
      fees,
      timings,
      status: "pending",
    });
    await doctor.save();

    const admin = await userModel.findOne({ type: "admin" });
    if (admin) {
      admin.notification.push({
        type: "new-doctor-request",
        message: `${user.fullName} has applied for doctor`,
        data: {
          doctorId: doctor._id,
          userId: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: doctor.address,
          specialization: doctor.specialization,
          experience: doctor.experience,
          fees: doctor.fees,
          timings: doctor.timings,
          status: doctor.status,
          createdAt: doctor.createdAt,
          onClickPath: "/admin/doctors",
        },
      });
      await admin.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    res.status(201).send({
      message: "Registration successful. Your application is pending approval.",
      success: true,
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          isdoctor: user.isdoctor,
          type: user.type,
        },
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Registration failed", success: false });
  }
};

module.exports = {
  registerController,
  loginController,
  authController,
  docController,
  registerDocAndUserController,
  getallnotificationController,
  deleteallnotificationController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getDocsController,
};