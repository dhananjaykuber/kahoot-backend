import { Response } from 'express';
import asyncHandler from '../utils/asyncHanlder';
import ApiError from '../utils/ApiError';
import prisma from '../prisma';
import ApiResponse from '../utils/ApiResponse';
import { RequestWithUser, UserResult } from '../utils/types';

const getResult = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { quizId } = req.params;

  if (!req.user) {
    throw new ApiError('Unauthorized.', 401);
  }

  const quizExist = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
  });

  if (!quizExist) {
    throw new ApiError('Quiz with given id not found.', 404);
  }

  if (quizExist.creatorId !== req.user.id) {
    throw new ApiError('Unauthorized to access this quiz.', 401);
  }

  const userResults: Record<string, UserResult> = {};

  const submittedAnswers = await prisma.submittedAnswer.findMany({
    where: { quizId: quizId },
    include: { user: true, question: { select: { correctAns: true } } },
  });

  submittedAnswers.forEach((answer) => {
    const user = answer.user;
    if (!userResults[user.id]) {
      userResults[user.id] = {
        userId: user.id,
        userName: user.name,
        totalTimeTaken: 0,
        correctAnswersCount: 0,
      };
    }

    userResults[user.id].totalTimeTaken += answer.timeTaken;
    userResults[user.id].correctAnswersCount +=
      answer.answer === answer.question.correctAns ? 1 : 0;
  });

  if (!userResults) {
    throw new ApiError('Something went wrong. Cannot calculate result.', 400);
  }

  res
    .status(201)
    .json(new ApiResponse('Result calculated successfully.', 200, userResults));
});

export { getResult };
