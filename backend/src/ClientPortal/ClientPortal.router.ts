import { Router } from 'express';
import passport from 'passport';
import { StatusCodes } from 'http-status-codes';
import '../Auth/Passport';
import { permit } from '../Auth/permit';
import { ClientPortalController } from './ClientPortal.controller';

export const ClientPortalRouter = Router();

// The company is always taken from the logged-in client account, never from
// the request, so a client can only ever read their own company's data.
ClientPortalRouter.get(
  '/company',
  passport.authenticate('jwt', { session: false }),
  permit('client'),
  async (req, res) => {
    try {
      const company = await ClientPortalController.getClientCompany(
        (req.user as any).company,
      );
      if (!company) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Company not found' });
        return;
      }
      res.status(StatusCodes.OK).json(company);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);

ClientPortalRouter.get(
  '/reckoning/:monthIndex/:yearIndex',
  passport.authenticate('jwt', { session: false }),
  permit('client'),
  async (req, res) => {
    try {
      const company = await ClientPortalController.getClientCompany(
        (req.user as any).company,
      );
      if (!company) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Company not found' });
        return;
      }
      const reckoTasks = await ClientPortalController.getClientReckoTasks(
        company.name,
        req.params.monthIndex,
        req.params.yearIndex,
      );
      if (reckoTasks === null) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Invalid month or year' });
        return;
      }
      res.status(StatusCodes.OK).json({ reckoTasks });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);
