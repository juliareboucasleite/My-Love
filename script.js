// Tabs
const tabs = {
  $buttons: document.querySelectorAll('.tab-menu__button'),
  $panels: document.querySelectorAll('.tab-panel'),
  init() {
    for (let i = 0; i < this.$buttons.length; i++) {
      let button = this.$buttons[i];
      let panel = this.$panels[i];

      button.addEventListener('click', () => {
        document.querySelector('.tab-menu__button.is-active').classList.remove('is-active');
        document.querySelector('.tab-panel.is-active').classList.remove('is-active');

        button.classList.add('is-active');
        panel.classList.add('is-active');
      });
    }
  }
};
tabs.init();

// Fecha o modal e mostra o conteúdo
const modalClose = document.querySelector('.modal-close-button');
const mainContent = document.getElementById("main-content");
const startButton = document.getElementById("start-button");

modalClose.addEventListener('click', () => {
  mainContent.classList.remove("hidden");
  startButton.classList.add("hidden"); // esconde o botão Launch Modal
});

function updateDayCounter() {
  const startDate = new Date(2025, 1, 2); // 02/02/2025
  const today = new Date();

  // Pegar diferença de anos, meses e dias
  let years = today.getFullYear() - startDate.getFullYear();
  let months = today.getMonth() - startDate.getMonth();
  let days = today.getDate() - startDate.getDate();

  // Ajustes se dias ou meses ficarem negativos
  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Montar texto bonitinho
  let parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "ano" : "anos"}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? "mês" : "meses"}`);
  if (days >= 0) parts.push(`${days} ${days === 1 ? "dia" : "dias"}`);

  document.getElementById("day-counter").textContent = parts.join(", ");
}

// Atualiza quando a página carrega
updateDayCounter();

// Cartas
const letters = document.querySelectorAll(".letter");
const nav = document.querySelector(".letter-nav");

let currentLetter = 0;
let buttonsPerPage = 5; // quantos botões aparecem por vez
let currentPage = 0;

// cria os botões
function renderButtons() {
  nav.innerHTML = "";

  const start = currentPage * buttonsPerPage;
  const end = Math.min(start + buttonsPerPage, letters.length);

  // botao anterior
  if (currentPage > 0) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "«";
    prevBtn.classList.add("letter-btn");
    prevBtn.addEventListener("click", () => {
      currentPage--;
      renderButtons();
    });
    nav.appendChild(prevBtn);
  }

  // botoes das cartas visíveis
  for (let i = start; i < end; i++) {
    const btn = document.createElement("button");
    btn.textContent = i + 1;
    btn.classList.add("letter-btn");
    if (i === currentLetter) btn.classList.add("is-active");

    btn.addEventListener("click", () => {
      showLetter(i);
    });
    nav.appendChild(btn);
  }

  // botao próximo
  if (end < letters.length) {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "»";
    nextBtn.classList.add("letter-btn");
    nextBtn.addEventListener("click", () => {
      currentPage++;
      renderButtons();
    });
    nav.appendChild(nextBtn);
  }
}

// mostra a carta certa
function showLetter(index) {
  letters[currentLetter].classList.remove("is-active");
  currentLetter = index;
  letters[currentLetter].classList.add("is-active");
  renderButtons();
}

// inicia
showLetter(0);



