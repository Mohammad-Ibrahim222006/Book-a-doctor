import { useState, useEffect } from "react";
import { message, Modal } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { AppointmentSkeleton } from "../components/SkeletonLoaders";
import {
  getDoctorAppointments,
  handleAppointmentStatus,
  downloadDocument,
  getNotifications,
  updateDoctorProfile,
  getDocsForUser,
} from "../services/api";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  FileTextOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchNotifications();
    fetchProfile();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await getDoctorAppointments();
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

  const fetchProfile = async () => {
    try {
      const res = await getDocsForUser();
      if (res.data.data) {
        setDoctorProfile(res.data.data);
        setEditForm(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatus = async (appointmentId, status) => {
    try {
      setActionLoading(appointmentId);
      await handleAppointmentStatus({ appointmentId, status });
      message.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (error) {
      message.error("Failed to update appointment");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownload = async (appointmentId) => {
    try {
      const res = await downloadDocument(appointmentId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "document.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      message.error("Failed to download document");
    }
  };

  const handleEditProfile = async () => {
    try {
      setEditLoading(true);
      await updateDoctorProfile(editForm);
      message.success("Profile updated successfully");
      setEditModalVisible(false);
      fetchProfile();
    } catch (error) {
      message.error("Failed to update profile");
    } finally {
      setEditLoading(false);
    }
  };

  const filteredAppointments =
    activeTab === "all"
      ? appointments
      : appointments.filter((apt) => apt.status === activeTab);

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    approved: appointments.filter((a) => a.status === "approved").length,
    rejected: appointments.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="main">
      <Sidebar role="doctor" />
      <div className="content">
        <Header notifications={notifications.length} />
        <div className="page-container">
          <div className="page-header flex-between">
            <div>
              <h2 className="page-title">Doctor Dashboard</h2>
              <p className="page-subtitle">Manage your appointments and profile</p>
            </div>
            <button
              className="btn-primary"
              onClick={() => setEditModalVisible(true)}
            >
              <EditOutlined /> Edit Profile
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", marginBottom: "32px" }}>
            <div className="card" onClick={() => setActiveTab("all")} style={{ cursor: "pointer", border: activeTab === "all" ? "1px solid var(--primary)" : "" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-full)", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                  <CalendarOutlined />
                </div>
                <div>
                  <h3 style={{ fontSize: "24px", fontWeight: "700" }}>{stats.total}</h3>
                  <p style={{ fontSize: "14px", margin: 0 }}>Total Appointments</p>
                </div>
              </div>
            </div>
            <div className="card" onClick={() => setActiveTab("pending")} style={{ cursor: "pointer", border: activeTab === "pending" ? "1px solid var(--warning)" : "" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-full)", background: "var(--warning-light)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                  <ClockCircleOutlined />
                </div>
                <div>
                  <h3 style={{ fontSize: "24px", fontWeight: "700" }}>{stats.pending}</h3>
                  <p style={{ fontSize: "14px", margin: 0 }}>Pending</p>
                </div>
              </div>
            </div>
            <div className="card" onClick={() => setActiveTab("approved")} style={{ cursor: "pointer", border: activeTab === "approved" ? "1px solid var(--success)" : "" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-full)", background: "var(--success-light)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                  <CheckCircleOutlined />
                </div>
                <div>
                  <h3 style={{ fontSize: "24px", fontWeight: "700" }}>{stats.approved}</h3>
                  <p style={{ fontSize: "14px", margin: 0 }}>Approved</p>
                </div>
              </div>
            </div>
            <div className="card" onClick={() => setActiveTab("rejected")} style={{ cursor: "pointer", border: activeTab === "rejected" ? "1px solid var(--danger)" : "" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-full)", background: "var(--danger-light)", color: "var(--danger)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                  <CloseCircleOutlined />
                </div>
                <div>
                  <h3 style={{ fontSize: "24px", fontWeight: "700" }}>{stats.rejected}</h3>
                  <p style={{ fontSize: "14px", margin: 0 }}>Rejected</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
            {["all", "pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                style={{
                  background: activeTab === tab ? "var(--surface)" : "transparent",
                  border: activeTab === tab ? "1px solid var(--border)" : "1px solid transparent",
                  boxShadow: activeTab === tab ? "var(--shadow-sm)" : "none",
                  padding: "8px 16px",
                  borderRadius: "var(--radius-full)",
                  fontWeight: "500",
                  color: activeTab === tab ? "var(--text)" : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <AppointmentSkeleton count={3} />
          ) : filteredAppointments.length === 0 ? (
            <div className="card flex-center" style={{ flexDirection: "column", height: "300px", textAlign: "center" }}>
              <CalendarOutlined style={{ fontSize: 48, color: "var(--text-light)", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "18px", fontWeight: "600" }}>No Appointments</h3>
              <p>No {activeTab !== "all" ? activeTab : ""} appointments found.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
              {filteredAppointments.map((apt) => (
                <div key={apt._id} className="card">
                  <div className="flex-between" style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
                    <div className="flex-start">
                      <div style={{ width: "40px", height: "40px", borderRadius: "var(--radius-full)", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600" }}>
                        {apt.userInfo?.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>{apt.userInfo?.fullName}</h3>
                        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{apt.userInfo?.email}</span>
                      </div>
                    </div>
                    <span className={`badge badge-${apt.status}`}>
                      {apt.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                    <div className="flex-start" style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                      <CalendarOutlined />
                      <span>
                        {new Date(apt.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex-start" style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                      <UserOutlined />
                      <span>{apt.userInfo?.phone}</span>
                    </div>
                    {apt.notes && (
                      <div className="flex-start" style={{ color: "var(--text-muted)", fontSize: "14px", alignItems: "flex-start" }}>
                        <FileTextOutlined style={{ marginTop: "4px" }} />
                        <span style={{ background: "var(--bg)", padding: "8px", borderRadius: "var(--radius-sm)", flex: 1 }}>{apt.notes}</span>
                      </div>
                    )}
                    {apt.document && (
                      <div className="flex-start" style={{ color: "var(--primary)", fontSize: "14px", cursor: "pointer", fontWeight: "500" }} onClick={() => handleDownload(apt._id)}>
                        <DownloadOutlined />
                        <span>Download Document</span>
                      </div>
                    )}
                  </div>
                  {apt.status === "pending" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <button
                        style={{ background: "var(--success-light)", color: "var(--success)", border: "none", padding: "10px", borderRadius: "var(--radius-md)", fontWeight: "600", cursor: "pointer" }}
                        onClick={() => handleStatus(apt._id, "approved")}
                        disabled={actionLoading === apt._id}
                      >
                        {actionLoading === apt._id ? "..." : "Approve"}
                      </button>
                      <button
                        style={{ background: "var(--danger-light)", color: "var(--danger)", border: "none", padding: "10px", borderRadius: "var(--radius-md)", fontWeight: "600", cursor: "pointer" }}
                        onClick={() => handleStatus(apt._id, "rejected")}
                        disabled={actionLoading === apt._id}
                      >
                        {actionLoading === apt._id ? "..." : "Reject"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        title="Edit Doctor Profile"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="edit-profile-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={editForm.fullName || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, fullName: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={editForm.email || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                value={editForm.phone || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={editForm.address || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Fees ($)</label>
              <input
                type="number"
                value={editForm.fees || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, fees: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Experience (years)</label>
              <input
                type="number"
                value={editForm.experience || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, experience: e.target.value })
                }
              />
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={handleEditProfile}
            disabled={editLoading}
          >
            {editLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;