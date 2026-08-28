const db = require("../config/db");

// =================================
// CREATE PREDICTION
// =================================

const createPrediction = async (
  home_team,
  away_team,
  league,
  prediction_type,
  prediction,
  odds,
  confidence,
  tip_category,
  section_id,
  match_date,
) => {
  const result = await db.query(
    `
    INSERT INTO predictions
    (
      home_team,
      away_team,
      league,
      prediction_type,
      prediction,
      odds,
      confidence,
      tip_category,
      section_id,
      match_date
    )

    VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)

    RETURNING *
    `,
    [
      home_team,
      away_team,
      league,
      prediction_type,
      prediction,
      odds,
      confidence,
      tip_category,
      section_id,
      match_date,
    ],
  );

  return result.rows[0];
};

// =================================
// GET ALL PREDICTIONS
// =================================

const getPredictions = async () => {
  const result = await db.query(
    `
    SELECT 
      p.*,
      s.name AS tip_section

    FROM predictions p

    LEFT JOIN sections s
    ON p.section_id = s.id

    ORDER BY p.match_date ASC
    `,
  );

  return result.rows;
};

// =================================
// UPDATE PREDICTION
// =================================

const updatePrediction = async (id, status, prediction, odds, confidence) => {
  const result = await db.query(
    `
    UPDATE predictions

    SET
      status=$1,
      prediction=$2,
      odds=$3,
      confidence=$4

    WHERE id=$5

    RETURNING *
    `,
    [status, prediction, odds, confidence, id],
  );

  return result.rows[0];
};
// =================================
// UPDATE STATUS ONLY
// =================================

const updatePredictionStatus = async (id, status) => {
  const result = await db.query(
    `
    UPDATE predictions

    SET status=$1

    WHERE id=$2

    RETURNING *
    `,
    [status, id],
  );

  return result.rows[0];
};

// =================================
// DELETE PREDICTION
// =================================

const deletePrediction = async (id) => {
  const result = await db.query(
    `
    DELETE FROM predictions
    WHERE id=$1

    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

// =================================
// GET FREE PREDICTIONS
// =================================

const getFreePredictions = async (dateFilter) => {
  let dateCondition = "CURRENT_DATE";

  if (dateFilter === "yesterday") {
    dateCondition = "CURRENT_DATE - INTERVAL '1 day'";
  }

  if (dateFilter === "tomorrow") {
    dateCondition = "CURRENT_DATE + INTERVAL '1 day'";
  }

  const result = await db.query(
    `
    SELECT 
      p.*,
      s.name AS tip_section

    FROM predictions p

    LEFT JOIN sections s
    ON p.section_id = s.id

    WHERE p.tip_category='FREE'

    AND p.match_date::date = ${dateCondition}

    ORDER BY p.match_date ASC
    `,
  );

  return result.rows;
};

// =================================
// GET ALL VIP PREDICTIONS
// =================================

const getVipPredictions = async () => {
  const result = await db.query(
    `
    SELECT *
    FROM predictions
    WHERE tip_category='VIP'
    ORDER BY created_at DESC
    `,
  );

  return result.rows;
};

// =================================
// GET VIP PREDICTIONS BY SECTION
// =================================

const getVipPredictionsBySection = async (section_id, dateFilter) => {
  let dateCondition = "CURRENT_DATE";

  if (dateFilter === "yesterday") {
    dateCondition = "CURRENT_DATE - INTERVAL '1 day'";
  }

  if (dateFilter === "tomorrow") {
    dateCondition = "CURRENT_DATE + INTERVAL '1 day'";
  }

  const result = await db.query(
    `
    SELECT 
      p.*,
      s.name AS tip_section

    FROM predictions p

    JOIN sections s
    ON p.section_id = s.id

    WHERE p.tip_category='VIP'

    AND p.section_id=$1

    AND p.match_date::date = ${dateCondition}

    ORDER BY p.match_date ASC
    `,
    [section_id],
  );

  return result.rows;
};

// =================================
// EXPORTS
// =================================

module.exports = {
  createPrediction,

  getPredictions,

  updatePrediction,

  updatePredictionStatus,

  deletePrediction,

  getFreePredictions,

  getVipPredictions,

  getVipPredictionsBySection,
};
