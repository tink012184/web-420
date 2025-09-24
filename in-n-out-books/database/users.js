/**
 * Mock users database for authentication.
 * NOTE: Passwords are hashed using bcryptjs at load time for demo/testing.
 */
const bcrypt = require("bcryptjs");

const users = [
  {
    id: 1,
    email: "user1@example.com",
    // plaintext: secret123
    passwordHash: bcrypt.hashSync("secret123", 10),
  },
  {
    id: 2,
    email: "melissa@example.com",
    // plaintext: Password123!
    passwordHash: bcrypt.hashSync("Password123!", 10),
  },
];

module.exports = {
  findByEmail(email = "") {
    const target = String(email).trim().toLowerCase();
    return users.find((u) => u.email.toLowerCase() === target) || null;
  },
};
