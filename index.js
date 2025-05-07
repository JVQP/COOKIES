const express = require('express');
const path = require('path');

let app = express();

app.use(express.static(path(__dirname, 'Public')));


app.get('/', (req, res) => {

res.sendFile(path(__dirname, 'index.html'));

});


app.listen(3000, console.log('Rodando...'));