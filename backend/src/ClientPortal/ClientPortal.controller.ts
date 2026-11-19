import { CompanyModel } from '../Company/Company.model';
import { ReckoningTaskModel } from '../Reckoning/Reckoning.model';

// Clients only see hours from this month on (November 2026).
// Keep in sync with CLIENT_PORTAL_START in frontend client-portal-service.ts.
const CLIENT_PORTAL_START = new Date(Date.UTC(2026, 10, 1));

// Only fields the client may see. Author (with password hash), description,
// comments and print info stay internal.
const clientFields = [
  'searchID',
  'client',
  'clientPerson',
  'title',
  'isSettled',
  'isReadyForInvoice',
  'clientOrderId',
  'agreedHours',
  'startDate',
  'participants._id',
  'participants.isVisible',
  'participants.name',
  'participants.lastname',
  'participants.img',
  'participants.months._id',
  'participants.months.hours',
  'participants.months.createdAt',
].join(' ');

export const ClientPortalController = {
  async getClientCompany(companyId) {
    if (!companyId) return null;
    return CompanyModel.findById(companyId, { name: 1 }).exec();
  },

  async getClientReckoTasks(companyName: string, monthIndex, yearIndex) {
    const month = parseInt(monthIndex);
    const year = parseInt(yearIndex);

    if (Number.isNaN(month) || Number.isNaN(year) || month < 1 || month > 12) {
      return null;
    }

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    if (startDate < CLIENT_PORTAL_START) return [];

    const isInMonth = ({ createdAt }: { createdAt?: Date }) =>
      createdAt >= startDate && createdAt < endDate;

    const tasks = await ReckoningTaskModel.find({
      client: companyName,
      'participants.months.createdAt': {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .select(clientFields)
      .sort({ searchID: 1 })
      .lean()
      .exec();

    // All hours ever logged on the task, for the budget bar.
    const sumAllHours = (task) =>
      task.participants.reduce(
        (taskSum, participant) =>
          taskSum +
          participant.months.reduce(
            (monthSum, month) =>
              monthSum +
              month.hours.reduce((sum, hour) => sum + (hour.hourNum || 0), 0),
            0,
          ),
        0,
      );

    // Send only the hours of the requested month, so older months never
    // reach the client one by one. They are only part of usedHours.
    return tasks.map((task) => ({
      ...task,
      usedHours: sumAllHours(task),
      participants: task.participants.map((participant) => ({
        ...participant,
        months: participant.months.filter(isInMonth),
      })),
    }));
  },

  // The client can only change these two fields, and only on tasks of their
  // own company.
  async updateClientReckoTask(
    companyName: string,
    taskId: string,
    changes: { isReadyForInvoice?: boolean; clientOrderId?: string },
  ) {
    return ReckoningTaskModel.findOneAndUpdate(
      { _id: taskId, client: companyName },
      { $set: changes },
      { new: true, projection: 'isReadyForInvoice clientOrderId' },
    ).exec();
  },
};
