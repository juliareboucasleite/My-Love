// --------- TABS --------- //
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

// --------- MODAL --------- //
const modalClose = document.querySelector('.modal-close-button');
const mainContent = document.getElementById("main-content");
const startButton = document.getElementById("start-button");

modalClose.addEventListener('click', () => {
  mainContent.classList.remove("hidden");
  startButton.classList.add("hidden");
});

// --------- CONTADOR --------- //
function updateDayCounter() {
  const startDate = new Date(2025, 0, 2, 0, 0, 0); // 02/01/2025 (mês começa em 0 → janeiro)
  const now = new Date();

  // Diferença total em milissegundos
  let diff = now - startDate;

  // Converte
  const msInSecond = 1000;
  const msInMinute = msInSecond * 60;
  const msInHour = msInMinute * 60;
  const msInDay = msInHour * 24;

  let days = Math.floor(diff / msInDay);
  diff %= msInDay;

  let hours = Math.floor(diff / msInHour);
  diff %= msInHour;

  let minutes = Math.floor(diff / msInMinute);
  diff %= msInMinute;

  let seconds = Math.floor(diff / msInSecond);

  // Exibe bonitinho
  document.getElementById("day-counter").textContent =
    `${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos`;
}

// Atualiza a cada segundo
setInterval(updateDayCounter, 1000);
updateDayCounter();


// --------- FUNÇÃO GENÉRICA DE NAVEGAÇÃO --------- //
function createNavigator(containerSelector, navSelector, perPage = 5) {
  const items = document.querySelectorAll(`${containerSelector} .letter`);
  const nav = document.querySelector(navSelector);
  if (!items.length || !nav) return; // nada a fazer se não tiver itens

  let currentIndex = 0;
  let currentPage = 0;

  function renderButtons() {
    nav.innerHTML = "";
    const start = currentPage * perPage;
    const end = Math.min(start + perPage, items.length);

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

    for (let i = start; i < end; i++) {
      const btn = document.createElement("button");
      btn.textContent = i + 1;
      btn.classList.add("letter-btn");
      if (i === currentIndex) btn.classList.add("is-active");
      btn.addEventListener("click", () => showItem(i));
      nav.appendChild(btn);
    }

    if (end < items.length) {
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

  function showItem(index) {
    items[currentIndex].classList.remove("is-active");
    currentIndex = index;
    items[currentIndex].classList.add("is-active");
    renderButtons();
  }

  // inicia
  showItem(0);
}
// Navegação para Cartas
createNavigator(".cartas", ".cartas-nav");

// Navegação para Leia-me
createNavigator(".leias", ".leias-nav");
