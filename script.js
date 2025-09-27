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
  const startDate = new Date(2025, 1, 2); // 02/02/2025
  const today = new Date();

  let years = today.getFullYear() - startDate.getFullYear();
  let months = today.getMonth() - startDate.getMonth();
  let days = today.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  let parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "ano" : "anos"}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? "mês" : "meses"}`);
  if (days >= 0) parts.push(`${days} ${days === 1 ? "dia" : "dias"}`);

  document.getElementById("day-counter").textContent = parts.join(", ");
}
updateDayCounter();

// --------- CARTAS --------- //
const letters = document.querySelectorAll(".letter");
const nav = document.querySelector(".letter-nav");
let currentLetter = 0;
let buttonsPerPage = 5;
let currentPage = 0;

function renderButtons() {
  nav.innerHTML = "";
  const start = currentPage * buttonsPerPage;
  const end = Math.min(start + buttonsPerPage, letters.length);

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
    if (i === currentLetter) btn.classList.add("is-active");
    btn.addEventListener("click", () => showLetter(i));
    nav.appendChild(btn);
  }

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

function showLetter(index) {
  letters[currentLetter].classList.remove("is-active");
  currentLetter = index;
  letters[currentLetter].classList.add("is-active");
  renderButtons();
}
showLetter(0);

// --------- COMENTÁRIOS POR SELEÇÃO --------- //
document.addEventListener("mouseup", () => {
  const selection = window.getSelection();
  const texto = selection.toString().trim();

  if (texto.length > 0) {
    const comentario = prompt("Digite seu comentário para: " + texto);
    if (!comentario) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    const id = "c" + Date.now();

    span.classList.add("comentado");
    span.setAttribute("data-id", id);
    span.textContent = texto;

    const balao = document.createElement("div");
    balao.classList.add("balao");
    balao.textContent = comentario;
    span.appendChild(balao);

    range.deleteContents();
    range.insertNode(span);

    // Salvar no backend (json-server)
    fetch("http://localhost:3000/comentarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trechoId: id, texto, comentario })
    });
  }
});

// --------- CARREGAR COMENTÁRIOS --------- //
async function carregarComentarios() {
  const resposta = await fetch("http://localhost:3000/comentarios");
  const comentarios = await resposta.json();

  comentarios.forEach(c => {
    // procurar se já existe esse trecho sublinhado
    if (!document.querySelector(`[data-id="${c.trechoId}"]`)) {
      const regex = new RegExp(c.texto, "g");
      document.body.innerHTML = document.body.innerHTML.replace(
        regex,
        `<span class="comentado" data-id="${c.trechoId}">
           ${c.texto}
           <div class="balao">${c.comentario}</div>
         </span>`
      );
    }
  });
}

document.addEventListener("DOMContentLoaded", carregarComentarios);
