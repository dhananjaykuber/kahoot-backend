import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHanlder';
import ApiError from '../utils/ApiError';
import prisma from '../prisma';
import ApiResponse from '../utils/ApiResponse';

const addQuestion = asyncHandler(async (req: Request, res: Response) => {
  const { question, options, correctAns, quiz } = req.body;

  if (!question || !options || !correctAns || !quiz) {
    throw new ApiError('All fields are required.', 400);
  }

  const addedQuestion = await prisma.question.create({
    data: {
      question,
      options,
      correctAns,
      quiz: {
        connect: {
          id: quiz,
        },
      },
    },
  });

  if (!addedQuestion) {
    throw new ApiError('Something went wrong. Cannot add question.', 400);
  }

  res
    .status(201)
    .json(new ApiResponse('Question added successfully.', 200, addedQuestion));
});

const updateQuestion = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const updatedQuestion = await prisma.question.update({
    where: {
      id,
    },
    data: {
      ...req.body,
    },
  });

  if (!updatedQuestion) {
    throw new ApiError('Question not found.', 404);
  }

  res
    .status(200)
    .json(
      new ApiResponse('Question updated successfully.', 200, updatedQuestion)
    );
});

const deleteQuestion = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedQuestion = await prisma.question.delete({
    where: {
      id,
    },
  });

  if (!deletedQuestion) {
    throw new ApiError('Question not found.', 404);
  }

  res
    .status(200)
    .json(new ApiResponse('Question deleted successfully.', 200, null));
});

export { addQuestion, updateQuestion, deleteQuestion };
