# CareSync System Documentation

## Introduction
### Problem Statement
Traditional healthcare facilities often rely on manual or disjointed digital systems to manage patient records and appointments. This leads to scheduling conflicts, lost medical documents, and a frustrating experience for both patients and doctors. 

### Project Objectives
CareSync was developed to provide a centralized, secure, and user-friendly platform that digitizes the entire consultation workflow. Objectives include:
- Streamlining patient registration and doctor discovery.
- Enabling secure transfer of prior medical documents.
- Providing doctors with tools to efficiently manage their schedules.
- Giving administrators oversight to maintain platform integrity.

## System Architecture
The application is built on the MERN stack (MongoDB, Express.js, React, Node.js). 
- **Frontend Layer:** Built with React 19, utilizing Ant Design for enterprise-grade UI components and Context API for state management.
- **Backend Layer:** A RESTful API built with Node.js and Express.js, utilizing custom middleware for role-based access control and file uploading.
- **Data Layer:** MongoDB is used for persistent storage, interfaced via Mongoose schemas.

## Detailed Module Description

### Authentication Module
Handles user registration, login, and session management. It uses JSON Web Tokens (JWT) for stateless authentication. Passwords are securely hashed using bcryptjs before storage. The module distinguishes between standard users, pending doctors, and administrators.

### Patient Module
Allows users to browse a directory of approved doctors, view their specializations, consultation fees, and availability. Patients can view their own appointment history and update their profile information.

### Doctor Module
Allows medical professionals to apply for platform access. Upon admin approval, doctors gain access to a dedicated dashboard. They can manage their schedule, review incoming appointment requests, accept/reject them, and securely download patient medical documents attached to appointments.

### Appointment Management Module
The core operational module. It links a Patient and a Doctor through an `Appointment` entity. It tracks the selected date, the status (pending, approved, rejected), and stores a reference to any uploaded medical documents.

### Notification Module
An integrated system that pushes updates directly to a user's account. When an appointment status changes (e.g., a doctor accepts a request), an in-app notification is generated and appended to the user's unread notifications array in the database.

### Dashboard Module
Primarily for the Administrator. It utilizes Recharts on the frontend to display analytical data, such as total user counts, doctor specializations breakdown, and appointment status metrics.

## Database Design
The MongoDB database relies on three primary collections:
1. **Users (`userModel.js`):**
   - Fields: `fullName`, `email`, `password`, `phone`, `isdoctor` (boolean), `type` (admin/user), `notification` (array), `seennotification` (array).
2. **Doctors (`docModel.js`):**
   - Fields: `userId` (reference to User), `specialization`, `experience`, `fees`, `status` (pending/approved), `timings`.
3. **Appointments (`appointmentModel.js`):**
   - Fields: `userId`, `doctorId`, `userInfo` (snapshot), `doctorInfo` (snapshot), `date`, `status`, `document` (metadata for uploaded file).

## API Documentation
*Base URL: `/api`*

### User Endpoints
- `POST /user/register`: Register a new patient.
- `POST /user/login`: Authenticate and receive a JWT.
- `GET /user/getalldoctorsu`: Fetch all approved doctors.
- `POST /user/getappointment`: Book an appointment (supports multipart/form-data for document upload).
- `POST /user/getallnotification`: Retrieve unread user notifications.

### Doctor Endpoints
- `POST /doctor/updateprofile`: Update specific doctor details.
- `GET /doctor/getdoctorappointments`: Retrieve all appointments assigned to the logged-in doctor.
- `POST /doctor/handlestatus`: Accept or reject a specific appointment.
- `GET /doctor/getdocumentdownload/:id`: Securely download a patient's uploaded medical document.

### Admin Endpoints
- `GET /admin/getallusers`: Fetch all registered patients.
- `GET /admin/getalldoctors`: Fetch all pending and approved doctors.
- `POST /admin/getapprove`: Approve a pending doctor application.

## Workflow Explanation
1. **Onboarding:** A user registers. If they apply as a doctor, their profile goes into a 'pending' queue.
2. **Verification:** The administrator reviews the pending doctor queue and approves legitimate profiles.
3. **Discovery:** A patient logs in, searches for an approved doctor, and initiates a booking.
4. **Booking:** The patient selects a time, optionally uploads a previous prescription/report, and submits.
5. **Review:** The doctor logs in, sees the pending appointment, downloads the report to review, and clicks "Approve".
6. **Notification:** The patient receives a real-time alert that their appointment is confirmed.

## Security Considerations
- **Stateless Sessions:** JWT prevents session hijacking.
- **Route Protection:** Frontend routes and backend API endpoints are strictly guarded by role-based auth middleware (`authMiddleware`, `adminAuth`, `doctorAuth`).
- **Data Sanitization:** Mongoose schemas enforce data types.
- **Password Security:** Salted and hashed via bcryptjs.
- **Safe File Uploads:** Multer is configured to handle files securely, preventing malicious executable uploads.

## Error Handling Strategy
The backend implements a centralized error-handling middleware. It intercepts operational errors (like `MulterError` for file upload limits) and authentication errors (`JsonWebTokenError`, `TokenExpiredError`), ensuring consistent JSON error responses rather than crashing the server.

## Deployment Considerations
- **Environment Variables:** Must be securely managed in the hosting provider's dashboard.
- **Database:** MongoDB Atlas should be IP-restricted to the backend server's IP.
- **Static Assets:** The React frontend should be built and served via a CDN (e.g., Vercel, Netlify) for optimal caching and speed.

## Testing Strategy
- **Manual Testing:** End-to-end workflow verification via Postman for API endpoints.
- **Component Testing:** React components can be tested using Jest and React Testing Library in future iterations.

## Scalability Considerations
- **Stateless Backend:** Since JWT is used, the Node.js backend can be horizontally scaled across multiple instances behind a load balancer.
- **Database Indexing:** Frequent queries (like searching doctors by specialization) can be optimized by adding MongoDB indexes.
- **Cloud Storage:** Currently, files are stored locally in the `uploads/` directory. For scale, this should be migrated to Amazon S3 or a similar cloud blob storage.

## Future Scope
- Implementation of WebSockets (Socket.io) for real-time chat between doctor and patient.
- Telemedicine video integration.
- Analytics expansion to track revenue generation for doctors.

## Conclusion
The CareSync documentation outlines a well-structured, secure, and scalable architecture. By adhering to modern development practices and clear role separations, it serves as a strong foundation for a comprehensive digital healthcare system.
