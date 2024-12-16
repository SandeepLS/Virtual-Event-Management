const jwt = require("jsonwebtoken");

const validateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token missing or invalid" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log("Decoded Token:", decodedToken)

    // req.user = { id: decodedToken.id, role: decodedToken.role }; // Correctly attach user details
    req.user = decodedToken;
    next();  // Continue to the next middleware or route handler
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).send({ success: false, message: "Invalid or expired token" });
    // res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { validateJWT };
