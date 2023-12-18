import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHanlder';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';
import prisma from '../prisma';
import bcryptjs from 'bcryptjs';
import cookieOption from '../utils/cookieOption';
import { generateJwt } from '../utils/jwtToken';

const signupUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError('All fields are required.', 400);
  }

  const userExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (userExist) {
    throw new ApiError('User with email already exist.', 400);
  }

  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(password, salt);

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
    },
  });

  if (!createdUser) {
    throw new ApiError('Something went wrong while registering the user', 500);
  }

  const token = generateJwt(createdUser.id);

  res.status(201).json(
    new ApiResponse('User registered successfully.', 200, {
      email: createdUser.email,
      name: createdUser.name,
      token,
    })
  );
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError('Email and password is required.', 400);
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError('User with provided email does not exist.', 404);
  }

  if (!bcryptjs.compareSync(password, user.password)) {
    throw new ApiError('Password does not match.', 404);
  }

  const token = generateJwt(user.id);
  res
    .status(200)
    .cookie('token', token, cookieOption)
    .json(
      new ApiResponse('User login successfully.', 200, {
        email: user.email,
        name: user.name,
        token,
      })
    );
});

export { signupUser, loginUser };
