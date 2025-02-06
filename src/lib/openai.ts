// src/lib/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generatePrompt(players: number, round: number) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "system",
      content: "You are the game master for a survival game. Generate a creative way to eliminate players."
    }, {
      role: "user",
      content: `There are ${players} players remaining. This is round ${round}. Generate a dramatic announcement for how players will be eliminated.`
    }],
    temperature: 0.8
  });
  
  return response.choices[0].message.content;
}