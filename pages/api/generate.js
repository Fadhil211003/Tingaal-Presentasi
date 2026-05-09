export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { system, message, pdf } = req.body;
  try {
    const content = pdf
      ? [{ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdf } }, { type: 'text', text: message }]
      : message;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: claude-opus-4-6',
        max_tokens: 1000,
        system,
        messages: [{ role: 'user', content }]
      })
    });
    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ 
        error: `Type: ${data.error.type} | Message: ${data.error.message}` 
      });
    }
    const text = (data.content || []).map(c => c.text || '').join('');
    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
