const db = require("../../utils/db");

const ControllerException = require("../../utils/ControllerException");
const usersController = require("../users");

const users = [
  { name: "John", email: "johm@smith.com", password: "12345" },
  { name: "Jack", email: "jack@smith.com", password: "12346" },
  { name: "Jane", email: "jane@smith.com", password: "12347" },
  { name: "Inna", email: "inna@smith.com", password: "12348" },
];

beforeEach(async () => {
  await db.seed.run();
});

test("Can register user", async () => {
  const data = await usersController.register(users[0]);

  expect(data).toEqual(expect.any(Object));
  expect(data.userId).toEqual(expect.any(Number));
  expect(data.userId).toBeGreaterThan(0);
});

test("Can save all fields on register", async () => {
  const { userId } = await usersController.register(users[0]);
  const record = await usersController.getUserById({ userId });

  expect(record.name).toBe(users[0].name);
  expect(record.email).toBe(users[0].email);
  expect(record.role).toBe("user");
  expect(record.emailIsConfirmed).toBe(false);
});

test("Cannot register with same email twice", async () => {
  await usersController.register(users[0]);
  const result = await usersController.register(users[0]).catch((err) => err);

  expect(result).toEqual(expect.any(ControllerException));
  expect(result.exceptionCode).toBe("EMAIL_IN_USE");
});
