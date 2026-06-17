const express = require("express");
const {
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
} = require("../controllers/userC");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Routes
router.post("/register", registerController);
router.post("/registerdocanduser", registerDocAndUserController);
router.post("/login", loginController);
router.post("/getuserdata", authMiddleware, authController);
router.post("/registerdoc", authMiddleware, docController);
router.get("/getalldoctorsu", authMiddleware, getAllDoctorsControllers);
router.post("/getappointment", authMiddleware, appointmentController);
router.post(
  "/getallnotification",
  authMiddleware,
  getallnotificationController
);
router.post(
  "/deleteallnotification",
  authMiddleware,
  deleteallnotificationController
);
router.get("/getuserappointments", authMiddleware, getAllUserAppointments);
router.get("/getDocsforuser", authMiddleware, getDocsController);

module.exports = router;