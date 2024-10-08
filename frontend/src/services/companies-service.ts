import { Config } from '../config';

export type CompaniesType = {
  _id?: string;
  name: string;
  phone: string;
  mail: string;
  website: string;
  activeTasks: number;
  teamMembers: object[];
};

export async function getAllCompanies(): Promise<CompaniesType[] | null> {
  try {
    const response = await fetch(
      'https://gamma-crm.onrender.com/api/companies',
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    if (Config.isDev) {
      throw new Error('Get Companies', error.message);
    }
    return null;
  }
}
