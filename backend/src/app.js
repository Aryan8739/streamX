import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import { ApiError } from "./utils/ApiError.js";



const app = express();

console.log("CORS_ORIGIN configured for:", process.env.CORS_ORIGIN);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Security & Performance Middlewares
app.use(helmet());
app.use(compression());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
    handler: (req, res, next, options) => {
        throw new ApiError(options.statusCode, options.message);
    }
});

app.use("/api/", limiter); // Apply rate limiting to all API routes

// Request Logging
app.use(morgan('dev'));

/*app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    next();
});*/




app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static('public'));
app.use(cookieParser());

//Routes
import userRouter from "./routes/users.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import commentRouter from "./routes/comment.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

//Routes Declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/dashboard", dashboardRouter)

// Error Handler

app.use((err, req, res, next) => {
    console.error("Error Details:", {
        message: err.message,
        statusCode: err.statusCode,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            data: err.data
        });
    }

    // Default error
    return res.status(500).json({
        success: false,
        message: "Something went wrong on the server",
        errors: [],
        data: null
    });
});

// Default Route
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>StreamX Backend API</title>
                <style>
                    body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #121212; color: #ffffff; }
                    .container { text-align: center; padding: 2rem; background-color: #1e1e1e; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
                    h1 { color: #bb86fc; }
                    p { color: #cccccc; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>StreamX API is Running 🚀</h1>
                    <p>The backend server is active and listening for requests.</p>
                    <p>Frontend is hosted separately on Vercel at https://streamxvid.vercel.app</p>
                </div>
            </body>
        </html>
    `);
});

export { app }
