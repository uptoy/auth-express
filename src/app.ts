import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { globalErrorHandler } from './middleware/global-error-handler';
import { notFoundHandler } from './middleware/not-found-handler';
import authRouter from './routers/auth.route';
import commentRouter from './routers/comment.route';
import postRouter from './routers/post.route';
import reactionRouter from './routers/reaction.route';

const app: Application = express();

// Use middleware 
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Use Rate limiter for secure server
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: `You can only make 100 requests per minute`,
});
app.use(limiter);

interface WelcomeResponse {
  message: string;
}
// App Home Route
app.get('/', async (req: Request, res: Response<WelcomeResponse>) => {
  return res.status(200).json({ message: "Welcome to our Blog!" });
});

// Other App routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/reactions', reactionRouter);

// catch 404 and forward to error handler
app.use(notFoundHandler);

// global error handler
app.use(globalErrorHandler);

export default app;
