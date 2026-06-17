import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { TableSkeleton } from "../components/SkeletonLoaders";
import { getAllAppointmentsAdmin, getNotifications } from "../services/api";
import { CalendarOutlined } from "@ant-design/icons";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
    fetchNotifications();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await getAllAppointmentsAdmin();
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

  return (
    <div className="main">
      <Sidebar role="admin" />
      <div className="content">
        <Header notifications={notifications.length} />
        <div className="page-container">
          <div className="page-header">
            <h2 className="page-title">All Appointments</h2>
            <p className="page-subtitle">View and manage all platform appointments</p>
          </div>
          {loading ? (
            <TableSkeleton rows={6} cols={8} />
          ) : appointments.length === 0 ? (
            <div className="card flex-center" style={{ flexDirection: "column", height: "300px", textAlign: "center" }}>
              <CalendarOutlined style={{ fontSize: 48, color: "var(--text-light)", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "18px", fontWeight: "600" }}>No Appointments</h3>
              <p>No appointments have been booked yet</p>
            </div>
          ) : (
            <div className="card" style={{ padding: "0", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                      <th style={{ padding: "16px", fontWeight: "600", fontSize: "14px", color: "var(--text-muted)" }}>ID</th>
                      <th style={{ padding: "16px", fontWeight: "600", fontSize: "14px", color: "var(--text-muted)" }}>Patient</th>
                      <th style={{ padding: "16px", fontWeight: "600", fontSize: "14px", color: "var(--text-muted)" }}>Patient Phone</th>
                      <th style={{ padding: "16px", fontWeight: "600", fontSize: "14px", color: "var(--text-muted)" }}>Doctor</th>
                      <th style={{ padding: "16px", fontWeight: "600", fontSize: "14px", color: "var(--text-muted)" }}>Specialization</th>
                      <th style={{ padding: "16px", fontWeight: "600", fontSize: "14px", color: "var(--text-muted)" }}>Date</th>
                      <th style={{ padding: "16px", fontWeight: "600", fontSize: "14px", color: "var(--text-muted)" }}>Fees</th>
                      <th style={{ padding: "16px", fontWeight: "600", fontSize: "14px", color: "var(--text-muted)" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt._id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "16px", fontSize: "14px", fontFamily: "monospace", color: "var(--text-muted)" }}>{apt._id.slice(-8)}</td>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "500" }}>{apt.userInfo?.fullName}</td>
                        <td style={{ padding: "16px", fontSize: "14px", color: "var(--text-muted)" }}>{apt.userInfo?.phone}</td>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "500" }}>{/^dr\.?\s/i.test(apt.doctorInfo?.fullName) ? apt.doctorInfo?.fullName : `Dr. ${apt.doctorInfo?.fullName}`}</td>
                        <td style={{ padding: "16px", fontSize: "14px", color: "var(--primary)" }}>{apt.doctorInfo?.specialization}</td>
                        <td style={{ padding: "16px", fontSize: "14px", color: "var(--text-muted)" }}>
                          {new Date(apt.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "600" }}>${apt.doctorInfo?.fees}</td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>
                          <span className={`badge badge-${apt.status}`}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;