const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/auth-controller");
const passport = require("passport");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/verify", authController.verify);
router.post("/resend-otp", authController.resendOtp);


router.get("/set", authController.set);


// Google OAuth routes
router.get("/google",
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })
);

router.get("/google/callback",
    passport.authenticate('google', {
      failureRedirect: 'http://localhost:5173/login?error=google_auth_failed',
      session: false
    }),
    authController.googleAuth
);

router.get("/auth-check", authController.authMiddleware, (req, res) => {
    const user = req.user;
    res.status(200).json({ success: true, message: "Authenticated user!", user });
});

module.exports = router;