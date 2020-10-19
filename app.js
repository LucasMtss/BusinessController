const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaClientes = require('./routes/clientes');
const rotaServicos = require('./routes/servicos');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Acces-Control-Allow-Origin', '*');
    res.header(
        'Acces-Control-Allow-Header',
        'Origin, X-Requerested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next();
});

app.use('/clientes', rotaClientes);
app.use('/servicos', rotaServicos);

app.use((req, res, next) => {
    const erro = new Error('Não encontrado!!');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            menssagem: error.message
        }
    });
});

module.exports = app;