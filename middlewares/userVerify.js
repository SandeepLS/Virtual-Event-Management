const jwt = require("jsonwebtoken");

const validateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token missing or invalid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    // console.log(req.user._id);
    next();
  } catch (err) {
    console.error(error);
    res.status(401).send({ success: false, message: "Invalid or expired token" });
    // res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { validateJWT };
