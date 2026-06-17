const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const userModel = require("./schemas/userModel");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const existingAdmin = await userModel.findOne({ type: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists. Updating credentials...");
      const salt = await bcrypt.genSalt(10);
      const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
      const adminPassword = process.env.ADMIN_PASSWORD || "admin";
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      existingAdmin.email = adminEmail;
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log("Admin credentials updated successfully");
      console.log(`Email: ${adminEmail}`);
      console.log("Password: <from process.env.ADMIN_PASSWORD>");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin";
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const admin = new userModel({
      fullName: "Admin",
      email: adminEmail,
      password: hashedPassword,
      phone: "1234567890",
      isdoctor: false,
      type: "admin",
      notification: [],
      seennotification: [],
    });

    await admin.save();

    console.log("Admin user created successfully");
    console.log(`Email: ${adminEmail}`);
    console.log("Password: <from process.env.ADMIN_PASSWORD>");
    console.log("CHANGE THE PASSWORD AFTER FIRST LOGIN");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();