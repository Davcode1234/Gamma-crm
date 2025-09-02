import { Config } from '../config';
import { User } from './users-service';

type Subtask = {
  content: string;
  done: boolean;
};

export type StudioTaskTypes = {
  _id?: string;
  searchID: number;
  reckoTaskID: string;
  title: string;
  client: string;
  clientPerson: string;
  status:
    | 'do_wzięcia'
    | 'na_później'
    | 'do_zrobienia'
    | 'w_trakcie'
    | 'wysłane';
  index: number;
  author: Omit<User, 'password'>;
  taskType: string;
  participants: Omit<User, 'password'>[];
  description: string;
  subtasks: Subtask[];
  deadline: string;
  startDate: Date;
};

export async function getAllStudioTasks() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/studiotasks`,
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
      throw new Error('Get users', error.message);
    }
    console.error(error.message);
    return null;
  }
}

export async function getPlackerTasks() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/studiotasks/placker`,
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
      throw new Error('Get users', error.message);
    }
    console.error(error.message);
    return null;
  }
}

export async function getStudioTask(id: string) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/studiotasks/${id}`,
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
      throw new Error('Get users', error.message);
    }
    console.error(error.message);
    return null;
  }
}

export async function getHighestSearchID(year, month) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/studiotasks/${year}/${month}`,
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
      throw new Error('Get users', error.message);
    }
    console.error(error.message);
    return null;
  }
}

export async function addStudioTask({
  searchID,
  reckoTaskID,
  title,
  client,
  clientPerson,
  status,
  index,
  author,
  taskType,
  participants,
  description,
  subtasks,
  deadline,
  startDate,
}: StudioTaskTypes) {
  const formData = {
    searchID,
    reckoTaskID,
    title,
    client,
    clientPerson,
    status,
    index,
    author,
    taskType,
    participants,
    description,
    subtasks,
    deadline,
    startDate,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/studiotasks`,
      {
        method: 'POST',
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
    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    if (Config.isDev) {
      throw new Error('Get users', error.message);
    }
    console.error(error.message);
    return null;
  }
}

export async function UpdateStudioTask({ id, studioTaskData }) {
  const formData = {
    id,
    ...studioTaskData,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/studiotasks/${id}`,
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
      throw new Error('Update studio task', error.message);
    }
    return null;
  }
}

export async function deleteTask(id: string) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/studiotasks/${id}`,
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
    return null;
  } catch (error) {
    if (Config.isDev) {
      throw new Error('Delete studio task', error.message);
    }
    return null;
  }
}

export async function addSubtask({ taskId, content, done }) {
  try {
    const subtaskBody = {
      content,
      done,
    };
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/studiotasks/${taskId}/subtasks`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subtaskBody),
      }
    );
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    if (Config.isDev) {
      throw new Error('Add subtask', error.message);
    }
    return null;
  }
}

export async function updateSubtask({ taskId, subtaskId, subtaskData }) {
  try {
    const subtaskBody = {
      ...subtaskData,
    };
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/studiotasks/${taskId}/subtasks/${subtaskId}`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subtaskBody),
      }
    );
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    if (Config.isDev) {
      throw new Error('Update subtask', error.message);
    }
    return null;
  }
}

export async function deleteSubtask(taskId: string, subtaskId: string) {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/studiotasks/${taskId}/subtasks/${subtaskId}`,
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
    return null;
  } catch (error) {
    if (Config.isDev) {
      throw new Error('Delete subtask', error.message);
    }
    return null;
  }
}
