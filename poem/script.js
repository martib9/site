const inputWord = document.getElementById('input-word');
const generateButton = document.getElementById('generate-button');
const poemContainer = document.getElementById('poem');
const errorMessage = document.getElementById('error-message');

generateButton.addEventListener('click', () => {
  const word = inputWord.value.trim();
  if (word.length === 0) {
    errorMessage.innerText = 'Add word';
    return;
  }
  if (word.length > 15) {
    errorMessage.innerText = 'Word longer than 15 symbols';
    return;
  }
  errorMessage.innerText = '';
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/poem');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = () => {
    if (xhr.status === 200) {
      const poem = JSON.parse(xhr.responseText);
      poemContainer.innerText = poem;
    }
  };
  xhr.send(JSON.stringify({ word: word }));
});

// disable spaces
inputWord.addEventListener('keydown', (event) => {
  if (event.keyCode === 32) {
    event.preventDefault();
  }
});
