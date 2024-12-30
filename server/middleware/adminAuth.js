const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(req.cookies.token);
        if (!token) {
            return res.status(401).json({ message: 'Admin not logged in' });
        }        
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const admin = await User.findById(decoded.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(401).json({ message: 'Admin not authorized' });
        }
        req.admin = admin;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports =  adminAuth;