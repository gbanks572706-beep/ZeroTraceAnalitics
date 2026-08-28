const sectionModel = require("../models/sectionModel");

// ==============================
// GET ALL SECTIONS
// ==============================

const getSections = async (req, res) => {
  try {
    const sections = await sectionModel.getSections();

    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// GET SECTIONS BY CATEGORY
// ==============================

const getSectionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const sections = await sectionModel.getSectionsByCategory(category);

    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// CREATE SECTION
// ==============================

const createSection = async (req, res) => {
  try {
    const { name, category, status } = req.body;

    const section = await sectionModel.createSection(name, category, status);

    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// UPDATE SECTION
// ==============================

const updateSection = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, category, status } = req.body;

    const section = await sectionModel.updateSection(
      id,
      name,
      category,
      status,
    );

    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// DELETE SECTION
// ==============================

const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await sectionModel.deleteSection(id);

    res.status(200).json({
      message: "Section deleted successfully",

      section,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSections,

  getSectionsByCategory,

  createSection,

  updateSection,

  deleteSection,
};
