import { useState, useEffect } from "react";
import { Modal } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { AppointmentSkeleton } from "../components/SkeletonLoaders";
import { getUserAppointments, getNotifications } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { CalendarOutlined, FileTextOutlined } from "@ant-design/icons";

const UserAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
    fetchNotifications();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await getUserAppointments();
      setAppointments(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "approved";
      case "rejected": return "rejected";
      default: return "pending";
    }
  };

  const viewDocument = (doc) => {
    if (doc) {
      Modal.info({
        title: "Medical Document",
        content: (
          <div>
            <p><strong>File:</strong> {doc.originalname}</p>
            <p><strong>Type:</strong> {doc.mimetype}</p>
            <p><strong>Size:</strong> {(doc.size / 1024).toFixed(2)} KB</p>
          </div>
        ),
      });
    }
  };

  return (
    <div className="main">
      <Sidebar role="user" />
      <div className="content">
        <Header notifications={notifications.length} />
        <div className="page-container">
          <div className="page-header">
            <h2 className="page-title">My Appointments</h2>
            <p className="page-subtitle">View and manage your appointments</p>
          </div>
          {loading ? (
            <AppointmentSkeleton count={3} />
          ) : appointments.length === 0 ? (
            <div className="card flex-center" style={{ flexDirection: "column", height: "300px", textAlign: "center" }}>
              <CalendarOutlined style={{ fontSize: 48, color: "var(--text-light)", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "18px", fontWeight: "600" }}>No Appointments Yet</h3>
              <p>Book your first appointment with a doctor</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
              {appointments.map((appointment) => (
                <div key={appointment._id} className="card">
                  <div className="flex-between" style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
                    <div className="flex-start">
                      <div style={{ width: "40px", height: "40px", borderRadius: "var(--radius-full)", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600" }}>
                        {appointment.doctorInfo?.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>{/^dr\.?\s/i.test(appointment.doctorInfo?.fullName) ? appointment.doctorInfo?.fullName : `Dr. ${appointment.doctorInfo?.fullName}`}</h3>
                        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                          {appointment.doctorInfo?.specialization}
                        </span>
                      </div>
                    </div>
                    <span className={`badge badge-${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div className="flex-start" style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                      <CalendarOutlined />
                      <span>
                        {new Date(appointment.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex-between" style={{ marginTop: "4px" }}>
                      <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Fees</span>
                      <span style={{ fontWeight: "600", color: "var(--text)" }}>${appointment.doctorInfo?.fees}</span>
                    </div>
                    {appointment.document && (
                      <div className="flex-start" style={{ color: "var(--primary)", fontSize: "14px", cursor: "pointer", fontWeight: "500", marginTop: "8px" }} onClick={() => viewDocument(appointment.document)}>
                        <FileTextOutlined />
                        <span>View Document</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAppointments;