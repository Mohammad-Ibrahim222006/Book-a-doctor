import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8001/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// User APIs
export const registerUser = (data) => API.post("/user/register", data);
export const registerDocAndUser = (data) => API.post("/user/registerdocanduser", data);
export const loginUser = (data) => API.post("/user/login", data);
export const getUserData = () => API.post("/user/getuserdata");
export const registerDoctor = (data) => API.post("/user/registerdoc", data);
export const getAllDoctors = () => API.get("/user/getalldoctorsu");
export const bookAppointment = (data) => API.post("/user/getappointment", data);
export const getNotifications = () => API.post("/user/getallnotification");
export const deleteNotifications = () =>
  API.post("/user/deleteallnotification");
export const getUserAppointments = () => API.get("/user/getuserappointments");
export const getDocsForUser = () => API.get("/user/getDocsforuser");

// Doctor APIs
export const updateDoctorProfile = (data) =>
  API.post("/doctor/updateprofile", data);
export const getDoctorAppointments = () =>
  API.get("/doctor/getdoctorappointments");
export const handleAppointmentStatus = (data) =>
  API.post("/doctor/handlestatus", data);
export const downloadDocument = (appointmentId) =>
  API.get(`/doctor/getdocumentdownload/${appointmentId}`, {
    responseType: "blob",
  });

// Admin APIs
export const getAllUsers = () => API.get("/admin/getallusers");
export const getAllDoctorsAdmin = () => API.get("/admin/getalldoctors");
export const approveDoctor = (data) => API.post("/admin/getapprove", data);
export const rejectDoctor = (data) => API.post("/admin/getreject", data);
export const getAllAppointmentsAdmin = () =>
  API.get("/admin/getallAppointmentsAdmin");
export const deleteUser = (userId) => API.delete(`/admin/deleteuser/${userId}`);
export const deleteDoctor = (doctorId) =>
  API.delete(`/admin/deletedoctor/${doctorId}`);
export const deleteAllData = () => API.delete("/admin/deletealldata");

export default API;