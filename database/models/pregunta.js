const mongoose = require('../connect');
const Schema = mongoose.Schema;

const preguntaSchema = Schema({
    guia: {
        type: Schema.Types.ObjectId,
        ref: "Guia",
        require:'Falta info de la Guia'
    },
    tipo: {
        type: String,
        required: 'Debe definir el tipo de pregunta'
    },   
    contenido: {
        type: String,
        required: 'falyta el contenido de pregunta'
    },
    respuesta: {
        type: String,
        required: 'Falta  respuesta a la pregunta'
    },
    valorS100: {
        type: Number,
        required: 'Falta el valor sobre 100'
    },   
    fechaRegistro: {
        type: Date,
        default: Date.now()
    }
});

const pregunta = mongoose.model('Pregunta', preguntaSchema);

module.exports = pregunta;