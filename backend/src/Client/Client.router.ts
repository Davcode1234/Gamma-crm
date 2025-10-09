import { Router } from 'express';
import passport from 'passport';
import { StatusCodes } from 'http-status-codes';
import '../Auth/Passport';
import { ClientController } from './Client.controller';
import { permit } from '../Auth/permit';

export const ClientRouter = Router();

ClientRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const clients = await ClientController.getClients();
      res.status(StatusCodes.ACCEPTED).json(clients);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ClientRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  permit('admin'),

  async (req, res) => {
    try {
      const client = await ClientController.getClient(req.params.id);
      res.status(StatusCodes.ACCEPTED).json(client);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ClientRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  permit('admin'),
  async (req, res) => {
    try {
      const newClient = await ClientController.addClient({
        name: req.body.name,
        company: req.body.company,
        email: req.body.email,
        phone: req.body.phone,
        notes: req.body.notes,
      });
      res.status(StatusCodes.ACCEPTED).json(newClient);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ClientRouter.post(
  '/bulk',
  passport.authenticate('jwt', { session: false }),
  permit('admin'),
  async (req, res) => {
    try {
      const clients = req.body;

      const newClients = await ClientController.addManyClients(clients);
      res.status(StatusCodes.ACCEPTED).json(newClients);
    } catch (error) {
      res.status(500).json({ error: 'Failed to insert users', details: error });
    }
  },
);

ClientRouter.delete(
  '/bulk',
  passport.authenticate('jwt', { session: false }),
  permit('admin'),
  async (req, res) => {
    try {
      const clientIds = req.body;

      if (!Array.isArray(clientIds)) {
        res.status(400).json({ error: 'Expected array of Ids' });
        return;
      }
      const result = await ClientController.deleteManyClients(clientIds);

      res.status(StatusCodes.ACCEPTED).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to insert users', details: error });
    }
  },
);

ClientRouter.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  permit('admin'),
  async (req, res) => {
    try {
      const updatedCompany = await ClientController.updateClient(
        req.params.id,
        { ...req.body },
      );
      res.status(StatusCodes.ACCEPTED).json(updatedCompany);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ClientRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  permit('admin'),
  async (req, res) => {
    try {
      const deletedClient = await ClientController.deleteClient(req.params.id);
      res.status(StatusCodes.ACCEPTED).json(deletedClient);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ClientRouter.get(
  '/bycompany/:company',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const filteredClients = await ClientController.getClientsPerCompany(
        req.params.company,
      );
      res.status(StatusCodes.ACCEPTED).json(filteredClients);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ClientRouter.post(
  '/:clientID/notes',
  passport.authenticate('jwt', { session: false }),
  permit('admin'),
  async (req, res) => {
    try {
      const clientID = req.params.clientID;
      const note = {
        text: req.body.text,
        date: req.body.date,
        author: req.user.id,
      };

      const updatedNotes = await ClientController.addNote(clientID, note);
      res.status(StatusCodes.ACCEPTED).json(updatedNotes);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ClientRouter.delete(
  '/:clientID/:noteID/notes',
  passport.authenticate('jwt', { session: false }),
  permit('admin'),
  async (req, res) => {
    try {
      const clientID = req.params.clientID;
      const noteID = req.params.noteID;

      const updatedNotes = await ClientController.deleteNote(clientID, noteID);
      res.status(StatusCodes.ACCEPTED).json(updatedNotes);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);
