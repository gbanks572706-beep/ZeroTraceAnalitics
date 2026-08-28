const db = require("../config/db");

// ==============================
// GET ALL SECTIONS
// ==============================

const getSections = async () => {
  const result = await db.query(`
    SELECT *
    FROM sections
    ORDER BY category, name
  `);

  return result.rows;
};

// ==============================
// GET SECTIONS BY CATEGORY
// ==============================

const getSectionsByCategory = async (category) => {
  const result = await db.query(
    `
    SELECT *
    FROM sections
    WHERE category = $1
    AND status = 'active'
    ORDER BY name
    `,
    [category],
  );

  return result.rows;
};

// ==============================
// CREATE SECTION
// ==============================

const createSection = async (name, category, status) => {
  const result = await db.query(
    `
    INSERT INTO sections
    (
      name,
      category,
      status
    )

    VALUES
    ($1,$2,$3)

    RETURNING *
    `,
    [name, category, status],
  );

  return result.rows[0];
};

// ==============================
// UPDATE SECTION
// ==============================

const updateSection = async (id, name, category, status) => {
  const result = await db.query(
    `
    UPDATE sections

    SET
      name=$1,
      category=$2,
      status=$3

    WHERE id=$4

    RETURNING *
    `,
    [name, category, status, id],
  );

  return result.rows[0];
};

// ==============================
// DELETE SECTION
// ==============================

const deleteSection = async (id) => {
  const result = await db.query(
    `
    DELETE FROM sections

    WHERE id=$1

    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  getSections,

  getSectionsByCategory,

  createSection,

  updateSection,

  deleteSection,
};
