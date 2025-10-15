// index.js
// API REST para Biblioteca (Node + Express + Sequelize + SQLite)

const express = require('express');
const { Sequelize, DataTypes, Op } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Banco SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './biblioteca.sqlite',
  logging: false,
});

// Modelo Livro
const Livro = sequelize.define('Livro', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING, allowNull: false },
  autor: { type: DataTypes.STRING, allowNull: false },
  ano: { type: DataTypes.INTEGER, allowNull: true },
  genero: { type: DataTypes.STRING, allowNull: true },
  disponivel: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  descricao: { type: DataTypes.STRING, allowNull: true },
  imagemUrl: { type: DataTypes.STRING, allowNull: true },
  linkDownload: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'livros',
  timestamps: true,
});

/**
 * Função principal de inicialização da API
 * 
 * Responsável por:
 * - Conectar ao banco de dados SQLite
 * - Sincronizar os modelos (criar tabelas se não existirem)
 * - Configurar todas as rotas da API REST
 * - Iniciar o servidor Express na porta especificada
 * 
 * @async
 * @function start
 * @returns {Promise<void>}
 */
async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Banco conectado e modelos sincronizados.');

    /**
     * Rota raiz da API
     * 
     * @route GET /
     * @returns {Object} Status da API e nome da aplicação
     */
    app.get('/', (req, res) => res.json({ status: 'ok', app: 'Biblioteca API' }));

    /**
     * Lista todos os livros com filtros opcionais
     * 
     * Permite buscar livros por:
     * - Título (busca parcial, case-insensitive)
     * - Autor (busca parcial, case-insensitive)
     * - Disponibilidade (true/false)
     * 
     * @route GET /livros
     * @queryparam {string} [titulo] - Filtro por título (busca parcial)
     * @queryparam {string} [autor] - Filtro por autor (busca parcial)
     * @queryparam {string} [disponivel] - Filtro por disponibilidade ("true" ou "false")
     * @returns {Array<Livro>} Lista de livros ordenada por título
     * @returns {Object} 500 - Erro ao buscar livros
     */
    app.get('/livros', async (req, res) => {
      try {
        const where = {};
        if (req.query.titulo) where.titulo = { [Op.like]: `%${req.query.titulo}%` };
        if (req.query.autor) where.autor = { [Op.like]: `%${req.query.autor}%` };
        if (req.query.disponivel !== undefined) where.disponivel = req.query.disponivel === 'true';

        const livros = await Livro.findAll({ where, order: [['titulo', 'ASC']] });
        res.json(livros);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar livros' });
      }
    });

    /**
     * Busca um livro específico por ID
     * 
     * @route GET /livros/:id
     * @param {number} id - ID do livro a ser buscado
     * @returns {Livro} Dados completos do livro
     * @returns {Object} 404 - Livro não encontrado
     */
    app.get('/livros/:id', async (req, res) => {
      const livro = await Livro.findByPk(req.params.id);
      if (!livro) return res.status(404).json({ error: 'Livro não encontrado' });
      res.json(livro);
    });

    /**
     * Cria um novo livro no banco de dados
     * 
     * @route POST /livros
     * @bodyparam {string} titulo - Título do livro (obrigatório)
     * @bodyparam {string} autor - Autor do livro (obrigatório)
     * @bodyparam {number} [ano] - Ano de publicação
     * @bodyparam {string} [genero] - Gênero do livro
     * @bodyparam {boolean} [disponivel=true] - Se o livro está disponível
     * @bodyparam {string} [descricao] - Descrição do livro
     * @bodyparam {string} [imagemUrl] - URL da imagem de capa
     * @bodyparam {string} [linkDownload] - Link para download do livro
     * @returns {Livro} 201 - Livro criado com sucesso
     * @returns {Object} 500 - Erro ao criar livro
     */
    app.post('/livros', async (req, res) => {
      try {
        const novo = await Livro.create(req.body);
        res.status(201).json(novo);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar livro' });
      }
    });

    /**
     * Atualiza completamente um livro existente
     * 
     * Substitui todos os dados do livro pelos novos valores fornecidos
     * 
     * @route PUT /livros/:id
     * @param {number} id - ID do livro a ser atualizado
     * @bodyparam {string} titulo - Novo título do livro
     * @bodyparam {string} autor - Novo autor do livro
     * @bodyparam {number} [ano] - Novo ano de publicação
     * @bodyparam {string} [genero] - Novo gênero
     * @bodyparam {boolean} [disponivel] - Nova disponibilidade
     * @bodyparam {string} [descricao] - Nova descrição
     * @bodyparam {string} [imagemUrl] - Nova URL da imagem
     * @bodyparam {string} [linkDownload] - Novo link de download
     * @returns {Livro} Livro atualizado
     * @returns {Object} 404 - Livro não encontrado
     * @returns {Object} 500 - Erro ao atualizar livro
     */
    app.put('/livros/:id', async (req, res) => {
      try {
        const livro = await Livro.findByPk(req.params.id);
        if (!livro) return res.status(404).json({ error: 'Livro não encontrado' });
        await livro.update(req.body);
        res.json(livro);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar livro' });
      }
    });

    /**
     * Atualiza parcialmente um livro existente
     * 
     * Permite atualizar apenas campos específicos sem afetar os demais
     * Útil para alterações pontuais como mudar apenas a disponibilidade
     * 
     * @route PATCH /livros/:id
     * @param {number} id - ID do livro a ser atualizado
     * @bodyparam {Object} campos - Campos a serem atualizados (qualquer campo do modelo Livro)
     * @returns {Livro} Livro atualizado
     * @returns {Object} 404 - Livro não encontrado
     * @returns {Object} 500 - Erro ao atualizar livro
     */
    app.patch('/livros/:id', async (req, res) => {
      try {
        const livro = await Livro.findByPk(req.params.id);
        if (!livro) return res.status(404).json({ error: 'Livro não encontrado' });
        await livro.update(req.body);
        res.json(livro);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar livro' });
      }
    });

    /**
     * Remove permanentemente um livro do banco de dados
     * 
     * @route DELETE /livros/:id
     * @param {number} id - ID do livro a ser removido
     * @returns {Object} Mensagem de confirmação da remoção
     * @returns {Object} 404 - Livro não encontrado
     * @returns {Object} 500 - Erro ao remover livro
     */
    app.delete('/livros/:id', async (req, res) => {
      try {
        const livro = await Livro.findByPk(req.params.id);
        if (!livro) return res.status(404).json({ error: 'Livro não encontrado' });
        await livro.destroy();
        res.json({ message: 'Livro removido' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao remover livro' });
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`API Biblioteca rodando na porta ${PORT}`));

  } catch (err) {
    console.error('Erro ao iniciar servidor:', err);
  }
}

start();
