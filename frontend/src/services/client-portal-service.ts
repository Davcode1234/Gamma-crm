import { ReckoningTaskTypes } from './reckoning-view-service';

// Data for users with the 'client' role. The backend resolves the company
// from the logged-in account, so no company is sent from here.

// First month the client can see (November 2026, monthIndex is 0-based).
// Keep in sync with CLIENT_PORTAL_START in backend ClientPortal.controller.ts.
export const CLIENT_PORTAL_START = { year: 2026, monthIndex: 10 };

export type ClientReckoTask = Pick<
  ReckoningTaskTypes,
  | '_id'
  | 'searchID'
  | 'client'
  | 'clientPerson'
  | 'title'
  | 'isSettled'
  | 'isReadyForInvoice'
  | 'clientOrderId'
  | 'agreedHours'
  | 'participants'
  | 'startDate'
> & {
  // All hours ever logged on the task (the backend sums every month).
  usedHours: number;
};

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

export async function updateClientReckoTask({
  taskId,
  value,
}: {
  taskId: string;
  value: { isReadyForInvoice?: boolean; clientOrderId?: string };
}) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/client-portal/reckoning/${taskId}`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value),
    }
  );
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
}
