import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HomeOutlined,
  CalendarOutlined,
  BellOutlined,
  LogoutOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  AppstoreOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const userMenu = [
    { path: "/userhome", label: "Home", icon: <HomeOutlined /> },
    {
      path: "/userappointments",
      label: "Appointments",
      icon: <CalendarOutlined />,
    },
    {
      path: "/notifications",
      label: "Notifications",
      icon: <BellOutlined />,
    },
  ];

  const doctorMenu = [
    {
      path: "/doctordashboard",
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
    {
      path: "/notifications",
      label: "Notifications",
      icon: <BellOutlined />,
    },
  ];

  const adminMenu = [
    { path: "/adminhome", label: "Dashboard", icon: <AppstoreOutlined /> },
    {
      path: "/adminhome",
      label: "Users",
      icon: <TeamOutlined />,
      tab: "users",
    },
    {
      path: "/adminhome",
      label: "Doctors",
      icon: <MedicineBoxOutlined />,
      tab: "doctors",
    },
    {
      path: "/adminappointments",
      label: "Appointments",
      icon: <CalendarOutlined />,
    },
  ];

  let menu;
  switch (role) {
    case "admin":
      menu = adminMenu;
      break;
    case "doctor":
      menu = doctorMenu;
      break;
    default:
      menu = userMenu;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo flex-start">
          <MedicineBoxOutlined />
          <span>CareSync</span>
        </div>
      </div>
      <div className="menu">
        {menu.map((item, index) => (
          <div
            key={index}
            className={`menu-item ${
              location.pathname === item.path &&
              (item.tab
                ? location.search.includes(`tab=${item.tab}`)
                : !location.search)
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigate(item.tab ? `${item.path}?tab=${item.tab}` : item.path)
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
        <div style={{ marginTop: 'auto' }}>
          <div className="menu-item" style={{ color: 'var(--danger)' }} onClick={handleLogout}>
            <LogoutOutlined />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;