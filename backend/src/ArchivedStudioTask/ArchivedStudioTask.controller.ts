import { ArchivedStudioTaskModel } from './ArchivedStudioTask.model';

export const ArchivedStudioTaskController = {
  async getArchivedStudioTasks(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [archivedStudioTasks, totalCount] = await Promise.all([
      ArchivedStudioTaskModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      ArchivedStudioTaskModel.countDocuments(),
    ]);

    const hasMore = skip + archivedStudioTasks.length < totalCount;

    return {
      data: archivedStudioTasks,
      hasMore,
    };
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

  async archivedStudioTaskSearch(query: string) {
    if (!query || query.trim() === '' || query === 'all') {
      return [];
    }

    const regex = new RegExp(query, 'i');

    const numericQuery = Number(query);
    const isNumber = !isNaN(numericQuery);

    const searchConditions: any[] = [
      { title: regex },
      { client: regex },
      { clientPerson: regex },
      { status: regex },
      { description: regex },
      { 'participants.name': regex },
      { 'participants.lastname': regex },
    ];

    if (isNumber) {
      searchConditions.push({ searchID: numericQuery });
    }

    const filteredArchivedStudioTasks = await ArchivedStudioTaskModel.find({
      $or: searchConditions,
    });

    return filteredArchivedStudioTasks;
  },
};
