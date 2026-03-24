import { Router } from 'express';
import passport from 'passport';
import { ArchivedStudioTaskController } from './ArchivedStudioTask.controller';
import { StatusCodes } from 'http-status-codes';
import '../Auth/Passport';

export const ArchivedStudioTaskRouter = Router();

ArchivedStudioTaskRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const archivedStudioTask =
        await ArchivedStudioTaskController.getArchivedStudioTasks();
      res.status(StatusCodes.ACCEPTED).json(archivedStudioTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ArchivedStudioTaskRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const archivedStudioTask =
        await ArchivedStudioTaskController.getArchivedStudioTask(req.params.id);
      res.status(StatusCodes.ACCEPTED).json(archivedStudioTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ArchivedStudioTaskRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const newArchivedStudioTask =
        await ArchivedStudioTaskController.addArchivedStudioTask({
          searchID: req.body.searchID,
          title: req.body.title,
          client: req.body.client,
          clientPerson: req.body.clientPerson,
          status: req.body.status,
          index: req.body.index,
          author: req.body.author,
          taskType: req.body.taskType,
          participants: req.body.participants,
          description: req.body.description,
          subtasks: req.body.subtasks,
          deadline: req.body.deadline,
          startDate: req.body.startDate,
          createdAt: req.body.createdAt,
        });
      res.status(StatusCodes.CREATED).json(newArchivedStudioTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ArchivedStudioTaskRouter.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const updatedArchivedStudioTask =
        await ArchivedStudioTaskController.updateArchivedStudioTask(
          req.params.id,
          { ...req.body },
        );
      res.status(StatusCodes.ACCEPTED).json(updatedArchivedStudioTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ArchivedStudioTaskRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await ArchivedStudioTaskController.deleteArchivedStudioTask(
        req.params.id,
      );
      res.status(StatusCodes.ACCEPTED);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ messagge: error });
    }
  },
);

ArchivedStudioTaskRouter.get(
  '/search/:query?',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const params = req.params as { query?: string };
      const query = params.query || '';
      const searchResult =
        await ArchivedStudioTaskController.archivedStudioTaskSearch(query);
      res.status(StatusCodes.ACCEPTED).json(searchResult);
    } catch (error) {
      console.error('Error', error.message);
      res.status(StatusCodes.BAD_GATEWAY).json({ message: error.message });
    }
  },
);
