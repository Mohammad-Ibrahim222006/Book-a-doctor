import { useState, useEffect } from "react";
import { message, Tabs } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getNotifications, deleteNotifications } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  BellOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const Notification = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [seenNotifications, setSeenNotifications] = useState(user?.seennotification || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      setNotifications(res.data.data || []);
    } catch (error) {
      message.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteNotifications();
      message.success("All notifications cleared");
      setSeenNotifications((prev) => [...notifications, ...prev]);
      setNotifications([]);
    } catch (error) {
      message.error("Failed to delete notifications");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new-doctor-request":
        return <CheckCircleOutlined style={{ color: "#2563eb" }} />;
      case "doctor-approved":
        return <CheckCircleOutlined style={{ color: "#10b981" }} />;
      case "doctor-rejected":
        return <DeleteOutlined style={{ color: "#ef4444" }} />;
      case "new-appointment-request":
        return <BellOutlined style={{ color: "#f59e0b" }} />;
      case "appointment-booked":
        return <CheckCircleOutlined style={{ color: "#2563eb" }} />;
      case "appointment-status":
        return <CheckCircleOutlined style={{ color: "#10b981" }} />;
      default:
        return <BellOutlined style={{ color: "#64748b" }} />;
    }
  };

  return (
    <div className="main">
      <Sidebar role={user?.type === "admin" ? "admin" : user?.isdoctor ? "doctor" : "user"} />
      <div className="content">
        <Header notifications={notifications.length} />
        <div className="page-container">
          <div className="card">
            <div className="page-header flex-between" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "16px", marginBottom: "24px" }}>
              <div>
                <h2 className="page-title">Notifications</h2>
                <p className="page-subtitle" style={{ margin: 0 }}>Stay updated with your activities</p>
              </div>
              {notifications.length > 0 && (
                <button className="btn-danger-outline" style={{ padding: "8px 16px", borderRadius: "var(--radius-full)", border: "1px solid var(--danger)", color: "var(--danger)", background: "transparent", cursor: "pointer", fontWeight: "600" }} onClick={handleDeleteAll}>
                  <DeleteOutlined style={{ marginRight: "6px" }} /> Clear All
                </button>
              )}
            </div>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ display: "flex", gap: "16px", padding: "16px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "var(--radius-full)", background: "var(--bg)" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: "14px", background: "var(--bg)", borderRadius: "4px", width: "80%", marginBottom: "8px" }} />
                      <div style={{ height: "12px", background: "var(--bg)", borderRadius: "4px", width: "40%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Tabs
                defaultActiveKey="unread"
                items={[
                  {
                    key: "unread",
                    label: `Unread (${notifications.length})`,
                    children: (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
                        {notifications.length === 0 ? (
                          <div className="flex-center" style={{ flexDirection: "column", height: "200px" }}>
                            <BellOutlined style={{ fontSize: 48, color: "var(--text-light)", marginBottom: "16px" }} />
                            <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>No unread notifications</p>
                          </div>
                        ) : (
                          notifications.map((notif, index) => (
                            <div key={index} style={{ display: "flex", gap: "16px", padding: "16px", background: "var(--bg)", borderRadius: "var(--radius-md)", borderLeft: "4px solid var(--primary)", boxShadow: "var(--shadow-sm)" }}>
                              <div style={{ fontSize: "20px" }}>
                                {getNotificationIcon(notif.type)}
                              </div>
                              <div>
                                <p style={{ margin: "0 0 4px 0", color: "var(--text)", fontWeight: "500" }}>{notif.message}</p>
                                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                                  {new Date(notif.data?.createdAt || Date.now()).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    ),
                  },
                  {
                    key: "read",
                    label: `Read (${seenNotifications.length})`,
                    children: (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
                        {seenNotifications.length === 0 ? (
                          <div className="flex-center" style={{ flexDirection: "column", height: "200px" }}>
                            <CheckCircleOutlined style={{ fontSize: 48, color: "var(--text-light)", marginBottom: "16px" }} />
                            <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>No read notifications</p>
                          </div>
                        ) : (
                          seenNotifications.map((notif, index) => (
                            <div key={index} style={{ display: "flex", gap: "16px", padding: "16px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "transparent" }}>
                              <div style={{ fontSize: "20px", opacity: 0.6 }}>
                                {getNotificationIcon(notif.type)}
                              </div>
                              <div style={{ opacity: 0.8 }}>
                                <p style={{ margin: "0 0 4px 0", color: "var(--text)" }}>{notif.message}</p>
                                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                                  {new Date(notif.data?.createdAt || Date.now()).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;