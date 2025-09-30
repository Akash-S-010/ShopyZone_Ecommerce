import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';
import apiRoutes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(morgan('dev'));
app.use(helmet());
app.use(hpp());
// app.use(rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
// }));
app.use(cookieParser());


// Sample route
app.get('/', (req, res) => {
    res.send('ShopyZone API is running...');
});

// API routes
app.use('/api', apiRoutes)


// Error handling middleware
app.use(errorHandler);

// Start server after DB connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} - Version 2.0`);
    });
}).catch(err => {
    console.error('Failed to connect to the database', err);
});
