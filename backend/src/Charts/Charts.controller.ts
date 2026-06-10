import { ArchivedStudioTaskModel } from '../ArchivedStudioTask/ArchivedStudioTask.model';
import { ReckoningTaskModel } from '../Reckoning/Reckoning.model';
import { StudioTaskModel } from '../StudioTask/StudioTask.model';

export const ChartsController = {
  ///////CLIENTS PER HOUR/////////////
  async getClientsPerHour(month, year) {
    const companiesMonthSummary = await ReckoningTaskModel.aggregate([
      {
        $unwind: '$participants',
      },
      {
        $unwind: '$participants.months',
      },
      {
        $unwind: '$participants.months.hours',
      },
      {
        $addFields: {
          monthDate: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },
      {
        $addFields: {
          month: { $month: '$monthDate' },
          year: { $year: '$monthDate' },
        },
      },
      {
        $match: {
          ...(month ? { month: parseInt(month, 10) } : {}),
          ...(year ? { year: parseInt(year, 10) } : {}),
        },
      },
      {
        $group: {
          _id: '$client',
          Suma_godzin: { $sum: '$participants.months.hours.hourNum' },
        },
      },
      {
        $sort: { Suma_godzin: -1 },
      },
    ]);

    return await companiesMonthSummary;
  },

  async getUsersExternalHours(month, year) {
    const designersMonthSummary = await ReckoningTaskModel.aggregate([
      {
        $unwind: '$participants',
      },
      {
        $unwind: '$participants.months',
      },
      {
        $unwind: '$participants.months.hours',
      },
      {
        $addFields: {
          monthDate: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },
      {
        $addFields: {
          month: { $month: '$monthDate' },
          year: { $year: '$monthDate' },
        },
      },
      {
        $match: {
          ...(month ? { month: parseInt(month, 10) } : {}),
          ...(year ? { year: parseInt(year, 10) } : {}),
        },
      },
      {
        $group: {
          _id: '$participants.name', // albo np. '$participants.user.name'
          wewnętnętrzne: {
            $sum: {
              $cond: [
                { $in: ['$client', ['COTE', 'GAMMA']] },
                '$participants.months.hours.hourNum',
                0,
              ],
            },
          },
          zewnętrzne: {
            $sum: {
              $cond: [
                { $in: ['$client', ['COTE', 'GAMMA']] },
                0,
                '$participants.months.hours.hourNum',
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          external: 1,
          internal: 1,
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
    ]);

    return await designersMonthSummary;
  },

  async getUserClientsMonthly(month, year, userId) {
    const userClientsSummary = ReckoningTaskModel.aggregate([
      {
        $unwind: '$participants',
      },
      {
        $unwind: '$participants.months',
      },
      {
        $unwind: '$participants.months.hours',
      },
      {
        $addFields: {
          monthDate: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },
      {
        $addFields: {
          month: { $month: '$monthDate' },
          year: { $year: '$monthDate' },
          userIdStr: { $toString: '$participants._id' },
        },
      },
      {
        $match: {
          ...(month ? { month: parseInt(month, 10) } : {}),
          ...(year ? { year: parseInt(year, 10) } : {}),
          ...(userId ? { userIdStr: userId } : {}),
        },
      },

      {
        $group: {
          _id: '$client',
          Suma_godzin: { $sum: '$participants.months.hours.hourNum' },
        },
      },
      {
        $sort: { Suma_godzin: -1 },
      },
    ]);
    return await userClientsSummary;
  },

  async getUserClientsYearly(year, userId) {
    const userClientsSummary = ReckoningTaskModel.aggregate([
      {
        $unwind: '$participants',
      },
      {
        $unwind: '$participants.months',
      },
      {
        $unwind: '$participants.months.hours',
      },
      {
        $addFields: {
          monthDate: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },
      {
        $addFields: {
          year: { $year: '$monthDate' },
          userIdStr: { $toString: '$participants._id' },
        },
      },
      {
        $match: {
          ...(year ? { year: parseInt(year, 10) } : {}),
          ...(userId ? { userIdStr: userId } : {}),
        },
      },

      {
        $group: {
          _id: '$client',
          Suma_godzin: { $sum: '$participants.months.hours.hourNum' },
        },
      },
      {
        $sort: { Suma_godzin: -1 },
      },
    ]);
    return await userClientsSummary;
  },

  async getClientPersonParticipantsSummary(month, year, clientName) {
    const result = await ReckoningTaskModel.aggregate([
      // Dopasowanie po nazwie klienta
      {
        $match: {
          clientPerson: clientName,
        },
      },
      { $unwind: '$participants' },
      { $unwind: '$participants.months' },
      { $unwind: '$participants.months.hours' },
      // Dodanie daty z pola months.createdAt
      {
        $addFields: {
          date: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },
      {
        $addFields: {
          hourNum: '$participants.months.hours.hourNum',
          month: { $month: '$date' },
          year: { $year: '$date' },
        },
      },
      // // Filtrowanie po miesiącu i roku
      {
        $match: {
          ...(month ? { month: parseInt(month, 10) } : {}),
          ...(year ? { year: parseInt(year, 10) } : {}),
        },
      },
      // // Grupowanie godzin po clientPerson + uczestniku
      {
        $group: {
          _id: {
            clientPerson: '$clientPerson',
            participantName: '$participants.name',
          },
          totalHours: { $sum: '$hourNum' },
        },
      },
      // // Grupowanie per clientPerson, zbieranie uczestników do tablicy
      {
        $group: {
          _id: '$_id.clientPerson',
          participants: {
            $push: {
              name: '$_id.participantName',
              hours: '$totalHours',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          clientPerson: '$_id',
          participants: 1,
        },
      },
    ]);

    return result || { clientPerson: clientName, participants: [] };
  },

  async getClientsPerHourYearly(year) {
    const companiesMonthSummary = await ReckoningTaskModel.aggregate([
      {
        $unwind: '$participants',
      },
      {
        $unwind: '$participants.months',
      },
      {
        $unwind: '$participants.months.hours',
      },
      {
        $addFields: {
          monthDate: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },
      {
        $addFields: {
          month: { $month: '$monthDate' },
          year: { $year: '$monthDate' },
        },
      },
      {
        $match: {
          ...(year ? { year: parseInt(year, 10) } : {}),
        },
      },
      {
        $group: {
          _id: '$client',
          Suma_godzin: { $sum: '$participants.months.hours.hourNum' },
        },
      },
      {
        $sort: { Suma_godzin: -1 },
      },
    ]);

    return await companiesMonthSummary;
  },

  ///////USERS PER DAY/////////////

  async getUsersMonthSummary(month, year) {
    const usersMonthSummary = await ReckoningTaskModel.aggregate([
      { $unwind: '$participants' },
      { $unwind: '$participants.months' },
      { $unwind: '$participants.months.hours' },

      {
        $addFields: {
          date: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },

      {
        $addFields: {
          userId: '$participants._id',
          day: '$participants.months.hours.dayIndex',
          isWeekend: '$participants.months.hours.isWeekend',
          month: { $month: '$date' },
          year: { $year: '$date' },
        },
      },

      {
        $match: {
          ...(month ? { month: parseInt(month, 10) } : {}),
          ...(year ? { year: parseInt(year, 10) } : {}),
        },
      },

      {
        $group: {
          _id: {
            userId: '$userId',
            name: '$participants.name',
            img: '$participants.img',
            day: '$day',
            isWeekend: '$isWeekend',
          },
          totalHours: { $sum: '$participants.months.hours.hourNum' },
        },
      },
      {
        $group: {
          _id: '$_id.userId',
          name: { $first: '$_id.name' },
          img: { $first: '$_id.img' },
          days: {
            $push: {
              isWeekend: '$_id.isWeekend',
              day: '$_id.day',
              totalHours: '$totalHours',
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
      { $unwind: '$days' },
      { $sort: { _id: 1, 'days.day': 1 } },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          img: { $first: '$img' },
          days: { $push: '$days' },
        },
      },
    ]);

    return await usersMonthSummary;
  },

  async getUsersMonthSummaryYearly(year) {
    const rawSummary = await ReckoningTaskModel.aggregate([
      { $unwind: '$participants' },
      { $unwind: '$participants.months' },
      { $unwind: '$participants.months.hours' },

      {
        $addFields: {
          date: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },

      {
        $addFields: {
          userId: '$participants._id',
          month: { $month: '$date' },
          year: { $year: '$date' },
        },
      },

      {
        $match: {
          ...(year ? { year: parseInt(year, 10) } : {}),
        },
      },

      {
        $group: {
          _id: {
            userId: '$userId',
            name: '$participants.name',
            img: '$participants.img',
            month: '$month',
          },
          totalHours: { $sum: '$participants.months.hours.hourNum' },
        },
      },

      {
        $group: {
          _id: '$_id.userId',
          name: { $first: '$_id.name' },
          img: { $first: '$_id.img' },
          months: {
            $push: {
              month: '$_id.month',
              totalHours: '$totalHours',
            },
          },
        },
      },

      { $sort: { _id: 1 } },
    ]);

    // Uzupełnianie brakujących miesięcy 1–12
    const filledSummary = rawSummary.map((user) => {
      const fullMonths = Array.from({ length: 12 }, (_, i) => {
        const found = user.months.find((m) => m.month === i + 1);
        return {
          month: i + 1,
          totalHours: found ? found.totalHours : 0,
        };
      });

      return {
        _id: user._id,
        name: user.name,
        img: user.img,
        months: fullMonths,
      };
    });

    return filledSummary;
  },
  ///////HOURS PER DAY/////////////

  async getHoursPerDay(month, year) {
    const monthHoursSummary = await ReckoningTaskModel.aggregate([
      { $unwind: '$participants' },
      { $unwind: '$participants.months' },
      { $unwind: '$participants.months.hours' },

      {
        $addFields: {
          date: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },

      {
        $addFields: {
          day: '$participants.months.hours.dayIndex',
          hourNum: '$participants.months.hours.hourNum',
          month: { $month: { $toDate: '$participants.months.createdAt' } },
          year: { $year: { $toDate: '$participants.months.createdAt' } },
        },
      },

      {
        $match: {
          ...(month ? { month: parseInt(month, 10) } : {}),
          ...(year ? { year: parseInt(year, 10) } : {}),
        },
      },

      {
        $group: {
          _id: {
            day: '$day',
          },
          totalHours: { $sum: '$hourNum' },
        },
      },

      {
        $project: {
          _id: 0,
          day: '$_id.day',
          totalHours: 1,
        },
      },

      {
        $sort: { day: 1 },
      },
    ]);

    return await monthHoursSummary;
  },

  ///////User HOURS PER DAY/////////////

  async getUsersHoursPerDay(month, year, userId) {
    const monthHoursSummary = await ReckoningTaskModel.aggregate([
      { $unwind: '$participants' },
      { $unwind: '$participants.months' },
      { $unwind: '$participants.months.hours' },

      {
        $addFields: {
          date: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },

      {
        $addFields: {
          userIdStr: { $toString: '$participants._id' },
          day: '$participants.months.hours.dayIndex',
          hourNum: '$participants.months.hours.hourNum',
          month: { $month: { $toDate: '$participants.months.createdAt' } },
          year: { $year: { $toDate: '$participants.months.createdAt' } },
        },
      },

      {
        $match: {
          ...(month ? { month: parseInt(month, 10) } : {}),
          ...(year ? { year: parseInt(year, 10) } : {}),
          ...(userId ? { userIdStr: userId } : {}),
        },
      },

      {
        $group: {
          _id: {
            day: '$day',
          },
          totalHours: { $sum: '$hourNum' },
        },
      },

      {
        $project: {
          _id: 0,
          day: '$_id.day',
          totalHours: 1,
        },
      },

      {
        $sort: { day: 1 },
      },
    ]);

    return await monthHoursSummary;
  },

  async getUserHoursYearly(year, userId) {
    const userYearSummary = await ReckoningTaskModel.aggregate([
      { $unwind: '$participants' },
      { $unwind: '$participants.months' },
      { $unwind: '$participants.months.hours' },

      {
        $addFields: {
          date: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },

      {
        $addFields: {
          userIdStr: { $toString: '$participants._id' },

          day: '$participants.months.hours.dayIndex',
          hourNum: '$participants.months.hours.hourNum',
          month: { $month: { $toDate: '$participants.months.createdAt' } },
          year: { $year: { $toDate: '$participants.months.createdAt' } },
        },
      },

      {
        $match: {
          ...(year ? { year: parseInt(year, 10) } : {}),
          ...(userId ? { userIdStr: userId } : {}),
        },
      },

      {
        $group: {
          _id: {
            month: '$month',
          },
          totalHours: { $sum: '$hourNum' },
        },
      },

      {
        $project: {
          _id: 0,
          month: '$_id.month',
          totalHours: 1,
        },
      },

      {
        $sort: { month: 1 },
      },
    ]);

    return await userYearSummary;
  },

  async getHoursPerMonthYearly(year) {
    const monthHoursSummary = await ReckoningTaskModel.aggregate([
      { $unwind: '$participants' },
      { $unwind: '$participants.months' },
      { $unwind: '$participants.months.hours' },

      {
        $addFields: {
          date: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },

      {
        $addFields: {
          day: '$participants.months.hours.dayIndex',
          hourNum: '$participants.months.hours.hourNum',
          month: { $month: { $toDate: '$participants.months.createdAt' } },
          year: { $year: { $toDate: '$participants.months.createdAt' } },
        },
      },

      {
        $match: {
          ...(year ? { year: parseInt(year, 10) } : {}),
        },
      },

      {
        $group: {
          _id: {
            month: '$month',
          },
          totalHours: { $sum: '$hourNum' },
        },
      },

      {
        $project: {
          _id: 0,
          month: '$_id.month',
          totalHours: 1,
        },
      },

      {
        $sort: { month: 1 },
      },
    ]);

    return await monthHoursSummary;
  },
  ///////TASK TYPES/////////////

  async getStudioTasksTypesSummary() {
    const tasksByType = await StudioTaskModel.aggregate([
      {
        $group: {
          _id: '$taskType',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          taskType: '$_id',
          count: 1,
        },
      },
    ]);

    return await tasksByType;
  },

  async getArchivedStudioTasksTypesSummary() {
    const tasksByType = await ArchivedStudioTaskModel.aggregate([
      {
        $group: {
          _id: '$taskType',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          taskType: '$_id',
          count: 1,
        },
      },
    ]);

    return await tasksByType;
  },

  ///////USERS PER COMPANY/////////////

  async getUsersPerCompany(month, year) {
    const usersPerCompany = ReckoningTaskModel.aggregate([
      { $unwind: '$participants' },
      { $unwind: '$participants.months' },
      { $unwind: '$participants.months.hours' },

      {
        $addFields: {
          date: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },

      {
        $addFields: {
          userId: '$participants._id',
          month: { $month: '$date' },
          year: { $year: '$date' },
        },
      },

      {
        $match: {
          ...(month ? { month: parseInt(month, 10) } : {}),
          ...(year ? { year: parseInt(year, 10) } : {}),
        },
      },

      {
        $group: {
          _id: {
            userId: '$userId',
            name: '$participants.name',
            company: '$client',
          },

          totalHours: { $sum: '$participants.months.hours.hourNum' },
        },
      },

      {
        $group: {
          _id: {
            name: '$_id.name',
            userId: '$_id.userId',
          },
          companies: {
            $push: {
              name: '$_id.company',
              totalHours: '$totalHours',
            },
          },
        },
      },
    ]);

    return await usersPerCompany;
  },

  async getUsersPerCompanyYearly(year) {
    const usersPerCompany = ReckoningTaskModel.aggregate([
      { $unwind: '$participants' },
      { $unwind: '$participants.months' },
      { $unwind: '$participants.months.hours' },

      {
        $addFields: {
          date: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },

      {
        $addFields: {
          userId: '$participants._id',
          year: { $year: '$date' },
        },
      },

      {
        $match: {
          ...(year ? { year: parseInt(year, 10) } : {}),
        },
      },

      {
        $group: {
          _id: {
            userId: '$userId',
            name: '$participants.name',
            company: '$client',
          },

          totalHours: { $sum: '$participants.months.hours.hourNum' },
        },
      },

      {
        $group: {
          _id: {
            name: '$_id.name',
            userId: '$_id.userId',
          },
          companies: {
            $push: {
              name: '$_id.company',
              totalHours: '$totalHours',
            },
          },
        },
      },
    ]);

    return await usersPerCompany;
  },

  async getNumberOfTasks(month, year) {
    const result = await StudioTaskModel.aggregate([
      {
        $addFields: {
          start: { $toDate: '$startDate' },
          month: { $month: { $toDate: '$startDate' } },
          year: { $year: { $toDate: '$startDate' } },
        },
      },
      {
        $match: {
          ...(month ? { month: parseInt(month, 10) } : {}),
          ...(year ? { year: parseInt(year, 10) } : {}),
        },
      },
      {
        $count: 'taskCount',
      },
    ]);

    return result.length > 0 ? result[0].taskCount : 0;
  },
  async getNumberOfReckoTasks(month, year) {
    const result = await ReckoningTaskModel.aggregate([
      {
        $addFields: {
          start: { $toDate: '$startDate' },
          month: { $month: { $toDate: '$startDate' } },
          year: { $year: { $toDate: '$startDate' } },
        },
      },
      {
        $match: {
          ...(month ? { month: parseInt(month, 10) } : {}),
          ...(year ? { year: parseInt(year, 10) } : {}),
        },
      },
      {
        $count: 'taskCount',
      },
    ]);

    return result.length > 0 ? result[0].taskCount : 0;
  },
};
