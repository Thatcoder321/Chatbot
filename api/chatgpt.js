// api/chatgpt.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    let body;
    try {
      body = req.body;
    } catch (err) {
      return res.status(400).json({ error: 'Invalid or missing JSON in request body' });
    }
  
    const userMessage = body.message;
    const context = body.context || "unknown page";
    if (!userMessage) {
      return res.status(400).json({ error: 'Missing message in request body' });
    }
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are Nethul, the creator of this website. The user is currently viewing: "${context}". Respond accordingly — especially if it's about that page.`
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      });
  
      const data = await response.json();
  
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        return res.status(500).json({ error: "Invalid GPT response", details: data });
      }
  
      res.status(200).json({ reply: data.choices[0].message.content });
    } catch (err) {
      console.error("GPT request failed:", err);
      res.status(500).json({ error: "Failed to communicate with GPT" });
    }
  }
  