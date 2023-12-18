import express, { Router } from 'express';
import {
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controller/question.controllers';
import authMiddleware from '../middlewares/auth.middleware';

const router: Router = express.Router();

router.route('/add').post(authMiddleware, addQuestion);
router.route('/update/:id').put(authMiddleware, updateQuestion);
router.route('/delete/:id').delete(authMiddleware, deleteQuestion);

export default router;
