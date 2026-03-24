import { Router } from 'express';
import passport from 'passport';
import { StudioTaskController } from './StudioTask.controller';
import { StatusCodes } from 'http-status-codes';
import '../Auth/Passport';

export const StudioTaskRouter = Router();

StudioTaskRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const studioTasks = await StudioTaskController.getStudioTasks();
      res.status(StatusCodes.ACCEPTED).json(studioTasks);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

StudioTaskRouter.get(
  '/placker',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const studioTasks = await StudioTaskController.getPlackerTasks();
      res.status(StatusCodes.ACCEPTED).json(studioTasks);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);
StudioTaskRouter.get(
  '/placker/bycompanies',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const studioTasks = await StudioTaskController.getTasksByCompany();
      res.status(StatusCodes.ACCEPTED).json(studioTasks);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

StudioTaskRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const studioTask = await StudioTaskController.getStudioTask(
        req.params.id,
      );
      res.status(StatusCodes.ACCEPTED).json(studioTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

StudioTaskRouter.get(
  '/:year/:month',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const year = req.params.year;
    const month = req.params.month;
    try {
      const studioTask = await StudioTaskController.getHighestSearchIDByMonth(
        year,
        month,
      );
      res.status(StatusCodes.ACCEPTED).json(studioTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

StudioTaskRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const newStudioTask = await StudioTaskController.addStudioTask({
        searchID: req.body.searchID,
        reckoTaskID: req.body.reckoTaskID,
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
      res.status(StatusCodes.CREATED).json(newStudioTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

StudioTaskRouter.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const updatedStudioTask = await StudioTaskController.updateStudioTask(
        req.params.id,
        { ...req.body },
      );
      res.status(StatusCodes.ACCEPTED).json(updatedStudioTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

StudioTaskRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await StudioTaskController.deleteStudioTask(req.params.id);
      res.status(StatusCodes.ACCEPTED);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

StudioTaskRouter.post(
  '/:id/subtasks',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const taskId = req.params.id;
      const subtaskBody = {
        content: req.body.content,
        done: req.body.done,
      };

      const updatedSubtasks = await StudioTaskController.addSubtask(
        taskId,
        subtaskBody,
      );
      res.status(StatusCodes.ACCEPTED).json(updatedSubtasks);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

StudioTaskRouter.patch(
  '/:id/subtasks/:subtaskId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const taskId = req.params.id;
      const subtaskId = req.params.subtaskId;

      const updatedSubtasks = await StudioTaskController.updateSubtask(
        taskId,
        subtaskId,
        { ...req.body },
      );
      res.status(StatusCodes.ACCEPTED).json(updatedSubtasks);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

StudioTaskRouter.delete(
  '/:id/subtasks/:subtaskId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const taskId = req.params.id;
      const subtaskId = req.params.subtaskId;
      const updatedSubtasks = await StudioTaskController.deleteSubtask(
        taskId,
        subtaskId,
      );
      res.status(StatusCodes.ACCEPTED).json(updatedSubtasks);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);
