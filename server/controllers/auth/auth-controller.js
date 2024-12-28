const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

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
            password: hashPassword,
        });

        await newUser.save();
        res.status(200).json({
            success: true,
            message: "Registration successful",
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
            "CLIENT_SECRET_KEY",
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
        const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
        req.user = decoded;
        next();
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
};

const logout = async (req, res) => {
    res.clearCookie("token");
    res.json({
        success: true,
        message: "Logged out successfully",
    });
};

module.exports = {
    register,
    login,
    authMiddleware,
    logout,
};
