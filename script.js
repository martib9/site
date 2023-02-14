const textMeBtn = document.getElementById("text-me");
const popup = document.getElementById("rickroll-popup");
const closePopupBtn = document.getElementById("close-popup");

textMeBtn.addEventListener("click", () => {
  popup.style.display = "flex";
});

closePopupBtn.addEventListener("click", () => {
  popup.style.display = "none";
});
