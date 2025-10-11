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
  emprestadoPara: { type: DataTypes.STRING, allowNull: true },
  dataDevolucao: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'livros',
  timestamps: true,
});

// Inicialização
async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Banco conectado e modelos sincronizados.');

    // Rotas
    app.get('/', (req, res) => res.json({ status: 'ok', app: 'Biblioteca API' }));

    // Listar livros
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

    // Buscar por ID
    app.get('/livros/:id', async (req, res) => {
      const livro = await Livro.findByPk(req.params.id);
      if (!livro) return res.status(404).json({ error: 'Livro não encontrado' });
      res.json(livro);
    });

    // Criar livro
    app.post('/livros', async (req, res) => {
      try {
        const novo = await Livro.create(req.body);
        res.status(201).json(novo);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar livro' });
      }
    });

    // Atualizar livro (PUT)
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

    // Atualizar parcialmente (PATCH)
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

    // Excluir livro
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
