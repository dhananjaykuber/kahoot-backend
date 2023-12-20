import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

interface UserResult {
  userId: string;
  userName: string;
  totalTimeTaken: number;
  correctAnswersCount: number;
}

export { RequestWithUser, UserResult };
