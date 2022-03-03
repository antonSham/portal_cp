exports.seed = async function (knex) {
  await knex("issues").del();
  await knex("users").del();
  await knex("photo_galleries").del();

  await knex("photo_galleries").insert([{ id: 1 }]);

  await knex("users").insert([
    {
      id: 1,
      name: "Anton",
      email: "anton.shamyshev@yandex.ru",
      email_is_confirmed: true,
      password: "123456",
      role: "admin",
    },
  ]);

  await knex("issues").insert([
    {
      name: "Яма на чайковского",
      description: "Позор!!!!",
      author_id: 1,
      latitude: 56.127091238588704,
      longitude: 40.36092664927273,
      photo_gallery_id: 1,
      category: "road",
    },
  ]);
};
