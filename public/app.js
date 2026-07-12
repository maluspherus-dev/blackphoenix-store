const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

// Funções de navegação
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
  });
  const page = document.getElementById(pageId);
  if (page) page.style.display = 'block';
}

function showHome() {
  showPage('home');
}

function showLogin() {
  showPage('login');
}

function showRegistro() {
  showPage('registro');
}

function showAnuncios() {
  showPage('anuncios');
  carregarAnuncios();
}

function showAdmin() {
  if (!usuario || !usuario.eh_admin) {
    alert('Acesso negado');
    return;
  }
  showPage('admin');
  showDashboard();
}

function showDashboard() {
  document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
  document.getElementById('dashboard').style.display = 'block';
  carregarDashboard();
}

function showAdminAnuncios() {
  document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
  document.getElementById('adminAnuncios').style.display = 'block';
  document.getElementById('formAnuncio').style.display = 'none';
  carregarAdminAnuncios();
}

function showAdminCategorias() {
  document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
  document.getElementById('adminCategorias').style.display = 'block';
  document.getElementById('formCategoria').style.display = 'none';
  carregarAdminCategorias();
}

function showAdminAvaliacoes() {
  document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
  document.getElementById('adminAvaliacoes').style.display = 'block';
  carregarAdminAvaliacoes();
}

function showAdminPagamentos() {
  document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
  document.getElementById('adminPagamentos').style.display = 'block';
  carregarAdminPagamentos();
}

function showFormAnuncio() {
  document.getElementById('formAnuncio').style.display = document.getElementById('formAnuncio').style.display === 'none' ? 'block' : 'none';
  carregarCategorias();
}

function showFormCategoria() {
  document.getElementById('formCategoria').style.display = document.getElementById('formCategoria').style.display === 'none' ? 'block' : 'none';
}

// Auth
async function handleLogin(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.querySelector('input[type="email"]').value;
  const senha = form.querySelector('input[type="password"]').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      token = data.token;
      usuario = data.usuario;
      atualizarUI();
      showHome();
      alert('Login bem-sucedido!');
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao fazer login');
  }
}

