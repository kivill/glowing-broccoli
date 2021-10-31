db.createUser({
  user: "user",
  pwd: "2665640",
  roles: [
    {
      role: "readWrite",
      db: "cheboksary",
    },
  ],
});
db = new Mongo().getDB("cheboksary");
db.createCollection("users", { capped: false });
db.users.insert({
  roles: ["admin"],
  verified: true,
  loginAttempts: 0,
  fullName: "Админ",
  email: "admin@mail.com",
  password: "$2b$10$.J/a6C9cWHUUQDk7TZw3GOY/tgaKurHrf3ztmkXKv2lJ1oaqAfL1.",
  verification: "2ff08a22-5666-4d2e-a970-e9c53aa8f59a",
});
db.users.insert({
  roles: ["municipality"],
  verified: true,
  loginAttempts: 0,
  fullName: "Работник муниципалитета",
  email: "municipality@mail.com",
  password: "$2b$10$.J/a6C9cWHUUQDk7TZw3GOY/tgaKurHrf3ztmkXKv2lJ1oaqAfL1.",
  verification: "2ff08a22-5666-4d2e-a970-e9c53aa8f59a",
});
db.users.insert({
  roles: ["user"],
  verified: true,
  loginAttempts: 0,
  fullName: "Пользователь",
  email: "user@mail.com",
  password: "$2b$10$.J/a6C9cWHUUQDk7TZw3GOY/tgaKurHrf3ztmkXKv2lJ1oaqAfL1.",
  verification: "2ff08a22-5666-4d2e-a970-e9c53aa8f59a",
});
