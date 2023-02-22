const form = document.querySelector('#poem-form');
const input = document.querySelector('#poem-input');
const errorMessage = document.querySelector('#error-message');
const poemContainer = document.querySelector('#poem-container');
const shareTwitterButton = document.querySelector('#share-twitter');
const shareTelegramButton = document.querySelector('#share-telegram');
const popup = document.querySelector('#popup');
const popupContent = document.querySelector('.popup-content');
const closePopupButton = document.querySelector('#close-popup');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMessage.innerHTML = '';

  const word = input.value.trim();

  if (word === '') {
    errorMessage.innerHTML = 'Please enter a word.';
    return;
  }

  if (word.length > 15) {
    errorMessage.innerHTML = 'Word cannot be longer than 15 characters.';
    return;
  }

  if (word.indexOf(' ') >= 0) {
    errorMessage.innerHTML = 'Word cannot contain spaces.';
    return;
  }

  const response = await fetch(`/api/generate-poem?word=${word}`);

  if (!response.ok) {
    errorMessage.innerHTML = 'An error occurred while generating the poem. Please try again later.';
    return;
  }

  const data = await response.json();
  poemContainer.innerHTML = data.poem;

  popup.style.display = 'flex';
});

closePopupButton.addEventListener('click', () => {
  popup.style.display = 'none';
  poemContainer.innerHTML = '';
});

shareTwitterButton.addEventListener('click', () => {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(poemContainer.textContent)}`;
  window.open(url, '_blank');
});

shareTelegramButton.addEventListener('click', () => {
  const url = `https://t.me/share/url?url=${encodeURIComponent(poemContainer.textContent)}`;
  window.open(url, '_blank');
});
