const { default: axios } = require("axios");

export default async function handler(req, res) {
  try {
    const { word } = req.body;
    const response = await axios.post("https://api.openai.com/v1/texts/generate", {
      prompt: `A poem about ${word}`,
      temperature: 0.7,
      max_tokens: 60,
      n: 1,
      stop: ["\n"],
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
    const poem = response.data.choices[0].text.trim();
    res.status(200).json({ poem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating poem' });
  }
}