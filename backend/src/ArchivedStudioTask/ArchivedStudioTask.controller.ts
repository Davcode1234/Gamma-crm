import { ArchivedStudioTaskModel } from './ArchivedStudioTask.model';

export const ArchivedStudioTaskController = {
  async getArchivedStudioTasks() {
    const ArchivedStudioTasks = await ArchivedStudioTaskModel.find()
      .sort({ index: 1 })
      .exec();
    return ArchivedStudioTasks;
  },
  async getArchivedStudioTask(id) {
    const ArchivedStudioTask =
      await ArchivedStudioTaskModel.findById(id).exec();
    return ArchivedStudioTask;
  },
  async addArchivedStudioTask(ArchivedStudioTask) {
    await ArchivedStudioTaskModel.validate(ArchivedStudioTask);
    const newArchivedStudioTask =
      await ArchivedStudioTaskModel.create(ArchivedStudioTask);
    return newArchivedStudioTask;
  },

  async updateArchivedStudioTask(id, body) {
    const updatedArchivedStudioTask =
      await ArchivedStudioTaskModel.findByIdAndUpdate(id, body);

    return updatedArchivedStudioTask;
  },

  async deleteArchivedStudioTask(id) {
    return await ArchivedStudioTaskModel.findByIdAndDelete(id);
  },

  async archivedStudioTaskSearch(query) {
    const archivedStudioTasks =
      await ArchivedStudioTaskController.getArchivedStudioTasks();

    if (!query || query.trim() === '') {
      return archivedStudioTasks;
    }

    if (query === 'all') {
      return archivedStudioTasks;
    }

    const filteredArchivedStudioTasks = archivedStudioTasks.filter(
      (archivedStudioTask) => {
        return (
          archivedStudioTask.title
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          archivedStudioTask.searchID.toString().includes(query) ||
          archivedStudioTask.client
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          archivedStudioTask.clientPerson
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          archivedStudioTask.status
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          archivedStudioTask.participants.some(
            (member) =>
              member.name.toLowerCase().includes(query.toLowerCase()) ||
              member.lastname.toLowerCase().includes(query.toLowerCase()),
          ) ||
          archivedStudioTask.description
            .toLowerCase()
            .includes(query.toLowerCase())
        );
      },
    );

    return filteredArchivedStudioTasks;
  },
};
