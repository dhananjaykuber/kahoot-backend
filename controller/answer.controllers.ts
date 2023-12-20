import { Response } from 'express';
import asyncHandler from '../utils/asyncHanlder';
import ApiError from '../utils/ApiError';
import prisma from '../prisma';
import ApiResponse from '../utils/ApiResponse';
import { RequestWithUser } from '../utils/types';

const submitAnswer = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const { quizId, questionId, answer, timeTaken } = req.body;

    if (!questionId || !answer || !timeTaken) {
      throw new ApiError('All fields are required.', 400);
    }

    if (!req.user) {
      throw new ApiError('Unauthorized.', 401);
    }

    const submittedAnswer = await prisma.submittedAnswer.create({
      data: {
        answer,
        timeTaken,
        user: {
          connect: {
            id: req.user.id,
          },
        },
        question: {
          connect: {
            id: questionId,
          },
        },
        quiz: {
          connect: {
            id: quizId,
          },
        },
      },
    });

    if (!submittedAnswer) {
      throw new ApiError('Something went wrong. Cannot submit answer.', 400);
    }

    res
      .status(201)
      .json(
        new ApiResponse('Answer submitted successfully.', 200, submittedAnswer)
      );
  }
);

export { submitAnswer };
