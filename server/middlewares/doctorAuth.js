module.exports = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .send({ message: "Auth failed", success: false });
    }

    if (!req.user.isdoctor) {
      return res
        .status(403)
        .send({ message: "Doctor access required", success: false });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(403).send({ message: "Doctor access required", success: false });
  }
};