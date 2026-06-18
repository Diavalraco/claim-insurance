const OpenAI = require('openai');
const { SYSTEM_PROMPT, buildUserPrompt } = require('./prompt');

const MODEL = 'gpt-4o';

function parseJsonResponse(text) {
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  return JSON.parse(cleaned);
}

function validateResult(data) {
  if (typeof data.score !== 'number' || data.score < 0 || data.score > 100) {
    throw new Error('Invalid score');
  }
  if (!['Low', 'Medium', 'High'].includes(data.risk)) {
    throw new Error('Invalid risk level');
  }
  if (!['Approve', 'Review', 'Reject'].includes(data.recommendation)) {
    throw new Error('Invalid recommendation');
  }
  if (!Array.isArray(data.flags)) {
    throw new Error('Invalid flags');
  }
  return data;
}

async function callOpenAI(client, claimText) {
  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 2048,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(claimText) },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error('Empty response from OpenAI');
  }

  return parseJsonResponse(text);
}

async function analyzeClaim(claimText) {
  if (!claimText || claimText.trim().length < 20) {
    const error = new Error('Please enter a valid claim (at least 20 characters).');
    error.statusCode = 400;
    throw error;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const error = new Error(
      'OPENAI_API_KEY is not configured. Add it to your .env file or Vercel environment variables.'
    );
    error.statusCode = 500;
    throw error;
  }

  const client = new OpenAI({ apiKey });
  let lastError;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await callOpenAI(client, claimText.trim());
      return validateResult(result);
    } catch (err) {
      lastError = err;
    }
  }

  const error = new Error(
    'Failed to analyze claim. The AI returned an invalid response. Please try again.'
  );
  error.statusCode = 502;
  error.cause = lastError;
  throw error;
}

module.exports = { analyzeClaim };
