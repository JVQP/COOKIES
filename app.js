const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
require('dotenv').config();
const nodemailer = require('nodemailer');


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
        data VARCHAR(100)
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
app.use('/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));

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

    const sql = `INSERT INTO chamado (usuario, email, posto, objeto, defeito, endereco, data) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [usuario, email, posto, objeto, defeito, endereco, data], function (err) {
        if (err) {
            console.log('Erro ao inserir dados:', err.message);
            return res.status(500).json({ sucesso: false, url: '/error.html' });
        }

        console.log(`Dados inseridos com sucesso.`);

 
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: 'jaumvit0r222@gmail.com',
                pass: 'nqnw aiwo flcs urdh'
            }
        });

        const mailOptions = {
            from: 'jaumvit0r222@gmail.com',
            to: email,
            subject: 'Confirmação de chamado',
            html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
    <h2 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 10px;">📋 Confirmação do chamado</h2>
    <p><strong>👤 Nome:</strong> ${usuario}</p>
    <p><strong>📧 Email:</strong> ${email}</p>
    <p><strong>📍 Posto:</strong> ${posto}</p>
    <p><strong>🖥️ Objeto:</strong> ${objeto}</p>
    <p><strong>❗ Defeito:</strong> ${defeito}</p>
    <hr style="margin-top: 20px;">
    <p style="font-size: 12px; color: #777;">Este é um e-mail automático enviado pelo sistema de registro de defeitos.</p>
  </div>
`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Erro ao enviar email:', error);
                return res.status(500).json({ sucesso: false, url: '/error.html' });
            }

            console.log('Email enviado:', info.response);
            res.json({ sucesso: true, url: '/mensagem.html' });
        });
    });
});


// Iniciar servidor
app.listen(3000, () => {
    console.log('Rodando na porta 3000...');
});
