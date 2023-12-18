import jwt from 'jsonwebtoken';

const secret: any = process.env.JWT_SECRET;
const expiresIn: any = process.env.JWT_EXPIRE;

const generateJwt = (id: string) => {
  return jwt.sign({ id }, secret, {
    expiresIn: expiresIn,
  });
};

const verifyJwt = (token: string) => {
  return jwt.verify(token, secret);
};

export { generateJwt, verifyJwt };
