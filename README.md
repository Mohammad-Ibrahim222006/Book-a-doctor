# CareSync Healthcare Management Platform

## Project Overview
CareSync is a comprehensive, full-stack healthcare web application designed to bridge the gap between patients, healthcare professionals, and system administrators. The platform aims to solve the inefficiencies in traditional clinic appointment scheduling by digitizing patient registrations, doctor discovery, and medical document sharing in a secure and centralized system.

## Features
- **Secure Authentication:** JWT-based login and registration for all user types.
- **Dynamic Doctor Directory:** Patients can browse and search for doctors by specialization.
- **Appointment Scheduling:** Patients can select specific dates to request consultations.
- **Document Uploads:** Secure attachment of previous medical records or prescriptions when booking.
- **Real-time Status Tracking:** Track appointment states (pending, approved, rejected).
- **In-App Notifications:** Real-time push alerts for appointment updates and system announcements.
- **Admin Dashboard:** Centralized view of overall system metrics and users.

## User Roles
1. **Patient (User):** Can register, discover doctors, book appointments, attach medical documents, and view notification updates.
2. **Doctor:** Can register (pending admin approval), view patient requests, download attached documents, and approve or reject appointments.
3. **Administrator:** Has overarching control to view all system data, approve pending doctor registrations, and manage user accounts.

## Technology Stack
- **Frontend:** React 19, React Router DOM v7, Ant Design v6, Recharts, Vite.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Atlas), Mongoose ODM.
- **Authentication:** JSON Web Tokens (JWT), bcryptjs for password hashing.
- **File Handling:** Multer middleware for secure file uploads.

## System Architecture
CareSync employs a standard Client-Server architecture utilizing the MERN stack. The React frontend acts as a Single Page Application (SPA) communicating asynchronously via Axios with the Node.js/Express REST API. The backend processes business logic, validates JWT tokens via middleware, securely interacts with the MongoDB database, and handles file I/O for document uploads.

## Project Structure
```text
book-a-doctor-main/
├── client/                 # React Frontend Application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context for Auth state
│   │   ├── pages/          # Full page views (Home, Dashboard, Login, etc.)
│   │   └── services/       # Centralized Axios API service layer
├── server/                 # Node.js/Express Backend API
│   ├── config/             # Database connection setup
│   ├── controllers/        # Business logic for routes
│   ├── middlewares/        # Auth guards and Multer config
│   ├── routes/             # Express route definitions
│   ├── schemas/            # Mongoose data models
│   └── uploads/            # Local storage for patient documents
```

## Installation Guide
### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- Git

### Setup
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd book-a-doctor-main
   ```

2. Install Backend Dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install Frontend Dependencies:
   ```bash
   cd ../client
   npm install
   ```

## Environment Configuration
Create a `.env` file in the `server/` directory. You will need to provide the following keys (do not use quotes):
- `PORT`: The port number for the server (e.g., 8001).
- `MONGO_URI`: Your MongoDB connection string.
- `JWT_KEY`: A secure, random string used for signing authentication tokens.
- `ADMIN_EMAIL`: Default administrator email (for the seed script).
- `ADMIN_PASSWORD`: Default administrator password.

## Running the Project
### Development Mode
1. Start the Backend Server:
   ```bash
   cd server
   npm start
   ```
   *(Server runs on http://localhost:8001)*

2. Start the Frontend Client:
   ```bash
   cd client
   npm run dev
   ```
   *(Client runs on http://localhost:5173)*

### Production Mode
To build the frontend for production:
```bash
cd client
npm run build
```
Serve the generated `dist/` directory using a static file server or integrate it with the Node.js backend.

## Screenshots Section
![Home Page Placeholder](#) *(Add screenshot here)*
![Patient Dashboard Placeholder](#) *(Add screenshot here)*
![Doctor Management Placeholder](#) *(Add screenshot here)*

## Future Enhancements
- Integration of WebRTC for live telehealth video consultations.
- Payment gateway integration (Stripe/PayPal) for consultation fees.
- Automated email and SMS reminders.
- Digital prescription generation in PDF format.

## Conclusion
CareSync successfully demonstrates a robust, scalable MERN stack implementation tailored for the healthcare industry. It provides a secure, intuitive, and efficient platform for managing the critical interactions between patients and healthcare providers.
