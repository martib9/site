const { createCanvas } = require('canvas');
const { GPT } = require('gpt-3');
const config = require('../../config');

const gpt = new GPT({
  apiKey: config.gptApiKey,
  engine: 'davinci',
  prompt: config.gptPrompt,
  temperature: 0.8,
  maxTokens: 150,
});

module.exports = async (req, res) => {
  const { word } = req.query;

  try {
    const prompt = `Write a poem that rhymes with ${word}.`;
    const result = await gpt.complete(prompt);
    const poem = result.choices[0].text.trim();
    const canvas = createCanvas(400, 300);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    const lines = poem.split('\n');
    let y = 30;
    for (const line of lines) {
      ctx.fillText(line, 50, y);
      y += 30;
    }
    const image = canvas.toDataURL('image/png');
    res.json({
      poem,
      image,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'An error occurred while generating the poem.',
    });
  }
};