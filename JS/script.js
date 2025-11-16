
document.addEventListener('DOMContentLoaded', () => {
  const kName = 'childName', kAge = 'childAge', kSex = 'childSex';
  const kInterests = 'childInterests', kGoals = 'childGoals';

  document.querySelectorAll('.dados-cadastro .campo-vazio').forEach((span, i) => {
    const input = document.createElement('input');
    input.className = 'campo-vazio';
    input.autocomplete = 'off';

    if (i === 0) {
      input.type = 'text'; input.placeholder = 'Nome';
      input.value = localStorage.getItem(kName) || '';
      input.addEventListener('input', () => localStorage.setItem(kName, input.value.trim()));
    } else if (i === 1) {
      input.type = 'number'; input.placeholder = 'Idade'; input.min = 0; input.inputMode = 'numeric';
      input.value = localStorage.getItem(kAge) || '';
      input.addEventListener('input', () => localStorage.setItem(kAge, input.value.trim()));
    } else {
      input.type = 'text'; input.placeholder = 'Sexo';
      input.value = localStorage.getItem(kSex) || '';
      input.addEventListener('input', () => localStorage.setItem(kSex, input.value.trim()));
    }

    span.parentNode.replaceChild(input, span);
    // atualizar index em tempo real caso esteja aberto
    input.addEventListener('input', updateIndexName);
  });

  // ---------- INDEX: mostra "Nome, X anos" ----------
  function updateIndexName() {
    const el = document.querySelector('.index-nome');
    if (!el) return;
    const name = localStorage.getItem(kName) || '';
    const age  = localStorage.getItem(kAge) || '';
    if (!name && !age) return;
    const parts = [];
    if (name) parts.push(name);
    if (age) {
      const n = Number(age);
      parts.push((!isNaN(n) ? n : age) + ' ' + ((n === 1) ? 'ano' : 'anos'));
    }
    el.textContent = parts.join(', ');
  }
  updateIndexName();
  window.addEventListener('storage', updateIndexName); // atualiza se mudar em outra aba

  // ativa seleção em ULs com li 
  function makeSelectableList(ulSelector, storageKey) {
    const ul = document.querySelector(ulSelector);
    if (!ul) return;

    // restaurar selecionados
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    ul.querySelectorAll('li').forEach(li => {
      if (saved.includes(li.textContent.trim())) li.classList.add('selected');
    });

    // delegação de evento 
    ul.addEventListener('click', (ev) => {
      const li = ev.target.closest('li');
      if (!li || !ul.contains(li)) return;
      li.classList.toggle('selected');
      const selected = [...ul.querySelectorAll('li.selected')].map(x => x.textContent.trim());
      localStorage.setItem(storageKey, JSON.stringify(selected));
    });
  }

  // aplica para cadastro3 (interesses) e cadastro4 (objetivos)
  makeSelectableList('.interests', kInterests);
  makeSelectableList('.objetivos-topicos', kGoals);


// função para rating da atividade 
function initStarRatings() {

  const STAR_ON  = 'img/estrelaamarela.png'; // estrela preenchida
  const STAR_OFF = 'img/estrelapreta.png';   // estrela vazia/preta

  // para cada grupo .rating na página
  document.querySelectorAll('.rating').forEach(ratingGroup => {
    const groupId = ratingGroup.dataset.group || 'default';
    const storageKey = 'rating-' + groupId;
    const buttons = Array.from(ratingGroup.querySelectorAll('.star'));

    function applyVisual(n) {
      buttons.forEach((btn, idx) => {
        const img = btn.querySelector('img');
        if (!img) return;
        if (idx < n) img.src = STAR_ON;
        else img.src = STAR_OFF;
      });
      buttons.forEach((btn, idx) => {
        btn.setAttribute('aria-pressed', String(idx < n));
      });
    }

    // restaurar valor salvo (se houver)
    const saved = parseInt(localStorage.getItem(storageKey), 10);
    if (!Number.isNaN(saved) && saved >= 1 && saved <= buttons.length) {
      applyVisual(saved);
    } else {
      applyVisual(0); // nenhuma selecionada
    }

    // clique em botão: define rating = data-value do botão
    ratingGroup.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.star');
      if (!btn || !ratingGroup.contains(btn)) return;
      const v = Number(btn.dataset.value) || 0;
      applyVisual(v);
      localStorage.setItem(storageKey, String(v));
    });

    // teclado: Space ou Enter ativa a estrela focada
    buttons.forEach(btn => {
      btn.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
          ev.preventDefault();
          btn.click();
        }
      });
      // garantir que o botão seja focável
      if (!btn.hasAttribute('tabindex')) btn.setAttribute('tabindex', '0');
    });

  });
}
initStarRatings()

});
