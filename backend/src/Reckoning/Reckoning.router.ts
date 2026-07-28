import { Router } from 'express';
import passport from 'passport';
import { StatusCodes } from 'http-status-codes';
import '../Auth/Passport';
import { ReckoningTaskController } from './Reckoning.controller';

export const ReckoningTaskRouter = Router();

ReckoningTaskRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const reckoningTasks = await ReckoningTaskController.getReckoningTasks();
      res.status(StatusCodes.ACCEPTED).json(reckoningTasks);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);

ReckoningTaskRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const reckoningTask = await ReckoningTaskController.getReckoningTask(
        req.params.id,
      );
      res.status(StatusCodes.ACCEPTED).json(reckoningTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);

ReckoningTaskRouter.get(
  '/:year/:month/:userId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const filteredReckoningTasks =
        await ReckoningTaskController.getFilteredReckoningTasks(
          req.params.userId,
          req.params.year,
          req.params.month,
        );

      res.status(StatusCodes.ACCEPTED).json(filteredReckoningTasks);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);

ReckoningTaskRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const newStudioTask = await ReckoningTaskController.addReckoningTask({
        searchID: req.body.searchID,
        client: req.body.client,
        clientPerson: req.body.clientPerson,
        title: req.body.title,
        description: req.body.description,
        comment: req.body.comment,
        isSettled: false,
        author: req.body.author,
        taskType: req.body.taskType,
        printWhat: req.body.printWhat,
        printWhere: req.body.printWhere,
        participants: req.body.participants,
        startDate: req.body.startDate,
        deadline: req.body.deadline,
      });
      res.status(StatusCodes.CREATED).json(newStudioTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);

ReckoningTaskRouter.post(
  '/from-kanban/:month',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const newStudioTask =
        await ReckoningTaskController.addReckoningTaskFromKanban(
          {
            searchID: req.body.searchID,
            idOfAssignedStudioTask: req.body.idOfAssignedStudioTask,
            client: req.body.client,
            clientPerson: req.body.clientPerson,
            title: req.body.title,
            description: req.body.description,
            comment: req.body.comment,
            isSettled: false,
            author: req.body.author,
            taskType: req.body.taskType,
            printWhat: req.body.printWhat,
            printWhere: req.body.printWhere,
            participants: req.body.participants,
            startDate: req.body.startDate,
            // deadline: req.body.deadline,
          },
          req.user.id,
          req.params.month,
        );
      res.status(StatusCodes.CREATED).json(newStudioTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);

ReckoningTaskRouter.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const updatedReckoningTask =
        await ReckoningTaskController.updateReckoningTask(req.params.id, {
          ...req.body,
        });
      res.status(StatusCodes.ACCEPTED).json(updatedReckoningTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);

ReckoningTaskRouter.delete(
  '/:id/:monthId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const deletedReckoTask =
        await ReckoningTaskController.deleteReckoningTask(
          req.params.id,
          req.user.id,
          req.params.monthId,
        );
      res.status(StatusCodes.ACCEPTED).json(deletedReckoTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);

ReckoningTaskRouter.patch(
  '/:taskId/dayUpdate/:userId/:dayId/:monthId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const userId = req.params.userId;
      const dayId = req.params.dayId;
      const monthId = req.params.monthId;

      const updatedDay = await ReckoningTaskController.updateDay(
        taskId,
        dayId,
        userId,
        { ...req.body },
        monthId,
      );
      res.status(StatusCodes.ACCEPTED).json(updatedDay);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);
