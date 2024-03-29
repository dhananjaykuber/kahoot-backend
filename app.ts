import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// routes
import authRoute from './routes/auth.routes';
import quizRoute from './routes/quiz.routes';
import questionRoute from './routes/question.routes';
import answerRoute from './routes/answer.routes';
import resultRoute from './routes/result.routes';

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/quiz', quizRoute);
app.use('/api/v1/question', questionRoute);
app.use('/api/v1/answer', answerRoute);
app.use('/api/v1/result', resultRoute);

export default app;
