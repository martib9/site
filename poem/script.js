const form = document.getElementById('poem-form');
const input = document.getElementById('poem-input');
const errorMessage = document.getElementById('error-message');
const poemContainer = document.getElementById('poem-container');
const shareTwitter = document.getElementById('share-twitter');
const shareTelegram = document.getElementById('share-telegram');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorMessage.textContent = '';

  const word = input.value.trim();

  if (word === '') {
    errorMessage.textContent = 'Add word';
    return;
  }

  if (word.includes(' ')) {
    errorMessage.textContent = 'No spaces allowed';
    return;
  }

  if (word.length > 15) {
    errorMessage.textContent = 'Word longer than 15 symbols';
    return;
  }

  try {
    const response = await fetch('/api/generate-poem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word }),
    });

    const data = await response.json();

    if (response.ok) {
      poemContainer.textContent = data.poem;
    } else {
      errorMessage.textContent = data.error;
    }
  } catch (error) {
    console.error(error);
    errorMessage.textContent = 'Something went wrong';
  }
});

shareTwitter.addEventListener('click', () => {
  const poem = poemContainer.textContent;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(poem)}`;
  window.open(url, '_blank');
});

shareTelegram.addEventListener('click', () => {
  const poem = poemContainer.textContent;
  const url = `https://t.me/share/url?url=&text=${encodeURIComponent(poem)}`;
  window.open(url, '_blank');
});
