const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

// register (any)
exports.register = async ({ name, email, password }) => {
  try {
    // TODO: Hash password
    const [{ id: userId }] = await knex("users")
      .insert([{ name, email, password }])
      .returning("id");
    return { userId };
  } catch (error) {
    throw new ControllerException("EMAIL_IN_USE", "Email is already in use");
  }
};

// request email confirmation (user)
exports.requestEmailConfirmation = async ({ userId }) => {
  // TODO: Generate confirmation code
  const confirmationCode = "0000";
  const [record] = await knex("users")
    .select("email_is_confirmed as emailIsConfirmed")
    .where({ id: userId });

  if (!record) {
    throw new ControllerException("NOT_FOUND", "User has not been found");
  }

  if (record.emailIsConfirmed) {
    throw new ControllerException(
      "ALREADY_CONFIRMED",
      "User has already confirmed their email"
    );
  }

  await knex("users")
    .update({ email_confirmation_code: confirmationCode })
    .where({ id: userId });

  // TODO: Send email

  return {};
};

// confirm emall (any)
exports.confirmEmail = async ({ userId, confirmationCode }) => {
  const [record] = await knex("users")
    .select(
      "email_is_confirmed as emailIsConfirmed",
      "email_confirmation_code as emailConfirmationCode"
    )
    .where({ id: userId });

  if (
    !record ||
    record.emailConfirmationCode === null ||
    record.emailIsConfirmed ||
    record.emailConfirmationCode !== confirmationCode
  ) {
    throw new ControllerException(
      "FORBIDDEN",
      "Wrong userId or confirmationCode"
    );
  }

  await knex("users")
    .update({ email_is_confirmed: true, email_confirmation_code: null })
    .where({ id: userId });

  return {};
};

// login (any)
exports.login = async ({ email, password }) => {
  // TODO: Hash password
  const [record] = await knex("users").select("id").where({ email, password });

  if (!record) {
    throw new ControllerException("WRONG_CREDENTIALS", "Wrong credentials");
  }

  return { userId: record.id };
};

// edit profile (user)
exports.editProfile = async ({ userId, name, email, password }) => {
  const [record] = await knex("users")
    .select("id", "name", "email", "password")
    .where({ id: userId });

  if (!record) {
    throw new ControllerException("NOT_FOUND", "User has not been found");
  }

  const patch = {};
  if (name) patch.name = name;
  if (email) {
    patch.email = email;
    patch.email_is_confirmed = false;
    // TODO: Generate confirmation code
    patch.email_confirmation_code = "0000";
  }
  // TODO: Hash password
  if (password) patch.password = password;

  await knex("users").update(patch).where({ id: userId });

  return {};
};

// change role (admin)
exports.changeRole = async ({ userId, role }) => {
  const [record] = await knex("users").select("id").where({ id: userId });

  if (!record) {
    throw new ControllerException("NOT_FOUND", "User has not been found");
  }

  await knex("users").update({ role }).where({ id: userId });

  return {};
};

exports.getUserById = async ({ userId }) => {
  const [record] = await knex("users")
    .select(
      "id",
      "name",
      "email",
      "role",
      "email_is_confirmed as emailIsConfirmed"
    )
    .where({ id: userId });

  return record;
};
