const { wrap } = require("async-middleware");
const usersController = require("../../controllers/users");
const { verify: verifyToken } = require("../../utils/token");

const matchRole = (role, targetRole) => {
  return (
    (role === "user" && targetRole === "user") ||
    (role === "editor" && (targetRole === "user" || targetRole === "editor")) ||
    (role === "admin" &&
      (targetRole === "user" ||
        targetRole === "editor" ||
        targetRole === "admin"))
  );
};

const auth = (targetRole) =>
  wrap(async (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = (authHeader.match(/^Bearer\s*(.*)$/) || [])[1];

    const userId = verifyToken(token);

    const user = await usersController.getUserById({ userId });
    if (!matchRole(user.role, targetRole)) {
      res.send({ success: false, code: "ACCESS_DENIED" });
      return;
    }

    req.user = user;
    next();
  });
module.exports = auth;
