const predictionModel = require("../models/predictionModel");
const db = require("../config/db");

// =================================
// ADD PREDICTION (ADMIN)
// =================================

const addPrediction = async (req, res) => {
  try {
    const {
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
    } = req.body;

    if (
      !home_team ||
      !away_team ||
      !prediction ||
      !tip_category ||
      !section_id
    ) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const sectionCheck = await db.query(
      `
      SELECT *
      FROM sections
      WHERE id=$1
      `,
      [section_id],
    );

    if (sectionCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    const newPrediction = await predictionModel.createPrediction(
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
    );

    res.status(201).json({
      message: "Prediction added successfully",
      prediction: newPrediction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// GET ALL PREDICTIONS
// =================================

const getPredictions = async (req, res) => {
  try {
    const predictions = await predictionModel.getPredictions();

    res.status(200).json(predictions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// GET FREE PREDICTIONS
// =================================

const getFreePredictions = async (req, res) => {
  try {
    const { date } = req.query;

    const predictions = await predictionModel.getFreePredictions(date);

    res.status(200).json(predictions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// GET VIP PREDICTIONS BY SECTION ID
// =================================

const getVipPredictions = async (req, res) => {
  try {
    const { section_id } = req.params;

    const { date } = req.query;

    const predictions = await predictionModel.getVipPredictionsBySection(
      section_id,
      date,
    );

    res.status(200).json(predictions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// =================================
// UPDATE PREDICTION
// =================================

const updatePrediction = async (req, res) => {
  try {
    const { status, prediction, odds, confidence } = req.body;

    const updatedPrediction = await predictionModel.updatePrediction(
      req.params.id,
      status,
      prediction,
      odds,
      confidence,
    );

    res.status(200).json({
      message: "Prediction updated successfully",

      prediction: updatedPrediction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// UPDATE PREDICTION STATUS
// =================================

const updatePredictionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedPrediction = await predictionModel.updatePredictionStatus(
      req.params.id,
      status,
    );

    res.status(200).json({
      message: "Prediction status updated successfully",

      prediction: updatedPrediction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// DELETE PREDICTION
// =================================

const deletePrediction = async (req, res) => {
  try {
    const deletedPrediction = await predictionModel.deletePrediction(
      req.params.id,
    );

    res.status(200).json({
      message: "Prediction deleted successfully",

      prediction: deletedPrediction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =================================
// EXPORTS
// =================================

module.exports = {
  addPrediction,

  getPredictions,

  getFreePredictions,

  getVipPredictions,

  updatePrediction,

  updatePredictionStatus,

  deletePrediction,
};
