const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');

let app = express();

app.use(express.static(path.join(__dirname, 'Public')));
app.use('/bootstrap', express.static(path.join(__dirname,'../node_modules/bootstrap/dist')));



app.get('/', (req, res) => {

res.sendFile(path.join(__dirname, 'index.html'));

});


app.get('/pagina2', (req, res) => {

res.sendFile(path.join(__dirname, 'pagina2.html'));

});



app.listen(3000, console.log('Rodando...'));