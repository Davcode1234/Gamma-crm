import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserController } from './User.controller';
import passport from 'passport';
import { permit } from '../Auth/permit';
import omit from 'lodash.omit';

export const UserRouter = Router();

UserRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  permit('admin', 'grafik'),
  async (req, res) => {
    try {
      const users = await UserController.getUsers();
      res.json(users);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  },
);

UserRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  UserController.permitOwnerOrAdmin,
  async (req, res) => {
    const id = req.params.id === 'me' ? req.user.id : req.params.id;
    try {
      const user = await UserController.getUser({ _id: id });
      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  },
);

UserRouter.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  UserController.permitOwnerOrAdmin,
  async (req, res) => {
    const id = req.params.id === 'me' ? req.user.id : req.params.id;
    const loggedRoles: string[] = (req.user as any).roles || [];
    const isAdmin = loggedRoles.includes('admin');
    // Only admins may change roles or the company a client is assigned to.
    const userBody = isAdmin
      ? { ...req.body }
      : omit({ ...req.body }, ['roles', 'company']);
    try {
      if (isAdmin && Array.isArray(userBody.roles)) {
        const clientRoleError = UserController.validateClientRoles(
          userBody.roles,
          userBody.company,
        );
        if (clientRoleError) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: clientRoleError });
          return;
        }
      }
      const updatedUser = await UserController.updateUser(
        { _id: id },
        userBody,
      );
      res.status(StatusCodes.ACCEPTED).json(updatedUser);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);

UserRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  permit('admin'),
  async (req, res) => {
    const id = req.params.id === 'me' ? req.user.id : req.params.id;
    try {
      const user = await UserController.deleteUser({ _id: id });
      res.status(StatusCodes.NO_CONTENT).json(user);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  },
);
