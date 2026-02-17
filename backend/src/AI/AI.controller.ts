import OpenAI from 'openai';
import 'dotenv/config';

const client = new OpenAI({ apiKey: process.env.OPENAIN_API_KEY });

export const AIController = {
  async ChatSummary(snapshot) {
    const prompt = `
    Wygeneruj podsumowanie miesiąca dla dashboardu w języku polskim.
    Zwróć WYŁĄCZNIE poprawny JSON w formacie:
    {
      "title": string,
      "highlights": string[],        // 3-6 punktów
      "clients": { "top": string[], "note": string },
      "team": { "top": string[], "note": string },
      "trends": string[],            // piki/dołki/trendy
      "risks": string[],             // ryzyka / anomalie
      "recommendations": string[]    // 3-6 konkretnych działań
    }
    Używaj liczb z danych. Jeśli czegoś brakuje, napisz to w "risks".
    Dane:
    ${JSON.stringify(snapshot)}
    `;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content:
            'Jesteś analitykiem operacyjnym. Pisz konkretnie, bez lania wody.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const json = completion.choices[0].message.content;
    return json;
  },
};
