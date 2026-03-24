import { TaskModel } from './Task.model';

export const TaskController = {
  async getTasks() {
    const tasks = await TaskModel.find().exec();
    return tasks;
  },

  async getTask(id) {
    const task = await TaskModel.findById(id).exec();
    return task;
  },

  async addTask(task) {
    await TaskModel.validate(task);
    return await TaskModel.create(task);
  },

  async updateTask(id, taskBody) {
    return await TaskModel.findByIdAndUpdate(id, taskBody);
  },

  async deleteTask(id) {
    return await TaskModel.findByIdAndDelete(id);
  },
  async addSubtask(taskID, subtaskID) {
    const task = await TaskController.getTask(taskID);
    task.subtasks.push(subtaskID);
    await TaskController.updateTask(taskID, task);
    const updatedTask = await TaskController.getTask(taskID);
    return updatedTask.subtasks;
  },

  async deleteSubtask(taskID, subtaskID) {
    const task = await TaskController.getTask(taskID);
    // @ts-ignore
    task.subtasks = task.subtasks.filter((subtask) => subtask.id !== subtaskID);
    await TaskController.updateTask(taskID, task);
    const updatedTask = await TaskController.getTask(taskID);
    return updatedTask.subtasks;
  },
};
