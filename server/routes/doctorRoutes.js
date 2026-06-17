const express = require("express");
const {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController,
} = require("../controllers/doctorC");
const authMiddleware = require("../middlewares/authMiddleware");
const doctorAuth = require("../middlewares/doctorAuth");

const router = express.Router();

// Routes
router.post(
  "/updateprofile",
  authMiddleware,
  doctorAuth,
  updateDoctorProfileController
);
router.get(
  "/getdoctorappointments",
  authMiddleware,
  doctorAuth,
  getAllDoctorAppointmentsController
);
router.post(
  "/handlestatus",
  authMiddleware,
  doctorAuth,
  handleStatusController
);
router.get(
  "/getdocumentdownload/:appointmentId",
  authMiddleware,
  doctorAuth,
  documentDownloadController
);

module.exports = router;