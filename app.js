const usuarios = require('./routes/usuarios');
const cursos = require('./routes/cursos');
const auth = require('./routes/auth');
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

//conexión BD
const dbName = 'pruebaApi';
mongoose.connect(config.get('configDB.host')+config.get('configDB.dbName'))
    .then(() => console.log('conectado a MongoDB...'+config.get('configDB.host')+config.get('configDB.dbName')))
    .catch(err => console.log('No se pudo conectar con MongoDB...', err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/usuarios',usuarios);
app.use('/api/cursos',cursos);
app.use('/api/auth',auth);

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log('Api RESTFull ejecutándose...'))