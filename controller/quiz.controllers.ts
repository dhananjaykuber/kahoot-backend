import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHanlder';
import ApiError from '../utils/ApiError';
import prisma from '../prisma';
import { RequestWithUser } from '../utils/types';
import ApiResponse from '../utils/ApiResponse';

const createQuiz = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { title } = req.body;

  if (!title) {
    throw new ApiError('All fields are required.', 400);
  }

  if (!req.user) {
    throw new ApiError('Unauthorized.', 401);
  }

  const createdQuiz = await prisma.quiz.create({
    data: {
      title,
      creator: {
        connect: {
          id: req.user.id,
        },
      },
    },
  });

  if (!createdQuiz) {
    throw new ApiError('Something went wrong. Cannot create quiz.', 400);
  }

  res
    .status(201)
    .json(new ApiResponse('Quiz created successfully.', 200, createdQuiz));
});

const updateQuiz = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    throw new ApiError('All fields are required.', 400);
  }

  const updatedQuiz = await prisma.quiz.update({
    where: {
      id,
    },
    data: {
      title,
    },
  });

  if (!updatedQuiz) {
    throw new ApiError('Quiz not found.', 404);
  }

  res
    .status(200)
    .json(new ApiResponse('Quiz updated successfully.', 200, updatedQuiz));
});

const deleteQuiz = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // also need to delete all the questions corresponding to quiz
  const deletedQuiz = await prisma.quiz.delete({
    where: {
      id,
    },
  });

  if (!deletedQuiz) {
    throw new ApiError('Quiz not found.', 404);
  }

  res
    .status(200)
    .json(new ApiResponse('Quiz deleted successfully.', 200, null));
});

export { createQuiz, updateQuiz, deleteQuiz };
