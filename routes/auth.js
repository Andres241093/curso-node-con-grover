const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario_model');
//const Joi = require('@hapi/joi');
const ruta = express.Router();
const config = require('config');

ruta.post('/', (req, res) => {
    Usuario.findOne({ email: req.body.email })
        .then(datos => {
            if (datos) {
                const passwordValidate = bcrypt.compareSync(req.body.password, datos.password);
                const jwtoken = jwt.sign({
                    usuario: {
                    _id: datos.id,
                    nombre: datos.nombre,
                    email: datos.email
                }
            }, config.get('configToken.signature'), { expiresIn: config.get('configToken.exp') });
    return passwordValidate ? res.json({
        _id: datos.id,
        nombre: datos.nombre,
        email: datos.email,
        jwtoken
    }) : res.status(400).json({ error: 'Usuario o contraseña incorrecta' })
}else {
    res.status(400).json({
        error: 'Usuario o contraseña incorrecta'
    })
}
    })
    .catch(err => {
        res.status(400).json({ error: 'Error en el servicio ' + err });
    });
});

module.exports = ruta;