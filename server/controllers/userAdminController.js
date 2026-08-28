const db = require("../config/db");

// ==============================
// GET ALL USERS (ADMIN)
// ==============================

const getAllUsers = async (req, res) => {
  try {
    const result = await db.query(`
    
    SELECT

    u.id,
    u.name,
    u.email,
    u.role,
    u.subscription_status,
    u.created_at,

    CASE
      WHEN EXISTS (
        SELECT 1
        FROM vip_section_subscriptions v
        WHERE v.user_id = u.id
        AND v.status = 'active'
        AND v.expiry_date > CURRENT_TIMESTAMP
      )
      THEN 'active'
      ELSE 'inactive'
    END AS vip_status


    FROM users u

    ORDER BY u.created_at DESC

    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);

    res.status(500).json({
      message: "Unable to retrieve users. Please try again later.",
    });
  }
};

// ==============================
// GET SINGLE USER DETAILS
// ==============================

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.subscription_status,
u.account_status,
u.created_at
      FROM users u
      WHERE u.id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("GET USER ERROR:", error);

    res.status(500).json({
      message: "Unable to retrieve user. Please try again later.",
    });
  }
};

// ==============================
// UPDATE USER ROLE
// ==============================

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;

    const { role } = req.body;

    if (Number(id) === req.user.id && role !== "admin") {
      return res.status(403).json({
        message: "You cannot remove your own admin access",
      });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const result = await db.query(
      `
      UPDATE users

      SET role=$1

      WHERE id=$2

      RETURNING id,name,email,role
      `,
      [role, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Role updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE USER ROLE ERROR:", error);

    res.status(500).json({
      message: "Unable to update user role. Please try again later.",
    });
  }
};

// ==============================
// UPDATE USER ACCOUNT STATUS
// ==============================

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { account_status } = req.body;

    if (!["active", "suspended"].includes(account_status)) {
      return res.status(400).json({
        message: "Invalid account status",
      });
    }

    const result = await db.query(
      `
      UPDATE users

      SET account_status=$1

      WHERE id=$2

      RETURNING id,name,email,account_status
      `,
      [account_status, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Account status updated successfully",

      user: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE USER STATUS ERROR:", error);

    res.status(500).json({
      message: "Unable to update account status. Please try again later.",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
};
