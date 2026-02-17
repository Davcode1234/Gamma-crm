import { Router } from 'express';
import { AIController } from './AI.controller';
import { StatusCodes } from 'http-status-codes';

export const AIRouter = Router();

AIRouter.post('/month-summary', async (req, res) => {
  try {
    const snapshot = req.body;

    const response = await AIController.ChatSummary(snapshot);

    res.status(StatusCodes.ACCEPTED).json(response);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: `Month summary failed ${error.message}` });
  }
});
