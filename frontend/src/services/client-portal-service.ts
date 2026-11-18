import { ReckoningTaskTypes } from './reckoning-view-service';

// Read-only data for users with the 'client' role. The backend resolves the
// company from the logged-in account, so no company is sent from here.

export type ClientReckoTask = Pick<
  ReckoningTaskTypes,
  | '_id'
  | 'searchID'
  | 'client'
  | 'clientPerson'
  | 'title'
  | 'isSettled'
  | 'participants'
  | 'startDate'
> & { taskType?: string };

export type ClientCompany = {
  _id: string;
  name: string;
};

export async function getClientCompany(): Promise<ClientCompany> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/client-portal/company`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getClientReckoTasks({
  monthIndex,
  yearIndex,
}: {
  monthIndex: number;
  yearIndex: number;
}): Promise<ClientReckoTask[]> {
  const response = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/api/client-portal/reckoning/${monthIndex}/${yearIndex}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.reckoTasks ?? [];
}
