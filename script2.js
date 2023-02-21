// Function to generate a poem with the input word
function generatePoem() {
  const inputWord = document.getElementById('word-input').value.trim();
  
  if (inputWord === '') {
    document.getElementById('error-message').innerText = 'Add word';
    return;
  }
  
  const apiUrl = `https://api.openai.com/v1/texts/generate?model=davinci&prompt=${inputWord}&temperature=0.5&max_tokens=50`;
  
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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'
    }
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('error-message').innerText = '';
    document.getElementById('poem-text').innerText = data.choices[0].text;
  })
  .catch(error => console.error(error));
}

// Add event listener to the generate button
const generateButton = document.querySelector('input[type="submit"]');
generateButton.addEventListener('click', generatePoem);

// Function to share the generated poem on Twitter
function shareOnTwitter() {
  const poemText = encodeURIComponent(document.getElementById('poem-text').innerText);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${poemText}`;
  window.open(twitterUrl, '_blank');
}

// Add event listener to the Twitter share button
const twitterButton = document.querySelector('.twitter-share-button');
twitterButton.addEventListener('click', shareOnTwitter);

// Function to share the generated poem on Telegram
function shareOnTelegram() {
  const poemText = encodeURIComponent(document.getElementById('poem-text').innerText);
  const telegramUrl = `https://t.me/share/url?url=&text=${poemText}`;
  window.open(telegramUrl, '_blank');
}

// Add event listener to the Telegram share button
const telegramButton = document.querySelector('.telegram-share-button');
telegramButton.addEventListener('click', shareOnTelegram);
