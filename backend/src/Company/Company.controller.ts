import { ReckoningTaskModel } from '../Reckoning/Reckoning.model';
import { CompanyModel } from './Company.model';

export const CompanyController = {
  async getCompanies() {
    const companies = await CompanyModel.find().sort({ name: 1 }).exec();
    return companies;
  },

  async getCompany(id) {
    const company = await CompanyModel.findById(id).exec();
    return company;
  },

  async addCompany(company) {
    await CompanyModel.validate(company);
    return await CompanyModel.create(company);
  },

  async updateCompany(id, companyBody) {
    return await CompanyModel.findByIdAndUpdate(id, companyBody);
  },

  async deleteCompany(id) {
    return await CompanyModel.findByIdAndDelete(id);
  },

  async addTeamMember(companyID, member) {
    const company = await CompanyController.getCompany(companyID);
    company.teamMembers.push(member);
    await CompanyController.updateCompany(companyID, company);
  },

  async deleteTeamMember(companyID, memberID) {
    const company = await CompanyController.getCompany(companyID);
    company.teamMembers = company.teamMembers.filter((member) => {
      member._id !== memberID;
    });
    await CompanyController.updateCompany(companyID, company);
    const updatedCompany = await CompanyController.getCompany(companyID);
    return updatedCompany.teamMembers;
  },

  async companySearch(query) {
    const companies = await CompanyController.getCompanies();

    if (!query || query.trim() === '') {
      return companies;
    }

    if (query === 'all') {
      return companies;
    }

    const filteredCompanies = companies.filter((company) => {
      return (
        company.name.toLowerCase().includes(query.toLowerCase()) ||
        company.nip.includes(query) ||
        company.address.toLowerCase().includes(query.toLowerCase()) ||
        company.keyWords.some((kw) =>
          kw.label.toLowerCase().includes(query.toLowerCase()),
        ) ||
        company.teamMembers.some(
          (member) =>
            member.name.toLowerCase().includes(query.toLowerCase()) ||
            member.lastname.toLowerCase().includes(query.toLowerCase()),
        ) ||
        company.clientPerson.some((cp) =>
          cp.name.toLowerCase().includes(query.toLowerCase()),
        )
      );
    });

    return filteredCompanies;
  },

  async getCompanyReckoTasks(company, monthIndex, yearIndex, isMultiMonth) {
    if (isMultiMonth) {
      const year = parseInt(yearIndex);

      console.log('trtertertertertvxc');

      const startDate = new Date(Date.UTC(year));

      const tasks = await ReckoningTaskModel.find({
        client: company,
        'participants.months.createdAt': {
          $gte: startDate,
        },
      }).exec();

      return tasks;
    }

    const month = parseInt(monthIndex);
    const year = parseInt(yearIndex);

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    const tasks = await ReckoningTaskModel.find({
      client: company,
      'participants.months.createdAt': {
        $gte: startDate,
        $lt: endDate,
      },
    }).exec();

    return tasks;
  },
};
