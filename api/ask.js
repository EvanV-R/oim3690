
module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  // Get the question from the webpage
  const question = req.body?.question;

  if (typeof question !== 'string' ||
      !question.trim() ||
      question.length > 2000) {
    return res.status(400).json({
      error: 'Please enter a valid question.'
    });
  }

  // API key is stored securely in Vercel
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'Missing OpenRouter API key.'
    });
  }

  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-v4.1-flash-1017',
          messages: [
            {
              role: 'user',
              content: question.trim()
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        error: data.error?.message ||
          'OpenRouter request failed.'
      });
    }

    const answer = data.choices?.[0]?.message?.content;

    if (!answer) {
      return res.status(502).json({
        error: 'No answer received from the AI.'
      });
    }

    return res.status(200).json({
      answer: answer
    });

  } catch (error) {
    return res.status(502).json({
      error: 'Could not connect to OpenRouter.'
    });
  }
};
