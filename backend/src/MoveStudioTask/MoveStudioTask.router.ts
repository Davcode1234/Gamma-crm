import { Router } from 'express';
import passport from 'passport';
import { StudioTaskController } from '../StudioTask/StudioTask.controller';
import { ArchivedStudioTaskController } from '../ArchivedStudioTask/ArchivedStudioTask.controller';
import { StatusCodes } from 'http-status-codes';
import '../Auth/Passport';

export const MoveStudioTaskRouter = Router();
export const unArchiveStudioTaskRouter = Router();

MoveStudioTaskRouter.post(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res): Promise<void> => {
    try {
      const sourceStudioTask = await StudioTaskController.getStudioTask(
        req.params.id,
      );
      if (!sourceStudioTask) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Document not found' });
      }
      const targetStudioTask =
        await ArchivedStudioTaskController.addArchivedStudioTask({
          ...sourceStudioTask.toObject(),
          __v: undefined,
        });

      await StudioTaskController.deleteStudioTask(req.params.id);

      res.status(StatusCodes.CREATED).json(targetStudioTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

unArchiveStudioTaskRouter.post(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res): Promise<void> => {
    try {
      const sourceStudioTask =
        await ArchivedStudioTaskController.getArchivedStudioTask(req.params.id);
      if (!sourceStudioTask) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Document not found' });
      }
      const targetStudioTask = await StudioTaskController.addStudioTask({
        ...sourceStudioTask.toObject(),
        index: req.body.index,
        __v: undefined,
      });

      await ArchivedStudioTaskController.deleteArchivedStudioTask(
        req.params.id,
      );

      res.status(StatusCodes.CREATED).json(targetStudioTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);
