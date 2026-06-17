import { useAuth } from "../context/AuthContext";
import { Badge, Avatar, Dropdown, Space, Tag } from "antd";
import {
  BellOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Header = ({ notifications = 0 }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardTitle = () => {
    if (user?.type === "admin") return "Admin Dashboard";
    if (user?.isdoctor) return "Doctor Dashboard";
    return "User Dashboard";
  };

  const getRoleTag = () => {
    if (user?.type === "admin")
      return <Tag color="purple" style={{ marginLeft: 8 }}>Admin</Tag>;
    if (user?.isdoctor)
      return <Tag color="blue" style={{ marginLeft: 8 }}>Doctor</Tag>;
    return <Tag color="default" style={{ marginLeft: 8 }}>User</Tag>;
  };

  const items = [
    {
      key: "1",
      label: (
        <div style={{ padding: "4px 0" }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>
            {user?.fullName || "User"}
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>{user?.email}</div>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "2",
      label: "Notifications",
      icon: <BellOutlined />,
      onClick: () => navigate("/notifications"),
    },
    { type: "divider" },
    {
      key: "3",
      label: "Logout",
      icon: <LogoutOutlined style={{ color: "#ef4444" }} />,
      danger: true,
      onClick: () => {
        logout();
        navigate("/login");
      },
    },
  ];

  return (
    <div className="header glass-panel">
      <div className="header-left flex-start">
        <h2 style={{ margin: 0, color: "var(--text)", fontSize: "20px", fontWeight: "700" }}>
          {getDashboardTitle()}
        </h2>
        {getRoleTag()}
      </div>
      <div className="header-right flex-start" style={{ gap: "24px" }}>
        <Badge count={notifications} size="small">
          <div style={{ padding: "8px", background: "var(--bg)", borderRadius: "var(--radius-full)", display: "flex", cursor: "pointer" }} onClick={() => navigate("/notifications")}>
            <BellOutlined style={{ fontSize: 18, color: "var(--text-muted)" }} />
          </div>
        </Badge>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <Space style={{ cursor: "pointer", padding: "4px 12px 4px 4px", background: "var(--bg)", borderRadius: "var(--radius-full)", border: "1px solid var(--border)" }}>
            <div className="header-user-avatar">
              {user?.fullName?.charAt(0).toUpperCase() || <UserOutlined />}
            </div>
            <span style={{ fontWeight: "600", fontSize: "14px", color: "var(--text)" }}>{user?.fullName}</span>
            <DownOutlined style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: "4px" }} />
          </Space>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;