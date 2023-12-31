const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autorSchema = new mongoose.Schema({
    nombre: String,
    email: String
});

const cursoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    autor: autorSchema,
    descripcion: {
        type: String,
        required: false
    },
    estado: {
        type: Boolean,
        default: true
    },
    imagen: {
        type: String,
        required: false
    },
    alumnos: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Curso', cursoSchema);