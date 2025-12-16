import { Config } from '../config';

export type User = {
  _id: string;
  email: string;
  img: string;
  job: string;
  lastname: string;
  name: string;
  password: string;
  phone: number;
  roles: string[];
};

export async function getAllUsers(): Promise<User[] | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    if (Config.isDev) {
      throw new Error('User by ID', error.message);
    }
    return null;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/${id}`,
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
      throw new Error('User by ID', error.message);
    }
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/me`,
      {
        credentials: 'include',
      }
    );
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    if (Config.isDev) {
      throw new Error('Current user', error.message);
    }
    return null;
  }
}

export async function UpdateUser({ id, userData }) {
  const formData = {
    id,
    ...userData,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/${id}`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error(error);
    if (Config.isDev) {
      throw new Error('Update user', error.message);
    }
    return null;
  }
}

export async function deleteUser(id: string) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/${id}`,
      {
        method: 'DELETE',
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
      throw new Error('Current user', error.message);
    }
    return null;
  }
}

export async function getUserProfileSummary(
  month: number,
  year: number,
  yearlySummary: boolean,
  userId: string
) {
  const fetchUrl = yearlySummary
    ? `/api/dashboard/reckoning/user-hours-per-year/${year}/${userId}`
    : `/api/dashboard/reckoning/user-hours-per-day/${month}/${year}/${userId}`;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${fetchUrl}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    if (Config.isDev) {
      throw new Error('Get month summary', error.message);
    }
    console.error(error.message);
    return null;
  }
}
