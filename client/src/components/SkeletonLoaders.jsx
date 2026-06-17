import { Skeleton } from "antd";

export const DashboardSkeleton = () => (
  <div className="dashboard-layout">
    <div className="sidebar skeleton-sidebar">
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0" }}>
        <Skeleton.Avatar active size={28} shape="square" />
      </div>
      <div style={{ padding: "16px 12px" }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} active paragraph={false} style={{ marginBottom: 12, padding: "14px 0" }} />
        ))}
      </div>
    </div>
    <div className="dashboard-main">
      <div style={{ height: 70, background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", padding: "0 32px", marginLeft: 260 }}>
        <Skeleton active paragraph={false} style={{ width: 200 }} />
      </div>
      <div style={{ padding: 32, marginTop: 70 }}>
        <Skeleton active paragraph={{ rows: 1 }} style={{ width: 300, marginBottom: 24 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 32 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} active paragraph={{ rows: 1 }} style={{ padding: 24, borderRadius: 12 }} />
          ))}
        </div>
        <Skeleton active paragraph={{ rows: 6 }} style={{ borderRadius: 12 }} />
      </div>
    </div>
  </div>
);

export const CardsSkeleton = ({ count = 4 }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <Skeleton.Avatar active size={56} />
          <div style={{ flex: 1 }}>
            <Skeleton active paragraph={false} style={{ width: "60%" }} />
            <Skeleton active paragraph={false} style={{ width: "40%", marginTop: 8 }} />
          </div>
        </div>
        {[1, 2, 3, 4].map((j) => (
          <Skeleton key={j} active paragraph={false} style={{ marginBottom: 12 }} />
        ))}
      </div>
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div style={{ background: "#fff", borderRadius: 12, padding: 24 }}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16, padding: "14px 0", borderBottom: "1px solid #e2e8f0" }}>
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} active paragraph={false} />
        ))}
      </div>
    ))}
  </div>
);

export const AppointmentSkeleton = ({ count = 3 }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 24 }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 12 }}>
          <Skeleton.Avatar active size={44} />
          <div style={{ flex: 1 }}>
            <Skeleton active paragraph={false} style={{ width: "50%" }} />
            <Skeleton active paragraph={false} style={{ width: "30%", marginTop: 8 }} />
          </div>
          <Skeleton.Button active style={{ width: 70, height: 24, borderRadius: 20 }} />
        </div>
        <div style={{ padding: "20px 24px" }}>
          {[1, 2, 3].map((j) => (
            <Skeleton key={j} active paragraph={false} style={{ marginBottom: 12 }} />
          ))}
        </div>
      </div>
    ))}
  </div>
);