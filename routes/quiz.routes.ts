import express, { Router } from 'express';
import {
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from '../controller/quiz.controllers';
import authMiddleware from '../middlewares/auth.middleware';

const router: Router = express.Router();

router.route('/create').post(authMiddleware, createQuiz);
router.route('/update/:id').put(authMiddleware, updateQuiz);
router.route('/delete/:id').delete(authMiddleware, deleteQuiz);

export default router;
