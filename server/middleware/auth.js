const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login first"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "This the thing i love");
        
        req.user = decoded;
        next();
        
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please login again"
            });
        }
        
        console.error('Auth middleware error:', error);
        return res.status(403).json({
            success: false,
            message: "Invalid authentication token"
        });
    }
};

module.exports = auth;