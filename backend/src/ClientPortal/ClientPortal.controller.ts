import { CompanyModel } from '../Company/Company.model';
import { ReckoningTaskModel } from '../Reckoning/Reckoning.model';

// Only fields the client may see. Author (with password hash), description,
// comments and print info stay internal.
const clientFields = [
  'searchID',
  'client',
  'clientPerson',
  'title',
  'taskType',
  'isSettled',
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

    return ReckoningTaskModel.find({
      client: companyName,
      'participants.months.createdAt': {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .select(clientFields)
      .sort({ searchID: 1 })
      .exec();
  },
};
