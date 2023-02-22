const config = require('../config');
const { createApi } = require('openai');

module.exports = async (req, res) => {
  const prompt = `${config.gptPrompt} ${req.query.word}`;
  const temperature = 0.7;
  const maxLength = 50;
  const engine = 'davinci';
  const completion = await createApi(config.gptApiKey).completions.create({
    prompt,
    temperature,
    max_tokens: maxLength,
    n: 1,
    engine,
  });

  console.log('API Key:', config.gptApiKey);
  console.log('Prompt:', prompt);
  console.log('Temperature:', temperature);
  console.log('Max length:', maxLength);
  console.log('Engine:', engine);
  console.log('Completion:', completion);

  if (completion.choices && completion.choices.length > 0) {
    const text = completion.choices[0].text.trim();
    const lines = text.split('\n').map((line) => line.trim());

    const response = {
      poem: lines.join('\n'),
      image: `https://via.placeholder.com/300x150.png?text=${encodeURIComponent(
        lines.join('\n')
      )}`,
    };

    res.json(response);
  } else {
    res.status(400).json({ message: 'Could not generate poem.' });
  }
};