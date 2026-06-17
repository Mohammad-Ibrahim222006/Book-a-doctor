const express = require("express");
const {
  getAllUsersControllers,
  getAllDoctorsControllers,
  getStatusApproveController,
  getStatusRejectController,
  displayAllAppointmentController,
  deleteUserController,
  deleteDoctorController,
  deleteAllDataController,
} = require("../controllers/adminC");
const authMiddleware = require("../middlewares/authMiddleware");
const adminAuth = require("../middlewares/adminAuth");

const router = express.Router();

// Routes
router.get(
  "/getallusers",
  authMiddleware,
  adminAuth,
  getAllUsersControllers
);
router.get(
  "/getalldoctors",
  authMiddleware,
  adminAuth,
  getAllDoctorsControllers
);
router.post(
  "/getapprove",
  authMiddleware,
  adminAuth,
  getStatusApproveController
);
router.post(
  "/getreject",
  authMiddleware,
  adminAuth,
  getStatusRejectController
);
router.get(
  "/getallAppointmentsAdmin",
  authMiddleware,
  adminAuth,
  displayAllAppointmentController
);
router.delete(
  "/deleteuser/:userId",
  authMiddleware,
  adminAuth,
  deleteUserController
);
router.delete(
  "/deletedoctor/:doctorId",
  authMiddleware,
  adminAuth,
  deleteDoctorController
);
router.delete(
  "/deletealldata",
  authMiddleware,
  adminAuth,
  deleteAllDataController
);

module.exports = router;