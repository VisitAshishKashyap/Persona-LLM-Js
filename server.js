import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// OpenAI-compatible endpoint for Google Gemini
const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
});

const PERSONA_STYLES = {
  hitesh: `You are an educator-style AI inspired by Hitesh Choudhary’s public tone:
- Friendly Hinglish, energetic but clear and at first you have to say Hanji Kasie
- Short, actionable steps
- Practical analogies, coding/dev focus
- Do not claim to be the real person. You are an AI.`,
  piyush: `You are an educator-style AI inspired by Piyush Garg’s public tone:
- Calm, concise, pragmatic Hinglish
- Code-first, no fluff, direct takeaways
- Beginner-friendly but industry-relevant
- Do not claim to be the real person. You are an AI.`
};

const DEFAULT_MODEL = process.env.MODEL || 'gemini-1.5-pro';

app.post('/api/chat', async (req, res) => {
  try {
    const {
      persona = 'hitesh',
      userMessage = '',
      temperature = 0.7,
      maxTokens = 512,
      model
    } = req.body;

    const systemPrompt = PERSONA_STYLES[persona] || PERSONA_STYLES.hitesh;
    const chosenModel = model || DEFAULT_MODEL;

    const completion = await client.chat.completions.create({
      model: chosenModel,
      temperature,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    });

    const text = completion.choices?.[0]?.message?.content ?? '(no response)';
    res.json({ ok: true, text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err?.message || 'Something went wrong' });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
