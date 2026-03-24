import { Config } from '../config';

type Note = {
  _id: string;
  date: string;
  text: string;
  author: string;
};

export type ClientsType = {
  _id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  notes: Note[];
};

export async function getAllClients(): Promise<ClientsType[] | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients`,
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
      throw new Error('Get Clients', error.message);
    }
    return null;
  }
}

export async function getCurrentClient(
  id: string
): Promise<ClientsType | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients/${id}`,
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
      throw new Error('Get Client', error.message);
    }
    return null;
  }
}

export async function getClientsByCompany(company: string) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients/bycompany/${company}`,
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
      throw new Error('Get Client', error.message);
    }
    return null;
  }
}

export async function addClient({ name, company, phone, email, notes }) {
  const formData = {
    name,
    company,
    phone,
    email,
    notes,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients`,
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
    console.error(error);
    if (Config.isDev) {
      throw new Error('Add client', error.message);
    }
    return null;
  }
}

export async function addManyClients(clients) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients/bulk`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clients),
      }
    );

    if (response.ok) {
      return await response.json();
    }

    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    console.error(error);
    if (Config.isDev) {
      throw new Error('Add client', error.message);
    }
    return null;
  }
}

export async function deleteManyClients(clientIds) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients/bulk`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientIds),
      }
    );

    if (response.ok) {
      return await response.json();
    }

    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    console.error(error);
    if (Config.isDev) {
      throw new Error('Add client', error.message);
    }
    return null;
  }
}

export async function addNote({ text, date, clientID }) {
  const formData = {
    text,
    date,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients/${clientID}/notes`,
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
    console.error(error);
    if (Config.isDev) {
      throw new Error('Add client', error.message);
    }
    return null;
  }
}

export async function deleteClient(id) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients/${id}`,
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
    console.error(error);
    if (Config.isDev) {
      throw new Error('Delete client', error.message);
    }
    return null;
  }
}

export async function deleteNote(clientID, noteID) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients/${clientID}/${noteID}/notes`,
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
    console.error(error);
    if (Config.isDev) {
      throw new Error('Delete client', error.message);
    }
    return null;
  }
}

export async function UpdateClient({ id, clientData }) {
  const formData = {
    id,
    ...clientData,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients/${id}`,
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
      throw new Error('Update company', error.message);
    }
    return null;
  }
}

export async function getGraphicsPerClientSummary(month, year, clientName) {
  const fetchUrl = `/api/dashboard/reckoning/graphic-hours-summary-per-client/${month}/${year}/${clientName}`;

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
      throw new Error('Get tasks type summary', error.message);
    }
    console.error(error.message);
    return null;
  }
}
