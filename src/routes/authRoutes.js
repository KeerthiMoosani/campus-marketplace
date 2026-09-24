const express = require("express");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    register,
    login,
    logout,
    createAdmin
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/admin-test", protect, authorizeRoles("ADMIN"), (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin access granted",
        user: req.user
    });
});

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Logout
router.post("/logout", logout);

router.post("/create-admin", createAdmin);

router.get("/me", protect, authorizeRoles("USER"), (req, res) => {
    res.status(200).json({
        success: true,
        message: "Protected route accessed",
        user: req.user
    });
});

module.exports = router;