const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Order = require("../../models/Order");
const { SendVerificationCode, SendWelcomeMessage, SendResetPasswordLink } = require("../../middleware/email");

//register
const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password)
            return res.json({
                success: false,
                message: "Please enter name, email and password",
            });

        const checkUser = await User.findOne({ email });
        if (checkUser)
            return res.json({
                success: false,
                message: "User Already exists with the same email! Please try to login",
            });

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            username,
            email,
            password: hashPassword
        });

        await newUser.save();

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        req.session.otp = otp;
        req.session.email = email;
        req.session.otpExpiresAt = Date.now() + 300000;
        console.log(otp)

        SendVerificationCode(email, otp);

        res.status(200).json({
            success: true,
            message: "Please check your email to verify your account",
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
};

//login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password)
            return res.json({
                success: false,
                message: "Please enter email and password",
            });

        const checkUser = await User.findOne({ email });
        if (!checkUser)
            return res.json({
                success: false,
                message: "User doesn't exists! Please register first",
            });

        if (checkUser.isBlocked)
            return res.json({
                success: false,
                message: "Account has been Suspended! Please contact admin",
            });

        if (!checkUser.isVerified) {

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            console.log(otp)

            SendVerificationCode(checkUser.email, otp);
            req.session.otp = otp;
            req.session.email = checkUser.email;
            req.session.otpExpiresAt = Date.now() + 300000;

            return res.json({
                success: false,
                isVerify: true,
                message: "Please verify your account first",
            });
        }

        const checkPasswordMatch = await bcrypt.compare(
            password,
            checkUser.password
        );
        if (!checkPasswordMatch)
            return res.json({
                success: false,
                message: "Incorrect password! Please try again",
            });

        const token = jwt.sign(
            {
                id: checkUser._id,
                role: checkUser.role,
                email: checkUser.email,
                username: checkUser.username,
            },
            "This the thing i love",
            { expiresIn: "60m" }
        );

        res.cookie("token", token, { httpOnly: true, secure: false }).json({
            success: true,
            message: "Logged in successfully",
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                username: checkUser.username,
            },
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
};


const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.json({
            success: false,
            message: "Please login first",
        });
    try {
        const decoded = jwt.verify(token, "This the thing i love");
        req.user = decoded;
        const user = await User.findById(decoded.id);
        if (user.isBlocked) {
            return res.redirect('http://localhost:5000/auth/logout');
        }
        next();
    } catch (e) {
        if (e.message === "jwt expired") {
            return res.json({
                success: false,
                message: "Please login first",
            });
        }
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
};

const googleAuth = async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('http://localhost:5173/auth/login?error=auth_failed');
        }

        if (req.user.isBlocked) {
            return res.redirect('http://localhost:5173/auth/login?error=blocked_user');
        }

        const token = jwt.sign(
            {
                id: req.user._id,
                role: req.user.role,
                email: req.user.email,
                username: req.user.name
            },
            "This the thing i love",
            { expiresIn: '60m' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
        });

        return res.redirect('http://localhost:5173?login=success');

    } catch (error) {
        console.error('Google auth error:', error);
        return res.redirect('http://localhost:5173/auth/login?error=internal_error');
    }
};

const verify = async (req, res) => {
    const { otp } = req.body;

    const sessionOtp = req.session.otp;
    const sessionEmail = req.session.email;
    const otpExpiresAt = req.session.otpExpiresAt;

    if (!sessionOtp || !sessionEmail) {
        return res.json({ message: 'Something went wrong' });
    }


    if (Date.now() > otpExpiresAt) {
        return res.json({ message: 'OTP expired try again' });
    }

    if (sessionOtp !== otp) {
        return res.json({ message: 'Invalid OTP' });
    }

    const user = await User.findOne({ email: sessionEmail });
    user.isVerified = true;
    await user.save();

    req.session.otp = null;
    req.session.email = null;
    req.session.otpExpiresAt = null;

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role,
            email: user.email,
            username: user.username
        },
        "This the thing i love",
        { expiresIn: '60m' }
    );

    // Set cookie and redirect in one response
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000,
    });

    SendWelcomeMessage(user.email);


    res.status(200).json({ success: true, message: 'Logged in successfully', user });
};

const logout = async (req, res) => {
    res.clearCookie("token");
    res.json({
        success: true,
        message: "Logged out successfully",
    });
};

const set = async (req, res) => {

    try {
        const order = await Order.find({});
        await Promise.all(
            order.map(order => {
                order.couponDiscount = 0;
                return order.save();
            })
        );

        res.json({
            success: true,
            message: "Set successfully",
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error setting", error: error.message });
    }

};

const resendOtp = async (req, res) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        req.session.otp = otp;
        req.session.email = req.session.email;

        console.log(otp);

        SendVerificationCode(req.session.email, otp);
        if (!req.session.email) return res.json({ success: false, message: 'Something went wrong' });
        req.session.otpExpiresAt = Date.now() + 300000; // 5 minutes in milliseconds
        res.json({ success: true, message: 'OTP sent successfully', });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
}

const forgetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.json({
                success: false,
                message: "Please enter your email address",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User with this email does not exist",
            });
        }

        const resetToken = jwt.sign(
            { id: user._id, email: user.email },
            "This the thing i love",
            { expiresIn: "5m" }
        );

        // Store the token in user document
        user.resetPasswordToken = {
            token: resetToken,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
        };
        await user.save();

        const resetLink = `http://localhost:5173/auth/reset-password?token=${resetToken}`;
        SendResetPasswordLink(user.email, resetLink);

        res.status(200).json({
            success: true,
            message: "Password reset link has been sent to your email",
        });
    } catch (error) {
        console.error("Error sending reset password link:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send reset password link",
            error: error.message,
        });
    }
};

const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    if(password.length < 8){
        return res.json({
            success: false,
            message: "Password must be 8 characters",
        });
    }

    try {
        if (!token) {
            return res.json({
                success: false,
                message: "Token is required",
            });         
        }

        const decoded = jwt.verify(token, "This the thing i love");
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.json({
                success: false,
                message: "Invalid token or user does not exist",
            });
        }

        // Check if token exists and matches
        if (!user.resetPasswordToken || user.resetPasswordToken.token !== token) {
            return res.json({
                success: false,
                message: "Invalid or expired reset token",
            });
        }

        // Check if token has expired
        if (new Date() > user.resetPasswordToken.expiresAt) {
            // Clear the expired token
            user.resetPasswordToken = undefined;
            await user.save();
            
            return res.json({
                success: false,
                message: "Reset token has expired",
            });
        }

        const hashPassword = await bcrypt.hash(password, 12);
        user.password = hashPassword;
        // Clear the used token
        user.resetPasswordToken = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(400).json({
                success: false,
                message: "Token has expired",
            });
        }
        console.error("Error resetting password:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset password",
            error: error.message,
        });
    }
};

module.exports = {
    register,
    login,
    authMiddleware,
    logout,
    googleAuth,
    verify,
    resendOtp,
    set,
    forgetPassword,
    resetPassword
};
