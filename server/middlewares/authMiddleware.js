const jwt = require("jsonwebtoken");
const userModel = require("../schemas/userModel");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .send({ message: "Auth failed", success: false });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .send({ message: "Auth failed", success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .send({ message: "Auth failed", success: false });
    }

    req.userId = decoded.id;
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({ message: "Auth failed", success: false });
  }
};