/**
 * Carrinho de Compras
 * Persiste os dados no localStorage sob a chave "compras/lista.json"
 * (GitHub Pages não permite escrita em disco; o localStorage é o equivalente
 *  para sites estáticos hospedados no GitHub Pages)
 */

const CHAVE = 'compras/lista.json';

let itens = [];
let modoEdicao = null;   // id do item sendo editado
let itemParaExcluir = null;

/* ── Persistência ── */
function salvar() {
  localStorage.setItem(CHAVE, JSON.stringify(itens));
}

function carregar() {
  try {
    const raw = localStorage.getItem(CHAVE);
    itens = raw ? JSON.parse(raw) : [];
  } catch {
    itens = [];
  }
}

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ── CRUD ── */
function adicionarOuSalvar() {
  const nome = document.getElementById('input-nome').value.trim();
  const qtd  = parseInt(document.getElementById('input-qtd').value, 10);

  if (!nome) { focarErro('input-nome'); return; }
  if (!qtd || qtd < 1) { focarErro('input-qtd'); return; }

  if (modoEdicao !== null) {
    const idx = itens.findIndex(i => i.id === modoEdicao);
    if (idx !== -1) {
      itens[idx].nome = nome;
      itens[idx].quantidade = qtd;
    }
    modoEdicao = null;
    toast('Produto atualizado ✓');
  } else {
    itens.push({ id: gerarId(), nome, quantidade: qtd });
    toast('Produto adicionado ✓');
  }

  salvar();
  renderizar();
  limparFormulario();
}

function editarItem(id) {
  const item = itens.find(i => i.id === id);
  if (!item) return;

  modoEdicao = id;
  document.getElementById('input-nome').value = item.nome;
  document.getElementById('input-qtd').value  = item.quantidade;
  document.getElementById('form-title').textContent = 'Editar produto';
  document.getElementById('btn-adicionar').textContent = 'Salvar';
  document.getElementById('btn-cancelar').style.display = 'inline-block';
  document.getElementById('input-nome').focus();
  renderizar(); // destaca linha
}

function cancelarEdicao() {
  modoEdicao = null;
  limparFormulario();
  renderizar();
}

function solicitarExclusao(id) {
  const item = itens.find(i => i.id === id);
  if (!item) return;
  itemParaExcluir = id;
  document.getElementById('modal-nome').textContent = item.nome;
  document.getElementById('modal-overlay').style.display = 'flex';
}

function confirmarExclusao() {
  itens = itens.filter(i => i.id !== itemParaExcluir);
  itemParaExcluir = null;
  if (modoEdicao !== null) cancelarEdicao();
  salvar();
  renderizar();
  fecharModal();
  toast('Produto removido');
}

function fecharModal() {
  document.getElementById('modal-overlay').style.display = 'none';
  itemParaExcluir = null;
}

function limparTudo() {
  if (!confirm('Remover todos os itens da lista?')) return;
  itens = [];
  modoEdicao = null;
  salvar();
  renderizar();
  limparFormulario();
  toast('Lista limpa');
}

/* ── UI ── */
function renderizar() {
  const tabela   = document.getElementById('tabela');
  const vazio    = document.getElementById('lista-vazia');
  const corpo    = document.getElementById('corpo-tabela');
  const contador = document.getElementById('contador');
  const btnLimpar = document.getElementById('btn-limpar');

  contador.textContent = itens.length === 1
    ? '1 item'
    : `${itens.length} itens`;

  if (itens.length === 0) {
    tabela.style.display  = 'none';
    vazio.style.display   = 'block';
    btnLimpar.style.display = 'none';
    return;
  }

  tabela.style.display  = 'table';
  vazio.style.display   = 'none';
  btnLimpar.style.display = 'inline-block';

  corpo.innerHTML = '';
  itens.forEach((item, idx) => {
    const tr = document.createElement('tr');
    if (item.id === modoEdicao) tr.classList.add('editando');

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escapar(item.nome)}</td>
      <td>${item.quantidade}</td>
      <td class="td-acoes">
        <button class="btn-editar" onclick="editarItem('${item.id}')">Editar</button>
        <button class="btn-excluir" onclick="solicitarExclusao('${item.id}')">Excluir</button>
      </td>
    `;
    corpo.appendChild(tr);
  });
}

function limparFormulario() {
  document.getElementById('input-nome').value = '';
  document.getElementById('input-qtd').value  = '1';
  document.getElementById('form-title').textContent = 'Adicionar produto';
  document.getElementById('btn-adicionar').textContent = 'Adicionar';
  document.getElementById('btn-cancelar').style.display = 'none';
}

function focarErro(id) {
  const el = document.getElementById(id);
  el.focus();
  el.style.borderColor = 'var(--danger)';
  setTimeout(() => el.style.borderColor = '', 1200);
}

function escapar(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Toast ── */
let toastTimer;
function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('visivel');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visivel'), 2200);
}

/* ── Teclado ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const ativo = document.activeElement;
    if (ativo.id === 'input-nome' || ativo.id === 'input-qtd') {
      adicionarOuSalvar();
    }
  }
  if (e.key === 'Escape') {
    fecharModal();
    if (modoEdicao !== null) cancelarEdicao();
  }
});

/* ── Fechar modal ao clicar fora ── */
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) fecharModal();
});

/* ── Init ── */
carregar();
renderizar();
