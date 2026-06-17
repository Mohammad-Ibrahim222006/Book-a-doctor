import { useState, useEffect } from "react";
import { message } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { DashboardSkeleton } from "../components/SkeletonLoaders";
import { registerDoctor, getDocsForUser, getNotifications } from "../services/api";

const ApplyDoctor = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    specialization: "",
    experience: "",
    fees: "",
    timings: { from: "", to: "" },
  });
  const [loading, setLoading] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchExistingApplication();
    fetchNotifications();
  }, []);

  const fetchExistingApplication = async () => {
    try {
      const res = await getDocsForUser();
      if (res.data.data) {
        setExistingApplication(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "timingsFrom" || name === "timingsTo") {
      setForm({
        ...form,
        timings: { ...form.timings, [name === "timingsFrom" ? "from" : "to"]: value },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.address || !form.specialization || !form.experience || !form.fees || !form.timings.from || !form.timings.to) {
      message.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      await registerDoctor(form);
      message.success("Application submitted successfully");
      fetchExistingApplication();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <DashboardSkeleton />;
  }

  if (existingApplication) {
    return (
      <div className="main">
        <Sidebar role="user" />
        <div className="content">
          <Header notifications={notifications.length} />
          <div className="page-container">
            <div className="page-header">
              <h2 className="page-title">Application Status</h2>
              <p className="page-subtitle">Track your doctor application</p>
            </div>
            <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
              <div className="flex-between" style={{ marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
                <h3 style={{ margin: 0, fontSize: "18px" }}>Current Status</h3>
                <div className={`badge badge-${existingApplication.status}`} style={{ fontSize: "14px", padding: "6px 12px" }}>
                  {existingApplication.status.toUpperCase()}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="flex-between">
                  <span style={{ color: "var(--text-muted)" }}>Full Name</span>
                  <span style={{ fontWeight: "500" }}>{existingApplication.fullName}</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: "var(--text-muted)" }}>Email</span>
                  <span style={{ fontWeight: "500" }}>{existingApplication.email}</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: "var(--text-muted)" }}>Phone</span>
                  <span style={{ fontWeight: "500" }}>{existingApplication.phone}</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: "var(--text-muted)" }}>Specialization</span>
                  <span style={{ fontWeight: "500", color: "var(--primary)" }}>{existingApplication.specialization}</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: "var(--text-muted)" }}>Experience</span>
                  <span style={{ fontWeight: "500" }}>{typeof existingApplication.experience === 'string' ? existingApplication.experience.replace(/\s*years?\s*$/i, '') : existingApplication.experience} years</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: "var(--text-muted)" }}>Consultation Fee</span>
                  <span style={{ fontWeight: "600" }}>${existingApplication.fees}</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: "var(--text-muted)" }}>Timings</span>
                  <span style={{ fontWeight: "500" }}>{existingApplication.timings?.from} - {existingApplication.timings?.to}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <Sidebar role="user" />
      <div className="content">
        <Header notifications={notifications.length} />
        <div className="page-container">
          <div className="page-header">
            <h2 className="page-title">Apply as a Doctor</h2>
            <p className="page-subtitle">Fill in your details to join CareSync</p>
          </div>
          <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Phone *</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Specialization *</label>
                  <select name="specialization" value={form.specialization} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit", background: "var(--bg)" }}>
                    <option value="">Select Specialization</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dentistry">Dentistry</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Clinic Address *</label>
                <input
                  type="text"
                  name="address"
                  placeholder="123 Medical Center Blvd"
                  value={form.address}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Experience (yrs) *</label>
                  <input
                    type="number"
                    name="experience"
                    placeholder="Years"
                    value={form.experience}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Consultation Fees ($) *</label>
                  <input
                    type="number"
                    name="fees"
                    placeholder="Amount"
                    value={form.fees}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Available From *</label>
                  <input
                    type="time"
                    name="timingsFrom"
                    value={form.timings.from}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Available To *</label>
                  <input
                    type="time"
                    name="timingsTo"
                    value={form.timings.to}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit" }}
                  />
                </div>
              </div>

              <div style={{ marginTop: "16px", paddingTop: "24px", borderTop: "1px solid var(--border)", textAlign: "right" }}>
                <button type="submit" className="btn-primary" style={{ padding: "12px 24px" }} disabled={loading}>
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyDoctor;