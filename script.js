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

// --------- COMENTÁRIOS --------- //
function criarFormulario(paragrafo) {
  if (paragrafo.querySelector(".balao-form")) return;

  const form = document.createElement("div");
  form.classList.add("balao-form");

  form.innerHTML = `
    <textarea placeholder="Escreva um comentário..." class="conteudo-input"></textarea>
    <button type="button">Enviar</button>
  `;

  form.querySelector("button").addEventListener("click", async () => {
    const conteudo = form.querySelector(".conteudo-input").value;
    const trechoId = paragrafo.getAttribute("data-id");

    if (!conteudo) return alert("Escreva um comentário!");

    await fetch("http://localhost:3000/comentarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trechoId, conteudo })
    });

    carregarComentarios();
    form.remove();
  });

  paragrafo.appendChild(form);
}


async function carregarComentarios() {
  const resposta = await fetch("http://localhost:3000/comentarios");
  const comentarios = await resposta.json();

  // Limpar
  document.querySelectorAll(".paragrafo .comentarios").forEach(div => {
    div.innerHTML = "";
    div.classList.remove("mostrar");
  });

  // Preencher
  comentarios.forEach(c => {
    const paragrafo = document.querySelector(`.paragrafo[data-id="${c.trechoId}"]`);
    if (paragrafo) {
      const div = paragrafo.querySelector(".comentarios");
      div.classList.add("mostrar");

      const p = document.createElement("p");
      p.classList.add("comentario");
      p.textContent = `${c.autor}: ${c.conteudo}`;
      div.appendChild(p);
    }
  });
}

function prepararParagrafos() {
  const paragrafos = document.querySelectorAll(".letter p, .tab-panel p");

  paragrafos.forEach((p, index) => {
    if (p.closest(".paragrafo")) return; // já está tratado

    const wrapper = document.createElement("div");
    wrapper.classList.add("paragrafo");
    wrapper.setAttribute("data-id", "p" + index);

    const btn = document.createElement("button");
    btn.classList.add("add-comentario");
    btn.textContent = "+";

    const comentariosDiv = document.createElement("div");
    comentariosDiv.classList.add("comentarios");

    p.parentNode.insertBefore(wrapper, p);
    wrapper.appendChild(p);
    wrapper.appendChild(btn);
    wrapper.appendChild(comentariosDiv);

    // evento do botão
    btn.addEventListener("click", () => {
      criarFormulario(wrapper);
    });
  });
}

// Inicializa
document.addEventListener("DOMContentLoaded", () => {
  prepararParagrafos();
  carregarComentarios();
});
