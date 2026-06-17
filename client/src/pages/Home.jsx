import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";
import {
  HeartOutlined,
  SmileOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
  StarFilled,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const Home = () => {
  const stats = [
    { number: "1000+", label: "Expert Doctors", icon: <TeamOutlined /> },
    { number: "5000+", label: "Happy Patients", icon: <SmileOutlined /> },
    { number: "10000+", label: "Appointments", icon: <ClockCircleOutlined /> },
    { number: "50+", label: "Specializations", icon: <HeartOutlined /> },
  ];

  const services = [
    {
      title: "Cardiology",
      desc: "Expert heart care with advanced diagnostics and treatment.",
      icon: <HeartOutlined />,
      color: "#ef4444",
    },
    {
      title: "Dentistry",
      desc: "Complete dental care from routine checkups to surgery.",
      icon: <MedicineBoxOutlined />,
      color: "#3b82f6",
    },
    {
      title: "Neurology",
      desc: "Specialized care for brain and nervous system disorders.",
      icon: <MedicineBoxOutlined />,
      color: "#8b5cf6",
    },
    {
      title: "Orthopedics",
      desc: "Bone and joint care with modern treatment methods.",
      icon: <MedicineBoxOutlined />,
      color: "#f59e0b",
    },
    {
      title: "Pediatrics",
      desc: "Comprehensive healthcare for children of all ages.",
      icon: <SmileOutlined />,
      color: "#10b981",
    },
    {
      title: "Dermatology",
      desc: "Advanced skin care treatments and cosmetic procedures.",
      icon: <MedicineBoxOutlined />,
      color: "#ec4899",
    },
  ];



  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "var(--font-family)" }}>
      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 100, background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "var(--primary)" }}>
            <MedicineBoxOutlined style={{ fontSize: "28px" }} />
            <span style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px" }}>CareSync</span>
          </Link>
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "24px" }}>
              <a href="#services" style={{ color: "var(--text-muted)", textDecoration: "none", fontWeight: "500", fontSize: "15px" }}>Services</a>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <Link to="/login" style={{ padding: "8px 20px", color: "var(--text)", textDecoration: "none", fontWeight: "600", fontSize: "15px" }}>Log In</Link>
              <Link to="/register" className="btn-primary" style={{ padding: "8px 20px", borderRadius: "var(--radius-full)", textDecoration: "none", fontSize: "15px" }}>Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: "140px", paddingBottom: "100px", maxWidth: "1200px", margin: "0 auto", paddingInline: "24px", display: "flex", alignItems: "center", gap: "60px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "inline-block", padding: "6px 16px", background: "var(--primary-light)", color: "var(--primary)", borderRadius: "var(--radius-full)", fontWeight: "600", fontSize: "14px", marginBottom: "24px" }}>
            The New Standard of Healthcare
          </div>
          <h1 style={{ fontSize: "56px", fontWeight: "800", lineHeight: 1.1, color: "var(--text)", marginBottom: "24px", letterSpacing: "-1.5px" }}>
            Your Health,<br />
            <span style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Reimagined.</span>
          </h1>
          <p style={{ fontSize: "20px", color: "var(--text-muted)", marginBottom: "40px", lineHeight: 1.6, maxWidth: "480px" }}>
            Connect with top-tier medical professionals instantly. Experience seamless care, wherever you are.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <Link to="/register" className="btn-primary" style={{ padding: "16px 32px", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
              Book a Consultation <ArrowRightOutlined />
            </Link>
          </div>
          <div style={{ display: "flex", gap: "32px", marginTop: "60px", padding: "32px 0", borderTop: "1px solid var(--border)" }}>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "var(--text)" }}>10k+</div>
              <div style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: "500" }}>Active Patients</div>
            </div>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "var(--text)" }}>500+</div>
              <div style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: "500" }}>Verified Specialists</div>
            </div>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "var(--text)" }}>4.9/5</div>
              <div style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: "500" }}>Average Rating</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ width: "100%", paddingTop: "100%", background: "var(--primary-light)", borderRadius: "var(--radius-lg)", position: "relative", overflow: "hidden" }}>
             <img src={heroImg} alt="Doctor" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius-lg)" }} />
          </div>
          <div className="card" style={{ position: "absolute", bottom: "-20px", left: "-20px", padding: "20px", display: "flex", gap: "16px", alignItems: "center", boxShadow: "var(--shadow-lg)" }}>
            <div style={{ width: "48px", height: "48px", background: "var(--success)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "24px" }}>
              <SafetyCertificateOutlined />
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "16px", color: "var(--text)" }}>Certified Care</div>
              <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>Top 1% of doctors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{ padding: "100px 24px", background: "var(--surface)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{ fontSize: "40px", fontWeight: "800", color: "var(--text)", marginBottom: "16px", letterSpacing: "-1px" }}>Comprehensive Care Services</h2>
            <p style={{ fontSize: "18px", color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto" }}>Explore our wide range of medical specialties designed to provide you with the best possible treatment.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
            {services.map((service, index) => (
              <div key={index} className="card" style={{ display: "flex", flexDirection: "column", gap: "20px", transition: "transform 0.2s", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: `${service.color}15`, color: service.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" }}>
                  {service.icon}
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>{service.title}</h3>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "120px 24px", background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)", color: "white", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "48px", fontWeight: "800", marginBottom: "24px", letterSpacing: "-1px" }}>Ready to prioritize your health?</h2>
          <p style={{ fontSize: "20px", opacity: 0.9, marginBottom: "40px", lineHeight: 1.6 }}>Join thousands of patients who have already experienced the future of healthcare. It only takes 2 minutes to get started.</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <Link to="/register" style={{ padding: "16px 32px", fontSize: "16px", background: "white", color: "var(--primary)", borderRadius: "var(--radius-full)", fontWeight: "700", textDecoration: "none" }}>Create an Account</Link>
            <Link to="/login" style={{ padding: "16px 32px", fontSize: "16px", background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "white", borderRadius: "var(--radius-full)", fontWeight: "600", textDecoration: "none" }}>Log In</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "80px 24px 40px", background: "#0f172a", color: "#94a3b8" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr", gap: "60px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "60px", marginBottom: "40px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "white", marginBottom: "20px" }}>
              <MedicineBoxOutlined style={{ fontSize: "28px", color: "var(--primary)" }} />
              <span style={{ fontSize: "20px", fontWeight: "800" }}>CareSync</span>
            </div>
            <p style={{ lineHeight: 1.6, maxWidth: "300px" }}>Delivering premium healthcare services directly to you. Accessible, reliable, and advanced.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h4 style={{ color: "white", fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>Company</h4>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>About Us</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Careers</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Press</a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h4 style={{ color: "white", fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>Support</h4>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Help Center</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h4 style={{ color: "white", fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>Contact</h4>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><PhoneOutlined /> +1 (800) 123-4567</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><MailOutlined /> support@caresync.com</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><EnvironmentOutlined /> 100 Innovation Way, Tech City</div>
          </div>
        </div>
        <div style={{ textAlign: "center", fontSize: "14px" }}>
          &copy; 2026 CareSync Technologies. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;