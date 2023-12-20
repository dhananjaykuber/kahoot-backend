import express, { Router } from 'express';
import { getResult } from '../controller/result.controllers';
import authMiddleware from '../middlewares/auth.middleware';

const router: Router = express.Router();

router.route('/:quizId').get(authMiddleware, getResult);

export default router;
