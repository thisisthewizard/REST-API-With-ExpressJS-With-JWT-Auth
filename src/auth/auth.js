const JWT = require("jsonwebtoken");

require("dotenv").config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = JWT.verify(token, ACCESS_TOKEN);
    req.userData = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Your Token Is Invalid!!!" });
  }
};
