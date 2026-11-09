// Vercel serverless function. Add OPENROUTER_API_KEY in Vercel project settings.
// Do not commit your key to GitHub.
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
  if (!question || question.length > 2000) return res.status(400).json({ error: 'Enter a question up to 2000 characters.' });
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return res.status(500).json({ error: 'Missing OPENROUTER_API_KEY environment variable in Vercel.' });
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini', messages: [{ role: 'user', content: question }] })
    });
    const data = await response.json();
    if (!response.ok) return res.status(502).json({ error: data.error?.message || `Model API returned ${response.status}` });
    return res.status(200).json({ answer: data.choices?.[0]?.message?.content || 'No answer received.' });
  } catch (error) {
    return res.status(502).json({ error: 'Could not reach the model API.' });
  }
};
