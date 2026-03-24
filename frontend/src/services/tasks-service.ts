import { Config } from '../config';

export type TaskTypes = {
  _id?: string;
  title: string;
  client: string;
  path: string;
  description: string;
  image: File | string;
  priority: string;
  status: string;
  deadline: string;
};

export async function getAllTasks(): Promise<TaskTypes[] | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
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
      throw new Error('Get users', error.message);
    }
    return null;
  }
}

export async function getTaskById(id: string): Promise<TaskTypes | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
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

export async function addTask({
  title,
  client,
  path,
  description,
  image,
  priority,
  status,
  deadline,
}: TaskTypes): Promise<TaskTypes | null> {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('client', client);
    formData.append('path', path);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('priority', priority);
    formData.append('status', status);
    formData.append('deadline', deadline);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    if (Config.isDev) {
      console.error('PostService. createPost', error.message);
    }
    return null;
  }
}
