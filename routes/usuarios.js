const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario_model');
const Joi = require('@hapi/joi');
const ruta = express.Router();
const verificarToken = require('../middlewares/auth');
const schema = Joi.object({
    nombre: Joi.string()
        .min(3)
        .max(10)
        .required(),

    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{3,30}$/),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});

ruta.get('/',verificarToken,(req,res)=>{
    let resultado = listarUsuariosActivos();
    resultado
    .then(usuarios => res.json(usuarios))
    .catch(err => res.status(400).json(err));
});

ruta.get('/obtener-datos',verificarToken,(req,res)=>{
    res.json({
        usuario: req.usuario
    });
});

ruta.post('/', (req,res)=>{
    let body = req.body;

    Usuario.findOne({email: body.email})
    .then((usuario)=>{
            if(usuario){
                return res.status(400).json({
                    message: 'El usuario ya existe'
                })
            }else {
                const {error,value} = schema.validate({
                    nombre: body.nombre,
                    email: body.email
                });
                if(!error){
                    let resultado = crearUsuario(body);
                    resultado
                    .then(usuario => res.json({
                        nombre: usuario.nombre,
                        email: usuario.email
                    }))
                    .catch(err => res.status(400).json(err));
                }else {
                    res.status(400).json(error.details[0].message);
                }
            }
    });
});

ruta.put('/:id',verificarToken,(req,res)=>{
    let body = req.body;
    let id = req.params.id;
    const {error,value} = schema.validate({
        nombre: body.nombre,
        email: body.email
    });
    if(!error){
        let resultado = actualizarUsuario(id,body);
        resultado
        .then(usuario => res.json(usuario))
        .catch(err => res.status(400).json(err));
    }else{
        res.status(400).json(error.details[0].message);
    }
});

ruta.delete('/:id',verificarToken,(req,res)=>{
    let id = req.params.id;
    let resultado = desactivarUsuario(id);
    resultado
    .then(usuario => res.json(usuario))
    .catch(err => res.status(400).json(err));
});

async function crearUsuario(body){
    let usuario = new Usuario({
        ...body,
        password: bcrypt.hashSync(body.password,10)
    });
    return await usuario.save();
}

async function listarUsuariosActivos(){
    let usuarios = await Usuario
    .find({'estado':true})
    .select({nombre:1,email:1});
    return usuarios;
}

async function actualizarUsuario(id, body){
    let usuario = await Usuario.findOneAndUpdate({_id: id},{
        $set: body
    },{new: true});
    return usuario;
}

async function desactivarUsuario(id){
    let usuario = await Usuario.findOneAndUpdate({_id: id},{
        $set: {
            estado: false
        }
    },{new: true});
    return usuario;
}

module.exports = ruta;