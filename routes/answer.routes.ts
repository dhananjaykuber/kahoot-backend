import express, { Router } from 'express';
import { submitAnswer } from '../controller/answer.controllers';
import authMiddleware from '../middlewares/auth.middleware';

const router: Router = express.Router();

router.route('/submit').post(authMiddleware, submitAnswer);

export default router;
