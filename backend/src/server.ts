require('dotenv').config();
const express = require('express');
import './Auth/Passport';
import fs from 'fs';
const mongoose = require('mongoose');
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import { AuthRouter } from './Auth/Auth.router';
import { UserRouter } from './User/User.router';
import { TaskRouter } from './Tasks/Task.router';
import { CompanyRouter } from './Company/Company.router';
import { StudioTaskRouter } from './StudioTask/StudioTask.router';
import { ArchivedStudioTaskRouter } from './ArchivedStudioTask/ArchivedStudioTask.router';
import {
  MoveStudioTaskRouter,
  unArchiveStudioTaskRouter,
} from './MoveStudioTask/MoveStudioTask.router';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import { ReckoningTaskRouter } from './Reckoning/Reckoning.router';
import { ChartsRouter } from './Charts/Charts.router';
import { ClientRouter } from './Client/Client.router';
import { AIRouter } from './AI/AI.router';
import { ClientPortalRouter } from './ClientPortal/ClientPortal.router';
import passport from 'passport';
import { permit } from './Auth/permit';

var corsOptions = {
  origin: [
    'https://gamma-crm-frontend.onrender.com',
    'https://gamma-crm-frontend-production.onrender.com',
    'http://localhost:5173',
  ],
  default: 'https://gamma-crm-frontend.onrender.com',
  methods: 'GET,POST,PUT,PATCH,DELETE',
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'https://gamma-crm-frontend.onrender.com',
      'https://gamma-crm-frontend-production.onrender.com',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database');
    server.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
app.get('/', (req, res) => {
  res.send('Gamma mail API');
});

app.use(cors(corsOptions));
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
// Routers used only by the studio staff. Client accounts get 403 here and use
// /api/client-portal instead.
const staffOnly = [
  passport.authenticate('jwt', { session: false }),
  permit('admin', 'grafik', 'marketing'),
];

app.use('/api/auth', AuthRouter);
app.use('/api/users', UserRouter);
app.use('/api/tasks', staffOnly, TaskRouter);
app.use('/api/companies', staffOnly, CompanyRouter);
app.use('/api/studiotasks', staffOnly, StudioTaskRouter);
app.use('/api/reckoningtasks', staffOnly, ReckoningTaskRouter);
app.use('/api/archivedstudiotasks', staffOnly, ArchivedStudioTaskRouter);
app.use('/api/move-studiotask', staffOnly, MoveStudioTaskRouter);
app.use('/api/unarchive-sudiotask', staffOnly, unArchiveStudioTaskRouter);
app.use('/api/dashboard', staffOnly, ChartsRouter);
app.use('/api/clients', staffOnly, ClientRouter);
app.use('/api/client-portal', ClientPortalRouter);
app.use('/api/ai', AIRouter);
app.get('/api/status', (req, res) => res.status(200).json({ ok: true }));

////Socket
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  ///////////////STUDIO TASKS SOCKETS///////////////////////

  socket.on('taskUpdated', (task) => {
    io.emit('refreshTasks', task);
  });

  socket.on('tasksUpdated', (tasks) => {
    socket.broadcast.emit('updateTasks', tasks);
  });

  socket.on('taskAdded', (task) => {
    socket.broadcast.emit('addTask', task);
  });

  socket.on('taskDeleted', (task) => {
    socket.broadcast.emit('deleteTask', task);
  });

  socket.on('taskArchived', (task) => {
    socket.broadcast.emit('archiveTask', task);
  });

  socket.on('taskUnarchived', (task) => {
    socket.broadcast.emit('unArchiveTask', task);
  });

  socket.on('subtaskUpdated', (subtask) => {
    socket.broadcast.emit('updateSubtask', subtask);
  });

  socket.on('dragConditionOff', (condition) => {
    // io.emit('disableDrag', condition);
    socket.broadcast.emit('disableDrag', condition);
  });

  socket.on('dragConditionOn', (condition) => {
    // io.emit('enableDrag', condition);
    socket.broadcast.emit('enableDrag', condition);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
