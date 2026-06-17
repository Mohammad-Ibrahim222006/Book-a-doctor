import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  MedicineBoxOutlined,
  MedicineBoxTwoTone,
  SolutionOutlined,
} from "@ant-design/icons";
import { registerUser, registerDocAndUser } from "../services/api";

const SPECIALIZATIONS = [
  "Cardiology",
  "Dentistry",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "General",
];

const Register = () => {
  const [role, setRole] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    specialization: "",
    experience: "",
    fees: "",
    timingsFrom: "",
    timingsTo: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      message.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      if (role === "doctor") {
        if (!form.phone || !form.address || !form.specialization || !form.experience || !form.fees || !form.timingsFrom || !form.timingsTo) {
          message.error("Please fill all required fields");
          setLoading(false);
          return;
        }
        await registerDocAndUser({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: form.address,
          specialization: form.specialization,
          experience: form.experience,
          fees: form.fees,
          timings: { from: form.timingsFrom, to: form.timingsTo },
        });
        message.success("Registration successful. Your application is pending approval.");
      } else {
        await registerUser({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          phone: form.phone,
        });
        message.success("Registration successful");
      }
      navigate("/login");
    } catch (error) {
      message.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ padding: "40px 20px" }}>
      <div className="auth-card" style={{ maxWidth: role === "doctor" ? "600px" : "440px", transition: "max-width 0.3s ease" }}>
        <div className="auth-header">
          <div className="flex-center" style={{ marginBottom: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
              <MedicineBoxOutlined />
            </div>
          </div>
          <h1 className="auth-title">Create an account</h1>
          <p className="page-subtitle">Join CareSync to get started</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "8px" }}>
            <div
              onClick={() => setRole("patient")}
              style={{
                border: role === "patient" ? "2px solid var(--primary)" : "1px solid var(--border)",
                background: role === "patient" ? "var(--primary-light)" : "var(--bg)",
                padding: "16px",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s"
              }}
            >
              <SolutionOutlined style={{ fontSize: 24, color: role === "patient" ? "var(--primary)" : "var(--text-muted)", marginBottom: "8px" }} />
              <div style={{ fontWeight: "600", fontSize: "15px", color: role === "patient" ? "var(--primary-dark)" : "var(--text)" }}>Patient</div>
            </div>
            <div
              onClick={() => setRole("doctor")}
              style={{
                border: role === "doctor" ? "2px solid var(--primary)" : "1px solid var(--border)",
                background: role === "doctor" ? "var(--primary-light)" : "var(--bg)",
                padding: "16px",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s"
              }}
            >
              <MedicineBoxTwoTone style={{ fontSize: 24, marginBottom: "8px" }} />
              <div style={{ fontWeight: "600", fontSize: "15px", color: role === "doctor" ? "var(--primary-dark)" : "var(--text)" }}>Doctor</div>
            </div>
          </div>

          {role && (
            <>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Full Name *</label>
                <div style={{ position: "relative" }}>
                  <UserOutlined style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit" }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Email address *</label>
                <div style={{ position: "relative" }}>
                  <MailOutlined style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Password *</label>
                <div style={{ position: "relative" }}>
                  <LockOutlined style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Phone *</label>
                <div style={{ position: "relative" }}>
                  <PhoneOutlined style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit" }}
                  />
                </div>
              </div>

              {role === "doctor" && (
                <>
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
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Specialization *</label>
                      <select
                        name="specialization"
                        value={form.specialization}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit", background: "var(--bg)" }}
                      >
                        <option value="">Select</option>
                        {SPECIALIZATIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
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
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Fees ($) *</label>
                      <input
                        type="number"
                        name="fees"
                        placeholder="Consultation fee"
                        value={form.fees}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit" }}
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px", whiteSpace: "nowrap" }}>From *</label>
                        <input
                          type="time"
                          name="timingsFrom"
                          value={form.timingsFrom}
                          onChange={handleChange}
                          style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px", whiteSpace: "nowrap" }}>To *</label>
                        <input
                          type="time"
                          name="timingsTo"
                          value={form.timingsTo}
                          onChange={handleChange}
                          style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit" }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <button type="submit" className="btn-primary" style={{ width: "100%", padding: "12px", marginTop: "8px", fontSize: "15px" }} disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </button>
            </>
          )}
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "var(--text-muted)" }}>
          Already have an account? <Link to="/login" style={{ fontWeight: "500" }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
