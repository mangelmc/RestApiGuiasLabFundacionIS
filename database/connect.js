const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/guiasLab", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexion a MongoDB exitosa..! :)');
}).catch(err => {
    console.log('Error en la conexion hacia mongo DB :(');
});
module.exports = mongoose;