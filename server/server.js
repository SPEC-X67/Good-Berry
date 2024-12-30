const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth/auth-routes');
const adminRouter = require('./routes/admin/admin-routes');
const adminAuth = require('./middleware/adminAuth');
const cloudinary = require('cloudinary').v2;
const connectCloudinary = require('./config/cloudnary');
dotenv.config();

// Database connection
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gwyoo.mongodb.net/`)
.then(() => console.log('Database connected successfully'))
.catch((err) => console.log(err));

connectCloudinary().then(() => console.log('Cloudinary connected successfully')).catch((err) => console.log(err));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma',
        ],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/admin',adminRouter)


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
