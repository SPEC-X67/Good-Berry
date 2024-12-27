const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/auth-controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/auth-check", authController.authMiddleware,(req, res) => {
    const user = req.user;
    res.status(200).json({ success: true, message: "Authenticated user!", user });
});

module.exports = router;