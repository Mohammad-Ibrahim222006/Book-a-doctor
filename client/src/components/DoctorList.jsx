import { useState } from "react";
import { Modal, Form, DatePicker, Upload, message, Input, Select } from "antd";
import { UploadOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { bookAppointment } from "../services/api";
import dayjs from "dayjs";

const specializations = [
  "All",
  "Cardiology",
  "Dentistry",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "General",
];

const DoctorList = ({ doctors }) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("All");

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterSpecialization === "All" ||
      doctor.specialization === filterSpecialization;
    return matchesSearch && matchesFilter;
  });

  const handleBookNow = (doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("userData"));

      const formData = new FormData();
      formData.append("doctorId", selectedDoctor._id);
      formData.append("date", values.date.format("DD-MM-YYYY"));
      formData.append(
        "userInfo",
        JSON.stringify({
          _id: userData._id,
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
        })
      );
      formData.append(
        "doctorInfo",
        JSON.stringify({
          _id: selectedDoctor._id,
          fullName: selectedDoctor.fullName,
          email: selectedDoctor.email,
          phone: selectedDoctor.phone,
          specialization: selectedDoctor.specialization,
          fees: selectedDoctor.fees,
        })
      );

      if (values.document && values.document.fileList[0]) {
        formData.append(
          "document",
          values.document.fileList[0].originFileObj
        );
      }

      await bookAppointment(formData);
      message.success("Appointment booked successfully");
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to book appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <Input
          placeholder="Search doctors by name, specialization, or location..."
          prefix={<SearchOutlined style={{ color: "var(--text-muted)", fontSize: "16px", marginRight: "8px" }} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: "10px 16px", borderRadius: "var(--radius-full)", border: "1px solid var(--border)", fontSize: "15px", boxShadow: "var(--shadow-sm)" }}
          allowClear
        />
        <Select
          value={filterSpecialization}
          onChange={setFilterSpecialization}
          style={{ width: "200px", height: "46px" }}
          suffixIcon={<FilterOutlined />}
        >
          {specializations.map((spec) => (
            <Select.Option key={spec} value={spec}>
              {spec}
            </Select.Option>
          ))}
        </Select>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="card flex-center" style={{ flexDirection: "column", height: "300px", textAlign: "center" }}>
          <SearchOutlined style={{ fontSize: 48, color: "var(--text-light)", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "600" }}>No Doctors Found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {filteredDoctors.map((doctor) => (
            <div key={doctor._id} className="card" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "24px" }}>
              <div className="flex-start" style={{ marginBottom: "20px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "var(--radius-full)", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "600", marginRight: "16px" }}>
                  {doctor.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: "var(--text)" }}>{/^dr\.?\s/i.test(doctor.fullName) ? doctor.fullName : `Dr. ${doctor.fullName}`}</h3>
                  <span style={{ fontSize: "14px", color: "var(--primary)", fontWeight: "500" }}>
                    {doctor.specialization}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px", flexGrow: 1 }}>
                <div className="flex-between">
                  <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Phone</span>
                  <span style={{ fontWeight: "500", fontSize: "14px" }}>{doctor.phone}</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Experience</span>
                  <span style={{ fontWeight: "500", fontSize: "14px" }}>{typeof doctor.experience === 'string' ? doctor.experience.replace(/\s*years?\s*$/i, '') : doctor.experience} years</span>
                </div>
                <div className="flex-between">
                  <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Timings</span>
                  <span style={{ fontWeight: "500", fontSize: "14px" }}>{doctor.timings?.from} - {doctor.timings?.to}</span>
                </div>
                <div className="flex-between" style={{ marginTop: "8px", paddingTop: "12px", borderTop: "1px dashed var(--border)" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Consultation Fee</span>
                  <span style={{ fontWeight: "700", fontSize: "18px", color: "var(--text)" }}>${doctor.fees}</span>
                </div>
              </div>
              <button
                className="btn-primary"
                style={{ width: "100%", padding: "12px" }}
                onClick={() => handleBookNow(doctor)}
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={
          <span style={{ fontWeight: 600, color: "#0f172a" }}>
            Book Appointment with Dr. {selectedDoctor?.fullName}
          </span>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            name="date"
            label="Select Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>
          <Form.Item name="document" label="Upload Medical Document">
            <Upload beforeUpload={() => false} maxCount={1}>
              <button type="button" className="btn-upload">
                <UploadOutlined /> Select File
              </button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DoctorList;