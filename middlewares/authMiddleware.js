const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).send({ error: true, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log(req.path);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .send({ status: "error", message: "Unauthorized access" });
    }
    if (decoded.role !== "admin") {
      return res.status(401).send({
        status: "error",
        message: "User is not authorized to perform this action",
      });
    }

    const deleteRouteRegex = /^\/delete\/([a-fA-F0-9]{24})$/;
    if (req.path === "/update"||deleteRouteRegex.test(req.path)) {
      if (decoded.role === "admin") {
        return res
          .status(403)
          .send({ status: "error", message: "Cannot modify admin user" });
      }
    }
    next();
  });
};

module.exports = authMiddleware;
