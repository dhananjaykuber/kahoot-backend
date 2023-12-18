import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export { RequestWithUser };
