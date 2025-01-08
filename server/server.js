const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth/auth-routes');
const adminRouter = require('./routes/admin/admin-routes');
const commonRouter = require('./routes/common/common-routes');
const adminAuth = require('./middleware/admin-auth');
const connectCloudinary = require('./config/cloudnary');
const passport = require('./config/passport');
const session = require('express-session');

// Database connection
mongoose.connect(`mongodb+srv://shamnadthayyil8:wwhdWJRaqgTPJPCk@cluster0.gwyoo.mongodb.net/`)
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

app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://shamnadthayyil8:wwhdWJRaqgTPJPCk@cluster0.gwyoo.mongodb.net/',
      })
  }));
  
app.use(cookieParser());
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);
app.use('/api/admin',adminRouter);
app.use('/api', commonRouter);



app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
