import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { ChartsController } from './Charts.controller';
import { permit } from '../Auth/permit';

export const ChartsRouter = Router();

ChartsRouter.get(
  '/reckoning/client-per-hour/:month/:year',
  passport.authenticate('jwt', { session: false }),
  permit('admin'),

  async (req, res) => {
    const month = req.params.month;
    const year = req.params.year;
    try {
      const result = await ChartsController.getClientsPerHour(month, year);
      res.status(StatusCodes.ACCEPTED).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },
);

ChartsRouter.get(
  '/reckoning/client-per-hour-yearly/:year',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const year = req.params.year;
    try {
      const result = await ChartsController.getClientsPerHourYearly(year);
      res.status(StatusCodes.ACCEPTED).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },
);

/////USERS PER DAY//////

ChartsRouter.get(
  '/reckoning/user-per-day-hours/:month/:year',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const month = req.params.month;
    const year = req.params.year;

    try {
      const result = await ChartsController.getUsersMonthSummary(month, year);
      res.status(StatusCodes.ACCEPTED).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },
);

ChartsRouter.get(
  '/reckoning/user-per-day-hours-yearly/:year',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const year = req.params.year;

    try {
      const result = await ChartsController.getUsersMonthSummaryYearly(year);
      res.status(StatusCodes.ACCEPTED).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },
);

/////TASK TYPES//////

ChartsRouter.get(
  '/studioTasks/tasks-per-type',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const result = await ChartsController.getStudioTasksTypesSummary();
      res.status(StatusCodes.ACCEPTED).json(result);
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.BAD_REQUEST).send('Server error, check API');
    }
  },
);

ChartsRouter.get(
  '/archivedStudioTasks/tasks-per-type',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const result =
        await ChartsController.getArchivedStudioTasksTypesSummary();
      res.status(StatusCodes.ACCEPTED).json(result);
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.BAD_REQUEST).send('Server error, check API');
    }
  },
);

/////MONTH PER DAY/////

ChartsRouter.get(
  '/reckoning/month-hours-per-day/:month/:year',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const month = req.params.month;
    const year = req.params.year;

    try {
      const result = await ChartsController.getHoursPerDay(month, year);
      res.status(StatusCodes.ACCEPTED).json(result);
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.BAD_REQUEST).send('Server error, check API');
    }
  },
);

ChartsRouter.get(
  '/reckoning/month-hours-per-year/:year',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const year = req.params.year;

    try {
      const result = await ChartsController.getHoursPerMonthYearly(year);
      res.status(StatusCodes.ACCEPTED).json(result);
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.BAD_REQUEST).send('Server error, check API');
    }
  },
);

///////USERS PER COMPANY/////////////

ChartsRouter.get(
  '/reckoning/users-per-company/:month/:year',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const month = req.params.month;
    const year = req.params.year;

    try {
      const result = await ChartsController.getUsersPerCompany(month, year);
      res.status(StatusCodes.ACCEPTED).json(result);
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.BAD_REQUEST).send('Server error, check API');
    }
  },
);

ChartsRouter.get(
  '/reckoning/users-per-company-yearly/:year',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const year = req.params.year;

    try {
      const result = await ChartsController.getUsersPerCompanyYearly(year);
      res.status(StatusCodes.ACCEPTED).json(result);
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.BAD_REQUEST).send('Server error, check API');
    }
  },
);

///////GRAPHICS HOURS SUMMARY PER CLIENT/////////////

ChartsRouter.get(
  '/reckoning/graphic-hours-summary-per-client/:month/:year/:clientName',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const year = req.params.year;
    const month = req.params.month;
    const clientName = req.params.clientName;

    try {
      const result = await ChartsController.getClientPersonParticipantsSummary(
        month,
        year,
        clientName,
      );
      res.status(StatusCodes.ACCEPTED).json(result);
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.BAD_REQUEST).send('Server error, check API');
    }
  },
);

ChartsRouter.get(
  '/reckoning/number-of-tasks/:month/:year/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const year = req.params.year;
    const month = req.params.month;

    try {
      const result = await ChartsController.getNumberOfTasks(month, year);
      res.status(StatusCodes.ACCEPTED).json(result);
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.BAD_REQUEST).send('Server error, check API');
    }
  },
);

ChartsRouter.get(
  '/reckoning/number-of-recko-tasks/:month/:year/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const year = req.params.year;
    const month = req.params.month;

    try {
      const result = await ChartsController.getNumberOfReckoTasks(month, year);
      res.status(StatusCodes.ACCEPTED).json(result);
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.BAD_REQUEST).send('Server error, check API');
    }
  },
);
