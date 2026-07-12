const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Erro no pool de conexão:', err);
});

const initialize = async () => {
  try {
    // Verificar conexão
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Banco de dados conectado:', result.rows[0]);

    // Criar tabelas
    await createTables();
    console.log('✅ Tabelas inicializadas');
  } catch (err) {
    console.error('Erro ao inicializar banco:', err);
    throw err;
  }
};

const createTables = async () => {
  const client = await pool.connect();
  try {
    // Tabela de usuários
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        nome VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255),
        eh_admin BOOLEAN DEFAULT FALSE,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de categorias
    await client.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        ativo BOOLEAN DEFAULT TRUE,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de anúncios
    await client.query(`
      CREATE TABLE IF NOT EXISTS anuncios (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT NOT NULL,
        categoria_id INTEGER REFERENCES categorias(id),
        preco DECIMAL(10, 2) NOT NULL,
        imagens JSON,
        ativo BOOLEAN DEFAULT TRUE,
        usuario_id INTEGER REFERENCES usuarios(id),
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de avaliações
    await client.query(`
      CREATE TABLE IF NOT EXISTS avaliacoes (
        id SERIAL PRIMARY KEY,
        anuncio_id INTEGER REFERENCES anuncios(id),
        usuario_id INTEGER REFERENCES usuarios(id),
        nota INTEGER CHECK (nota >= 1 AND nota <= 5),
        comentario TEXT,
        removida BOOLEAN DEFAULT FALSE,
        motivo_remocao VARCHAR(255),
        criada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de pagamentos
    await client.query(`
      CREATE TABLE IF NOT EXISTS pagamentos (
        id SERIAL PRIMARY KEY,
        anuncio_id INTEGER REFERENCES anuncios(id),
        usuario_id INTEGER REFERENCES usuarios(id),
        valor DECIMAL(10, 2) NOT NULL,
        metodo VARCHAR(50),
        id_mercado_pago VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pendente',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inserir admin padrão se não existir
    const adminExistente = await client.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [process.env.ADMIN_EMAIL || 'maluspherus@gmail.com']
    );

    if (adminExistente.rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const senhaHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'malus2161@', 10);
      await client.query(
        'INSERT INTO usuarios (email, senha, nome, eh_admin) VALUES ($1, $2, $3, true)',
        [process.env.ADMIN_EMAIL || 'maluspherus@gmail.com', senhaHash, 'Admin']
      );
      console.log('✅ Admin padrão criado');
    }

  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initialize,
};