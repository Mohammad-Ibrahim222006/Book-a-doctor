import { useState, useEffect } from "react";
import { Spin } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DoctorList from "../components/DoctorList";
import { getAllDoctors, getNotifications } from "../services/api";
import { useAuth } from "../context/AuthContext";

const UserHome = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllDoctors();
      setDoctors(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      setError("Failed to load doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchNotifications();
  }, []);

  return (
    <div className="main">
      <Sidebar role="user" />
      <div className="content">
        <Header notifications={notifications.length} />
        <div className="page-container">
          <div className="page-header">
            <h2 className="page-title">Welcome, {user?.fullName}!</h2>
            <p className="page-subtitle">Find and book appointments with trusted doctors</p>
          </div>
          {loading ? (
            <div className="flex-center" style={{ height: "400px" }}>
              <Spin size="large" />
            </div>
          ) : error ? (
            <div className="card flex-center" style={{ flexDirection: "column", height: "300px", textAlign: "center" }}>
              <h3 style={{ fontSize: "20px", color: "var(--danger)" }}>Oops!</h3>
              <p style={{ marginTop: "8px" }}>{error}</p>
              <button className="btn-primary mt-4" onClick={fetchDoctors}>
                Try Again
              </button>
            </div>
          ) : (
            <DoctorList doctors={doctors} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHome;