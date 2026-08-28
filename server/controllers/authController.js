const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userModel = require("../models/userModel");
const subscriptionModel = require("../models/subscriptionModel");

// =================================
// REGISTER USER
// =================================

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user

    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user

    const user = await userModel.createUser(name, email, hashedPassword);

    res.status(201).json({
      message: "User registered successfully",

      user: {
        id: user.id,

        name: user.name,

        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Registration failed. Please try again later.",
    });
  }
};

// =================================
// LOGIN USER
// =================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user

    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Compare password

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // =================================
    // CHECK ACCOUNT STATUS
    // =================================

    if (user.account_status === "suspended") {
      return res.status(403).json({
        message: "Your account has been suspended",
      });
    }

    // Create JWT Token

    const token = jwt.sign(
      {
        id: user.id,

        email: user.email,

        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      },
    );

    // =================================
    // GET USER VIP SUBSCRIPTIONS
    // =================================

    const vipSections = await subscriptionModel.getUserVipSections(user.id);

    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,

        vip_status: vipSections.length > 0 ? "active" : "inactive",

        vip_sections: vipSections,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Login failed. Please try again later.",
    });
  }
};

module.exports = {
  registerUser,

  loginUser,
};
