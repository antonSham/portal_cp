const jwt = require("jsonwebtoken");
const ControllerException = require("./ControllerException");

exports.sign = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: 60 * 60,
  });
};

exports.verify = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY).userId;
  } catch (error) {
    throw new ControllerException(
      "ACCESS_DENIED",
      "Malicious access token token"
    );
  }
};
