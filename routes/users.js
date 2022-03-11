const express = require("express");
const { wrap } = require("async-middleware");
const { body } = require("express-validator");
const usersController = require("../controllers/users");
const { sign: signToken } = require("../utils/token");
const auth = require("./middelwares/auth");
const validate = require("./middelwares/validate");

const router = express.Router();

router.post(
  "/signup",
  wrap(async (req, res) => {
    const { name, email, password } = req.body;
    const { userId } = await usersController.register({
      name,
      email,
      password,
    });

    const token = signToken(userId);

    res.send({ success: true, token });
  })
);

router.post(
  "/email/confirm/request",
  auth("user"),
  wrap(async (req, res) => {
    await usersController.requestEmailConfirmation({ userId: req.user.id });
    res.send({ success: true });
  })
);

router.get(
  "/email/confirm",
  wrap(async (req, res) => {
    const { user, code } = req.query;
    await usersController.requestEmailConfirmation({
      userId: user,
      confirmationCode: code,
    });
    res.send({ success: true });
  })
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").isString(),
  validate(),
  wrap(async (req, res) => {
    const { email, password } = req.body;
    const { userId, userRole } = await usersController.login({
      email,
      password,
    });

    const token = signToken(userId);
    res.send({ success: true, token, role: userRole });
  })
);

router.post(
  "/profile/edit",
  auth("user"),
  wrap(async (req, res) => {
    const { name, email, password } = req.body;
    await usersController.editProfile({
      userId: req.user.id,
      name,
      email,
      password,
    });

    res.send({ success: true });
  })
);

router.post(
  "/role/change",
  auth("admin"),
  body("userId").isNumeric(),
  body("role").custom(
    (value) => ["user", "editor", "admin"].indexOf(value) >= 0
  ),
  validate(),
  wrap(async (req, res) => {
    const { userId, role } = req.body;
    await usersController.changeRole({ userId, role });

    res.send({ success: true });
  })
);

router.get(
  "/one/:id",
  wrap(async (req, res) => {
    const { id } = req.params;
    const user = await usersController.getUserById({ userId: id });

    res.send({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    });
  })
);

router.get(
  "/list",
  auth("admin"),
  wrap(async (req, res) => {
    const { limit, offset } = req.params;
    const users = await usersController.getUserById({
      limit: +limit || 10,
      offset: +offset || 0,
    });

    res.send({
      success: true,
      users,
      limit,
      offset,
    });
  })
);

module.exports = router;
