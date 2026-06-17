import { Spin } from "antd";

const Loader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f8fafc",
    }}
  >
    <Spin size="large" />
  </div>
);

export default Loader;