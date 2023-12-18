import asyncHandler from '../utils/asyncHanlder.js';
import ApiError from '../utils/ApiError.js';
import { NextFunction, Request, Response } from 'express';
import prisma from '../prisma/index.js';
import { verifyJwt } from '../utils/jwtToken.js';
import { JwtPayload } from 'jsonwebtoken';
import { RequestWithUser } from '../utils/types.js';

const authMiddleware = asyncHandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token: string =
      req?.cookies?.token || req.header('Authorization')?.split(' ')[0];

    if (!token) {
      throw new ApiError('Unauthorized request.', 401);
    }

    const decodedToken = verifyJwt(token) as JwtPayload;

    const currentUser = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!currentUser) {
      throw new ApiError('Invalid access token.', 401);
    }

    req.user = currentUser;

    next();
  }
);

export default authMiddleware;
