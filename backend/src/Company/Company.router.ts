import { Router } from 'express';
import passport from 'passport';
import { CompanyController } from './Company.controller';
import { StatusCodes } from 'http-status-codes';
import '../Auth/Passport';
import { permit } from '../Auth/permit';

export const CompanyRouter = Router();

CompanyRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const companies = await CompanyController.getCompanies();
      res.status(StatusCodes.ACCEPTED).json(companies);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

CompanyRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  permit('admin'),
  async (req, res) => {
    try {
      const company = await CompanyController.getCompany(req.params.id);
      res.status(StatusCodes.ACCEPTED).json(company);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

CompanyRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  permit('admin'),
  async (req, res) => {
    try {
      const newCompany = await CompanyController.addCompany({
        name: req.body.name,
        nip: req.body.nip,
        address: req.body.address,
        website: req.body.website,
        clientPerson: req.body.clientPerson,
        hourRate: req.body.hourRate,
        activeTasks: req.body.activeTasks,
        teamMembers: req.body.teamMembers,
        keyWords: req.body.keyWords,
      });
      res.status(StatusCodes.ACCEPTED).json(newCompany);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

CompanyRouter.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  permit('admin'),
  async (req, res) => {
    try {
      const updatedCompany = await CompanyController.updateCompany(
        req.params.id,
        { ...req.body },
      );
      res.status(StatusCodes.ACCEPTED).json(updatedCompany);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

CompanyRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  permit('admin'),
  async (req, res) => {
    try {
      const deletedTask = await CompanyController.deleteCompany(req.params.id);
      res.status(StatusCodes.ACCEPTED).json(deletedTask);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

// CompanyRouter.post(
//   '/:id/teamMembers',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     try {
//       const teamMember = await CompanyController.addTeamMember(req.params.id, {
//         ...req.body,
//       });
//       res.status(StatusCodes.CREATED).json(teamMember);
//     } catch (error) {
//       console.error(error);
//       res.status(StatusCodes.BAD_REQUEST).json({ error });
//     }
//   },
// );

// CompanyRouter.delete(
//   '/:companyID/teamMembers/:workerID',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     try {
//       const companyID = req.params.companyID;
//       const workerID = req.params.workerID;
//       await CompanyController.deleteTeamMember(companyID, workerID);
//       res.status(StatusCodes.NO_CONTENT).json({});
//     } catch (error) {
//       res.status(StatusCodes.BAD_REQUEST).json({ message: error });
//     }
//   },
// );

CompanyRouter.get(
  '/search/:query?',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const query = req.params.query || '';
      const searchResult = await CompanyController.companySearch(query);
      res.status(StatusCodes.ACCEPTED).json(searchResult);
    } catch (error) {
      console.error('Error', error.message);
      res.status(StatusCodes.BAD_GATEWAY).json({ message: error.message });
    }
  },
);

CompanyRouter.get(
  '/reckoning/:company/:monthIndex',
  passport.authenticate('jwt', { session: false }),
  permit('admin'),
  async (req, res) => {
    try {
      const company = req.params.company || '';
      const monthIndex = req.params.monthIndex;
      const reckoTasks = await CompanyController.getCompanyReckoTasks(
        company,
        monthIndex,
      );
      res.status(StatusCodes.ACCEPTED).json({ reckoTasks });
    } catch (error) {
      console.error('Error', error.message);
      res.status(StatusCodes.BAD_GATEWAY).json({ message: error.message });
    }
  },
);
