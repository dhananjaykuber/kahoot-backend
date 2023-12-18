import express, { Router } from 'express';
import { loginUser, signupUser } from '../controller/auth.controllers';

const router: Router = express.Router();

router.route('/signup').post(signupUser);
router.route('/login').post(loginUser);

export default router;
