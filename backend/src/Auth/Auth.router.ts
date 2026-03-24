import { StatusCodes } from 'http-status-codes';
import { Router } from 'express';
import { AuthController } from './Auth.controller';

export const AuthRouter = Router();

AuthRouter.post('/signin', async (req, res) => {
  try {
    const { email, password, grantType } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'email and password are required' });
      return;
    }
    const token = await AuthController.signUser(email, password);
    if (token === null) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }
    if (grantType && grantType === 'cookie') {
      res
        .status(StatusCodes.OK)
        .cookie('token', token, {
          httpOnly: true,
          secure: true,
          signed: true,
          maxAge: 1000 * 60 * 60 * 24 * 1000,
          sameSite: 'none',
        })
        .end();
    } else {
      res.status(StatusCodes.OK).json({ token });
    }
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
  }
});

AuthRouter.post('/signup', async (req, res) => {
  try {
    const newUser = await AuthController.addUser(req.body);
    res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: { message: error.message } });
  }
});

AuthRouter.post('/signout', async (req, res) => {
  try {
    res
      .status(StatusCodes.OK)
      .cookie('token', '', {
        httpOnly: true,
        secure: true,
        signed: true,
        maxAge: 1,
        sameSite: 'none',
      })
      .end();
  } catch (error) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: { message: error.message } });
  }
});
