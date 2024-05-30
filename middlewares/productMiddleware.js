const jwt = require("jsonwebtoken");

const productMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(403).send({ error: true, message: "No token provided" });
    }
  
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err.message);
        return res
          .status(401)
          .send({ status: "error", message: "Unauthorized access" });
      }
      req.role = decoded.role
      req.userId = decoded.id
      next();
    });
  };
  
  module.exports = productMiddleware;