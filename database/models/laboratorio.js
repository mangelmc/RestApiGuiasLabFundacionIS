//laboratorio de un estudiante
const mongoose = require('../connect');
const Schema = mongoose.Schema;

const laboratorioSchema = Schema({
    guia: {
        type: Schema.Types.ObjectId,
        ref: "Guia",
        require:'Falta info de Guia'
    },
    estudiante: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        require:'Falta info del Estudiante'
    },
    nota: {   
        type: Number,
        required: 'Falta la Nota'
    },
    gestion: {   // revisado , por revisar
        type: String,
        required: 'Es necesario el estado',
        default: 'por revisar'
    },    
    tiempo: Number, // en milisegundos   //opcional     
    fechaRegistro: {
        type: Date,
        default: Date.now()
    }
});

const laboratorio = mongoose.model('Laboratorio', laboratorioSchema);

module.exports = laboratorio;