async function handleRegistro(event) {
  event.preventDefault();
  const form = event.target;
  const nome = form.querySelector('input[type="text"]').value;
  const email = form.querySelector('input[type="email"]').value;
  const senha = form.querySelector('input[type="password"]').value;

  try {
    const response = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      token = data.token;
      usuario = data.usuario;
      atualizarUI();
      showHome();
      alert('Registro bem-sucedido!');
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao registrar');
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  token = null;
  usuario = null;
  atualizarUI();
  showHome();
  alert('Desconectado com sucesso!');
}

// Atualizar UI
function atualizarUI() {
  const loginLink = document.getElementById('loginLink');
  const sairLink = document.getElementById('sairLink');
  const adminLink = document.getElementById('adminLink');

  if (token && usuario) {
    loginLink.style.display = 'none';
    sairLink.style.display = 'block';
    if (usuario.eh_admin) {
      adminLink.style.display = 'block';
    }
  } else {
    loginLink.style.display = 'block';
    sairLink.style.display = 'none';
    adminLink.style.display = 'none';
  }
}

// Carregar anúncios públicos
async function carregarAnuncios() {
  try {
    const response = await fetch(`${API_URL}/anuncios`);
    const anuncios = await response.json();
    const grid = document.getElementById('anunciosGrid');
    grid.innerHTML = '';
    if (anuncios.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">Nenhum anúncio disponível no momento.</p>';
      return;
    }
    anuncios.forEach(anuncio => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-image">📦</div>
        <div class="card-content">
          <h3 class="card-title">${anuncio.titulo}</h3>
          <p class="card-price">R$ ${parseFloat(anuncio.preco).toFixed(2)}</p>
          <p class="card-rating">⭐ Ver detalhes</p>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

// Dashboard
async function carregarDashboard() {
  try {
    const response = await fetch(`${API_URL}/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    document.getElementById('totalAnuncios').textContent = data.anuncios;
    document.getElementById('totalUsuarios').textContent = data.usuarios;
    document.getElementById('totalPagamentos').textContent = `R$ ${parseFloat(data.pagamentos).toFixed(2)}`;
    document.getElementById('totalAvaliacoes').textContent = data.avaliacoes;
  } catch (err) {
    console.error(err);
  }
}

// Categorias
async function carregarCategorias() {
  try {
    const response = await fetch(`${API_URL}/admin/categorias`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const categorias = await response.json();
    const select = document.getElementById('categoriaAnuncio');
    select.innerHTML = '<option value="">Selecione uma categoria</option>';
    categorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.nome;
      select.appendChild(option);
    });
  } catch (err) {
    console.error(err);
  }
}

async function carregarAdminCategorias() {
  try {
    const response = await fetch(`${API_URL}/admin/categorias`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const categorias = await response.json();
    const container = document.getElementById('categoriasAdmin');
    if (categorias.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary);">Nenhuma categoria criada.</p>';
      return;
    }
    let html = '<table><thead><tr><th>Nome</th><th>Descrição</th><th>Ações</th></tr></thead><tbody>';
    categorias.forEach(cat => {
      html += `<tr><td>${cat.nome}</td><td>${cat.descricao || '-'}</td><td><button class="btn btn-danger" onclick="deletarCategoria(${cat.id})">Deletar</button></td></tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

async function handleCriarCategoria(event) {
  event.preventDefault();
  const form = event.target;
  const nome = document.getElementById('nomeCategoria').value;
  const descricao = document.getElementById('descricaoCategoria').value;

  try {
    const response = await fetch(`${API_URL}/admin/categorias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nome, descricao })
    });
    if (response.ok) {
      alert('Categoria criada com sucesso!');
      form.reset();
      document.getElementById('formCategoria').style.display = 'none';
      carregarAdminCategorias();
    } else {
      const data = await response.json();
      alert(data.error);
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao criar categoria');
  }
}

// Anúncios Admin
async function carregarAdminAnuncios() {
  try {
    const response = await fetch(`${API_URL}/admin/anuncios`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const anuncios = await response.json();
    const container = document.getElementById('anunciosAdmin');
    if (anuncios.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary);">Nenhum anúncio criado.</p>';
      return;
    }
    let html = '<table><thead><tr><th>Título</th><th>Preço</th><th>Status</th><th>Ações</th></tr></thead><tbody>';
    anuncios.forEach(anuncio => {
      html += `<tr><td>${anuncio.titulo}</td><td>R$ ${parseFloat(anuncio.preco).toFixed(2)}</td><td>${anuncio.ativo ? 'Ativo' : 'Inativo'}</td><td><button class="btn btn-danger" onclick="deletarAnuncio(${anuncio.id})">Deletar</button></td></tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

async function handleCriarAnuncio(event) {
  event.preventDefault();
  const titulo = document.getElementById('tituloAnuncio').value;
  const descricao = document.getElementById('descricaoAnuncio').value;
  const categoria_id = document.getElementById('categoriaAnuncio').value;
  const preco = document.getElementById('precoAnuncio').value;

  if (!categoria_id) {
    alert('Selecione uma categoria');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/admin/anuncios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ titulo, descricao, categoria_id: parseInt(categoria_id), preco: parseFloat(preco) })
    });
    if (response.ok) {
      alert('Anúncio criado com sucesso!');
      event.target.reset();
      document.getElementById('formAnuncio').style.display = 'none';
      carregarAdminAnuncios();
    } else {
      const data = await response.json();
      alert(data.error);
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao criar anúncio');
  }
}

async function deletarAnuncio(id) {
  if (confirm('Tem certeza que deseja deletar este anúncio?')) {
    try {
      const response = await fetch(`${API_URL}/admin/anuncios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Anúncio deletado!');
        carregarAdminAnuncios();
      } else {
        alert('Erro ao deletar anúncio');
      }
    } catch (err) {
      console.error(err);
    }
  }
}

// Avaliações
async function carregarAdminAvaliacoes() {
  try {
    const response = await fetch(`${API_URL}/avaliacoes/anuncio/1`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const avaliacoes = await response.json();
    const container = document.getElementById('avaliacoesAdmin');
    if (avaliacoes.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary);">Nenhuma avaliação encontrada.</p>';
      return;
    }
    let html = '<table><thead><tr><th>Avaliação</th><th>Comentário</th><th>Ações</th></tr></thead><tbody>';
    avaliacoes.forEach(avaliacao => {
      if (!avaliacao.removida) {
        html += `<tr><td>${'⭐'.repeat(avaliacao.nota)}</td><td>${avaliacao.comentario || '-'}</td><td><button class="btn btn-danger" onclick="removerAvaliacao(${avaliacao.id})">Remover</button></td></tr>`;
      }
    });
    html += '</tbody></table>';
    container.innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

async function removerAvaliacao(id) {
  const motivo = prompt('Motivo da remoção:');
  if (motivo) {
    try {
      const response = await fetch(`${API_URL}/avaliacoes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ motivo_remocao: motivo })
      });
      if (response.ok) {
        alert('Avaliação removida!');
        carregarAdminAvaliacoes();
      }
    } catch (err) {
      console.error(err);
    }
  }
}

// Pagamentos
async function carregarAdminPagamentos() {
  try {
    const response = await fetch(`${API_URL}/pagamentos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const pagamentos = await response.json();
    const container = document.getElementById('pagamentosAdmin');
    if (pagamentos.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary);">Nenhum pagamento recebido.</p>';
      return;
    }
    let html = '<table><thead><tr><th>ID</th><th>Valor</th><th>Status</th><th>Data</th></tr></thead><tbody>';
    pagamentos.forEach(pagamento => {
      html += `<tr><td>${pagamento.id}</td><td>R$ ${parseFloat(pagamento.valor).toFixed(2)}</td><td>${pagamento.status}</td><td>${new Date(pagamento.criado_em).toLocaleDateString('pt-BR')}</td></tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

// Inicializar
atualizarUI();
