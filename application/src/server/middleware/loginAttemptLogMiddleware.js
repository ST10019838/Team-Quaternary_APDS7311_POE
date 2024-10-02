import LoginAttempt from "../../models/LoginAttempt.js";

const loginAttemptLogger = async (req, res, next) => {
  const originalJson = req.json;
  res.json = function (data) {
    const username = req.body.username;
    const ipAddress = req.id || req.connection.remoteAddress;
    const successfulLogin =
      !data.message || data.message !== "Invalid credentials";

    LoginAttempt.create({ username, ipAddress, successfulLogin }).catch((err) =>
      console.error("Error logging login attempt:", err)
    );
    originalJson.call(this, data);
  };
  next();
};

export default loginAttemptLogger;
