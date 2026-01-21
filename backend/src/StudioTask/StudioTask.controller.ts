// import { randomUUID } from 'crypto';
// import { ReckoningTaskModel } from '../Reckoning/Reckoning.model';
import { ArchivedStudioTaskModel } from '../ArchivedStudioTask/ArchivedStudioTask.model';
import { StudioTaskModel } from './StudioTask.model';
import mongoose from 'mongoose';

export const StudioTaskController = {
  async getStudioTasks() {
    const studioTasks = await StudioTaskModel.find().sort({ index: 1 }).exec();
    return studioTasks;
  },

  async getStudioTask(id) {
    const studioTask = await StudioTaskModel.findById(id).exec();
    return studioTask;
  },

  async getHighestSearchIDByMonth(year, month) {
    const startDate = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
    // const endDate = new Date(Date.UTC(Number(year), Number(month), 1));

    const tasks = await StudioTaskModel.find({
      createdAt: { $gte: startDate },
    })
      .sort({ searchID: 1 })
      .exec();

    const archivedTasks = await ArchivedStudioTaskModel.find({
      createdAt: { $gte: startDate },
    })
      .sort({ searchID: 1 })
      .exec();

    if (tasks.length === 0 && archivedTasks.length === 0) {
      return `${year.slice(2, 4)}${month.padStart(2, 0)}0000`;
    }

    const lastItem = tasks[tasks.length - 1];
    const archivedLastItem = archivedTasks[archivedTasks.length - 1];

    // console.log(
    //   'active',
    //   lastItem.searchID,
    //   'archived',
    //   archivedLastItem.searchID,
    //   'większe',
    //   archivedLastItem.searchID > lastItem.searchID,
    //   'równe',
    //   archivedLastItem.searchID === lastItem.searchID,
    // );

    if (
      archivedLastItem.searchID > lastItem.searchID ||
      archivedLastItem.searchID === lastItem.searchID
    ) {
      return String(archivedLastItem.searchID);
    }
    return String(lastItem.searchID);
  },

  async getPlackerTasks() {
    const plackerTasks = await StudioTaskModel.aggregate([
      {
        $match: {
          status: { $in: ['do_zrobienia', 'w_trakcie'] },
        },
      },

      {
        $addFields: {
          allParticipants: '$participants',
        },
      },

      {
        $unwind: '$participants',
      },

      {
        $group: {
          _id: '$participants._id',
          tasks: {
            $push: {
              _id: '$_id',
              searchID: '$searchID',
              reckoTaskID: '$reckoTaskID',
              title: '$title',
              client: '$client',
              clientPerson: '$clientPerson',
              status: '$status',
              index: '$index',
              startDate: '$startDate',
              participants: '$allParticipants', // Using the backup array
              deadline: '$deadline',
              createdAt: '$createdAt',
              author: '$author',
              taskType: '$taskType',
              description: '$description',
              subtasks: '$subtasks',
            },
          },
        },
      },

      {
        $group: {
          _id: 'Placker Tasks',
          pairs: { $push: { id: '$_id', tasks: '$tasks' } },
        },
      },
    ]);

    return plackerTasks;
  },

  async getTasksByCompany() {
    const companyTasks = await StudioTaskModel.aggregate([
      {
        $match: {
          status: { $in: ['do_zrobienia', 'w_trakcie'] },
        },
      },
      {
        $group: {
          _id: '$client',
          tasks: {
            $push: {
              _id: '$_id',
              searchID: '$searchID',
              reckoTaskID: '$reckoTaskID',
              title: '$title',
              client: '$client',
              clientPerson: '$clientPerson',
              status: '$status',
              index: '$index',
              startDate: '$startDate',
              participants: '$participants',
              deadline: '$deadline',
              createdAt: '$createdAt',
              author: '$author',
              taskType: '$taskType',
              description: '$description',
            },
          },
        },
      },
      {
        $group: {
          _id: 'Company Tasks',

          pairs: { $push: { id: '$_id', tasks: '$tasks' } },
        },
      },
    ]);

    return companyTasks;
  },
  async addStudioTask(studioTask) {
    await StudioTaskModel.validate(studioTask);
    return await StudioTaskModel.create(studioTask);
  },

  async updateStudioTask(id, body) {
    return await StudioTaskModel.findByIdAndUpdate(id, body);
  },

  async deleteStudioTask(id) {
    return await StudioTaskModel.findByIdAndDelete(id);
  },
  async addSubtask(taskId, subtask) {
    const task = await StudioTaskController.getStudioTask(taskId);
    task.subtasks.push({ ...subtask, _id: new mongoose.Types.ObjectId() });
    await StudioTaskController.updateStudioTask(taskId, task);
    const updatedStudioTask = await StudioTaskController.getStudioTask(taskId);
    return updatedStudioTask;
  },
  async updateSubtask(taskId, subtaskId, subtask) {
    const task = await StudioTaskController.getStudioTask(taskId);
    task.subtasks = task.subtasks.map((obj) => {
      return String(obj._id) === String(subtaskId)
        ? { ...obj, ...subtask }
        : obj;
    });

    await StudioTaskController.updateStudioTask(taskId, task);
    const updatedStudioTask = await StudioTaskController.getStudioTask(taskId);
    return updatedStudioTask;
  },
  async deleteSubtask(taskId, subtaskId) {
    const task = await StudioTaskController.getStudioTask(taskId);
    task.subtasks = task.subtasks.filter(
      (sub) => String(sub._id) !== String(subtaskId),
    );
    await StudioTaskController.updateStudioTask(taskId, task);
    const updatedStudioTask = await StudioTaskController.getStudioTask(taskId);
    return updatedStudioTask;
  },
};
