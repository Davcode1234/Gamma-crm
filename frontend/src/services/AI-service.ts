import { Config } from '../config';

export async function getAImonthSummary({ snapshot }) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/ai/month-summary`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(snapshot),
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
