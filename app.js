const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const { url } = require('inspector');

const db = new sqlite3.Database('Database.sqlite3', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

function createTable() {
    db.run(`CREATE TABLE IF NOT EXISTS chamado (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        posto VARCHAR(100) NOT NULL,
        objeto VARCHAR(100) NOT NULL,
        defeito VARCHAR(100) NOT NULL,
        endereco VARCHAR(100),
        data DATE DEFAULT CURRENT_DATE
    )`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela:', err.message);
        } else {
            console.log('Tabela criada ou já existe.');
        }
    });
}

function dropTable() {
    db.run(`DROP TABLE IF EXISTS chamado`, (err) => {
        if (err) {
            console.error('Erro ao excluir tabela:', err.message);
        } else {
            console.log('Tabela excluída.');
        }
    });
}


const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Public')));
app.use('/bootstrap', express.static(path.join(__dirname,'../node_modules/bootstrap/dist')));

// Rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

app.get('/pagina2', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'pagina2.html'));
});

app.get('/pagina3', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'problema.html'));
});

app.get('/pagina4', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'objetos.html'));
});

app.get('/pagina5', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'defeito.html'));
});

app.get('/pagina6', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'form.html'));
});

app.get('/mensagem', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'mensagem.html'));
});

app.get('/erro', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'error.html'));
});

app.post('/confirmar', (req, res) => {
    const { usuario, email, posto, objeto, defeito, endereco, data } = req.body;

    const sql = `INSERT INTO chamado (usuario, email, posto, objeto, defeito, endereco, data) VALUES (?, ?, ?, ?, ?, ?,?)`;
    db.run(sql, [usuario, email, posto, objeto, defeito, endereco, data], function(err) {
        if (err) {
            console.log('Erro ao inserir dados:', err.message);
            res.status(500).json({ sucesso: false , url: '/error.html' });
        } else {
            console.log(`Dados inseridos com sucesso.`);
            res.json({ sucesso: true , url: '/mensagem.html' }); 
        }
    });
});


// Iniciar servidor
app.listen(3000, () => {
    console.log('Rodando na porta 3000...');
});
