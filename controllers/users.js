const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

// register (any)
exports.register = async ({ name, email, password }) => {
  try {
    const [{ id: userId }] = await knex("users")
      .insert([{ name, email, password }])
      .returning("id");
    return { userId };
  } catch (error) {
    throw new ControllerException("EMAIL_IN_USE", "Email is already in use");
  }
};

// request email confirmation (user)
exports.requestEmailConfirmation = ({ userId }) => {
  const confirmationCode = "0000";
  // Write to database
    await knex(...)

  //Send email

  return {};
};

// confirm emall (any)
exports.confirmEmail = ({ userId, confirmationCode }) => {
  return {};
};

// login (any)
exports.login = ({ email, password }) => {
  return { userId };
};

// edit profile (user)
exports.editProfile = ({ userId, name, email, password }) => {
  return {};
};

// change role (admin)
exports.changeRole = ({ userId, role }) => {
  return {};
};
