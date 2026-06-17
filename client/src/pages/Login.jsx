import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { MailOutlined, LockOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import { loginUser as apiLogin } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      message.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const res = await apiLogin({ email, password });
      const { token, user } = res.data.data;
      loginUser(token, user);
      message.success("Login successful");
      if (user.type === "admin") {
        navigate("/adminhome");
      } else if (user.isdoctor) {
        navigate("/doctordashboard");
      } else {
        navigate("/userhome");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="flex-center" style={{ marginBottom: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
              <MedicineBoxOutlined />
            </div>
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="page-subtitle">Enter your credentials to access your account</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Email address</label>
            <div style={{ position: "relative" }}>
              <MailOutlined style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit" }}
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Password</label>
            <div style={{ position: "relative" }}>
              <LockOutlined style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "15px", fontFamily: "inherit" }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", padding: "12px", marginTop: "8px", fontSize: "15px" }} disabled={loading}>
            {loading ? "Signing in..." : "Sign in to account"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "var(--text-muted)" }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: "500" }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;