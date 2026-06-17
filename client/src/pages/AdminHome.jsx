import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { message, Modal } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { DashboardSkeleton, TableSkeleton } from "../components/SkeletonLoaders";
import {
  getAllUsers,
  getAllDoctorsAdmin,
  getAllAppointmentsAdmin,
  getNotifications,
  approveDoctor,
  rejectDoctor,
  deleteUser,
  deleteDoctor,
  deleteAllData,
} from "../services/api";
import {
  TeamOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const AdminHome = () => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "dashboard");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    fetchData();
    fetchNotifications();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, doctorsRes, appointmentsRes] = await Promise.all([
        getAllUsers(),
        getAllDoctorsAdmin(),
        getAllAppointmentsAdmin(),
      ]);
      setUsers(usersRes.data.data);
      setDoctors(doctorsRes.data.data);
      setAppointments(appointmentsRes.data.data);
    } catch (error) {
      message.error("Failed to fetch data");
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

  const handleApprove = async (doctorId, userId) => {
    try {
      await approveDoctor({ doctorId, userId });
      message.success("Doctor approved");
      fetchData();
    } catch (error) {
      message.error("Failed to approve doctor");
    }
  };

  const handleReject = async (doctorId, userId) => {
    try {
      await rejectDoctor({ doctorId, userId });
      message.success("Doctor rejected");
      fetchData();
    } catch (error) {
      message.error("Failed to reject doctor");
    }
  };

  const handleDeleteUser = (userId, userName) => {
    Modal.confirm({
      title: "Delete User",
      icon: <WarningOutlined style={{ color: "#ef4444" }} />,
      content: `Are you sure you want to delete "${userName}"? This will also remove their doctor record and appointments.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteUser(userId);
          message.success("User deleted");
          fetchData();
        } catch (error) {
          message.error(error.response?.data?.message || "Failed to delete user");
        }
      },
    });
  };

  const handleDeleteDoctor = (doctorId, doctorName) => {
    Modal.confirm({
      title: "Delete Doctor",
      icon: <WarningOutlined style={{ color: "#ef4444" }} />,
      content: `Are you sure you want to delete "${doctorName}"? This will also remove their appointments.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteDoctor(doctorId);
          message.success("Doctor deleted");
          fetchData();
        } catch (error) {
          message.error(error.response?.data?.message || "Failed to delete doctor");
        }
      },
    });
  };

  const handleDeleteAllData = () => {
    Modal.confirm({
      title: "Delete ALL Data",
      icon: <WarningOutlined style={{ color: "#ef4444", fontSize: 22 }} />,
      content: "This will permanently delete ALL users, doctors, and appointments. Admin account will be preserved. This action cannot be undone.",
      okText: "Yes, Delete Everything",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteAllData();
          message.success("All data deleted");
          fetchData();
        } catch (error) {
          message.error("Failed to delete data");
        }
      },
    });
  };

  const appointmentStatusData = [
    { name: "Approved", value: appointments.filter((a) => a.status === "approved").length, color: "#10b981" },
    { name: "Pending", value: appointments.filter((a) => a.status === "pending").length, color: "#f59e0b" },
    { name: "Rejected", value: appointments.filter((a) => a.status === "rejected").length, color: "#ef4444" },
  ];

  const specializationData = doctors.reduce((acc, doc) => {
    const spec = doc.specialization || "Unknown";
    const existing = acc.find((item) => item.name === spec);
    if (existing) existing.value += 1;
    else acc.push({ name: spec, value: 1 });
    return acc;
  }, []);

  return (
    <div className="main">
      <Sidebar role="admin" />
      <div className="content">
        <Header notifications={notifications.length} />
        <div className="page-container">
          <div className="page-header flex-between">
            <div>
              <h2 className="page-title">Admin Dashboard</h2>
              <p className="page-subtitle">Manage your healthcare platform</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", marginBottom: "32px" }}>
            <div className="card" onClick={() => setActiveTab("users")} style={{ cursor: "pointer", border: activeTab === "users" ? "1px solid var(--primary)" : "" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-full)", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                  <TeamOutlined />
                </div>
                <div>
                  <h3 style={{ fontSize: "24px", fontWeight: "700" }}>{loading ? "--" : users.length}</h3>
                  <p style={{ fontSize: "14px", margin: 0 }}>Total Users</p>
                </div>
              </div>
            </div>
            <div className="card" onClick={() => setActiveTab("doctors")} style={{ cursor: "pointer", border: activeTab === "doctors" ? "1px solid var(--success)" : "" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-full)", background: "var(--success-light)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                  <MedicineBoxOutlined />
                </div>
                <div>
                  <h3 style={{ fontSize: "24px", fontWeight: "700" }}>{loading ? "--" : doctors.length}</h3>
                  <p style={{ fontSize: "14px", margin: 0 }}>Total Doctors</p>
                </div>
              </div>
            </div>
            <div className="card" onClick={() => setActiveTab("appointments")} style={{ cursor: "pointer", border: activeTab === "appointments" ? "1px solid var(--warning)" : "" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-full)", background: "var(--warning-light)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                  <CalendarOutlined />
                </div>
                <div>
                  <h3 style={{ fontSize: "24px", fontWeight: "700" }}>{loading ? "--" : appointments.length}</h3>
                  <p style={{ fontSize: "14px", margin: 0 }}>Total Appointments</p>
                </div>
              </div>
            </div>
            <div className="card" onClick={() => setActiveTab("doctors")} style={{ cursor: "pointer", border: activeTab === "doctors" ? "1px solid var(--accent)" : "" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-full)", background: "var(--primary-light)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                  <ClockCircleOutlined />
                </div>
                <div>
                  <h3 style={{ fontSize: "24px", fontWeight: "700" }}>{loading ? "--" : doctors.filter((d) => d.status === "pending").length}</h3>
                  <p style={{ fontSize: "14px", margin: 0 }}>Pending Approvals</p>
                </div>
              </div>
            </div>
          </div>

          {activeTab === "dashboard" && (
            <>
              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Appointment Status</h3>
                  {loading ? (
                    <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#94a3b8" }}>Loading charts...</span>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={appointmentStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                          {appointmentStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="chart-card">
                  <h3>Doctors by Specialization</h3>
                  {loading ? (
                    <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#94a3b8" }}>Loading charts...</span>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={specializationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="danger-zone">
                <div className="danger-zone-header">
                  <WarningOutlined style={{ fontSize: 20, color: "#ef4444" }} />
                  <div>
                    <h3>Danger Zone</h3>
                    <p>Irreversible actions that affect all data</p>
                  </div>
                </div>
                <button className="btn-danger-zone" onClick={handleDeleteAllData}>
                  <DeleteOutlined /> Delete All Data
                </button>
              </div>
            </>
          )}

          {activeTab === "users" && (
            <div className="admin-section">
              <h2>All Users</h2>
              {loading ? <TableSkeleton rows={5} cols={4} /> : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td>{u.fullName}</td>
                          <td>{u.email}</td>
                          <td>{u.phone || "-"}</td>
                          <td>
                            <span className={`badge badge-${u.type === "admin" ? "admin" : u.isdoctor ? "doctor" : "user"}`}>
                              {u.type === "admin" ? "Admin" : u.isdoctor ? "Doctor" : "User"}
                            </span>
                          </td>
                          <td>
                            {u.type !== "admin" && (
                              <button className="btn-delete" onClick={() => handleDeleteUser(u._id, u.fullName)}>
                                <DeleteOutlined /> Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "doctors" && (
            <div className="admin-section">
              <h2>All Doctor Applications</h2>
              {loading ? <TableSkeleton rows={5} cols={5} /> : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Specialization</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {doctors.map((doc) => (
                        <tr key={doc._id}>
                          <td>{/^dr\.?\s/i.test(doc.fullName) ? doc.fullName : `Dr. ${doc.fullName}`}</td>
                          <td>{doc.email}</td>
                          <td>{doc.specialization}</td>
                          <td><span className={`badge badge-${doc.status}`}>{doc.status}</span></td>
                          <td>
                            <div className="action-buttons">
                              {doc.status === "pending" && (
                                <>
                                  <button className="btn-approve" onClick={() => handleApprove(doc._id, doc.userId)}>
                                    <CheckCircleOutlined /> Approve
                                  </button>
                                  <button className="btn-reject" onClick={() => handleReject(doc._id, doc.userId)}>
                                    <CloseCircleOutlined /> Reject
                                  </button>
                                </>
                              )}
                              <button className="btn-delete" onClick={() => handleDeleteDoctor(doc._id, doc.fullName)}>
                                <DeleteOutlined /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="admin-section">
              <h2>All Appointments</h2>
              {loading ? <TableSkeleton rows={5} cols={4} /> : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {appointments.map((apt) => (
                        <tr key={apt._id}>
                          <td>{apt.userInfo?.fullName}</td>
                          <td>{/^dr\.?\s/i.test(apt.doctorInfo?.fullName) ? apt.doctorInfo?.fullName : `Dr. ${apt.doctorInfo?.fullName}`}</td>
                          <td>{new Date(apt.date).toLocaleDateString()}</td>
                          <td><span className={`badge badge-${apt.status}`}>{apt.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;