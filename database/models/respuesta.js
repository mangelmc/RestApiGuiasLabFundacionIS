const mongoose = require('../connect');
const Schema = mongoose.Schema;

const respuestaSchema = Schema({
    laboratorio: {
        type: Schema.Types.ObjectId,
        ref: "Laboratorio",
        required:'Falta info del Laboratorio'
    },/*
    estudiante: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        require:'Falta info del Estudiante'
    },*/
    pregunta: {
        type: Schema.Types.ObjectId,
        ref: "Pregunta",
        //required:'Falta info de Pregunta'
    },
    respuesta: {
        type: String,
        default: ''
    },
    url: {
        type: String,
    },    
    calificacion: {
        type: Number,
        required: 'Falta la calificacion',
        default:0
    },   
    fechaRegistro: {
        type: Date,
        default: Date.now()
    }
});

const respuesta = mongoose.model('Respuesta', respuestaSchema);

module.exports = respuesta;