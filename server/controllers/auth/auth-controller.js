const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { SendVerificationCode, SendWelcomeMessage } = require("../../middleware/email");

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
                message: "User Already exists with the same email! Please try again",
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
        console.log(e);
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
        next();
    } catch (e) {
        if (e.message === "jwt expired") {
            return res.json({
                success: false,
                message: "Please login first",
            });
        }
        console.log(e);
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
        const users = await User.find({});
        await Promise.all(
            users.map(user => {
                user.phone = null;
                return user.save();
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

module.exports = {
    register,
    login,
    authMiddleware,
    logout,
    googleAuth,
    verify,
    resendOtp,
    set
};
