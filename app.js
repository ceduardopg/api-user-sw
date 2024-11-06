const express = require('express');
//const pool = require('./db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();
const User = require('./models/user');

app.use(express.json());

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Usuários',
            version: '1.0.0',
            description: 'Uma API para gerenciar usuários',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do usuário
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do usuário
 *                 nome:
 *                   type: string
 *                   description: Nome do usuário
 *                 email:
 *                   type: string
 *                   description: Email do usuário
 *       400:
 *         description: Dados inválidos
 */
app.post('/users', async (req, res) => {
    try {
        const { nome, email } = req.body;
        const newUser = await User.create({ nome, email });
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(400).send('Erro ao criar o usuário');
    }
});

// Rota para obter todos os usuários
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna todos os usuários
 *     responses:
 *       200:
 *         description: Uma lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do usuário
 *                   nome:
 *                     type: string
 *                     description: Nome do usuário
 *                   email:
 *                     type: string
 *                     description: Email do usuário
 */
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
});

// Rota para obter um usuário específico pelo ID
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário específico pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do usuário
 *                 nome:
 *                   type: string
 *                   description: Nome do usuário
 *                 email:
 *                   type: string
 *                   description: Email do usuário
 *       404:
 *         description: Usuário não encontrado
 */
app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
});


/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza as informações de um usuário pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Novo nome do usuário
 *               email:
 *                 type: string
 *                 description: Novo email do usuário
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do usuário
 *                 nome:
 *                   type: string
 *                   description: Nome atualizado do usuário
 *                 email:
 *                   type: string
 *                   description: Email atualizado do usuário
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Usuário não encontrado
 */
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }

        // Atualiza o usuário com os novos dados
        user.nome = nome;
        user.email = email;
        await user.save();

        res.json(user); // Retorna o usuário atualizado
    } catch (error) {
        console.error(error);
        res.status(400).send('Erro ao atualizar o usuário');
    }
});

/**
* @swagger
* /users/{id}:
*   delete:
*     summary: Deleta um usuário pelo ID
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: ID do usuário a ser deletado
*         schema:
*           type: integer
*     responses:
*       200:
*         description: Usuário deletado com sucesso
*       404:
*         description: Usuário não encontrado
*/
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }

        await user.destroy(); // Deleta o usuário
        res.status(200).send('Usuário deletado com sucesso'); // Retorna uma resposta de sucesso
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao deletar o usuário');
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
