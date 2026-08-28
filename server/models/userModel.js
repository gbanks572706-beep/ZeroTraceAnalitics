const db = require("../config/db");

// Create new user
const createUser = async (name, email, password) => {
  const result = await db.query(
    `INSERT INTO users (name, email, password)
         VALUES ($1, $2, $3)
         RETURNING *`,
    [name, email, password],
  );

  return result.rows[0];
};

// Find user by email
const findUserByEmail = async (email) => {
  const result = await db.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  return result.rows[0];
};

// Find user by ID
const findUserById = async (id) => {
  const result = await db.query(
    `SELECT id, name, email, role, subscription_status, account_status
     FROM users
     WHERE id = $1`,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
