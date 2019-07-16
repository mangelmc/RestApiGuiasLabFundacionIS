var express = require('express');
var router = express.Router();


const Guia = require('../../database/models/guia');


/* Agregar nuevo Guia */
router.post("/", (req, res) => {
        let fields = req.body;
        let datos = {
            curso:fields.curso,
            numero:fields.numero,
            contenidoHtml:fields.contenidoHtml,
            docente:fields.docente
        }

        const modelGuia = new Guia(datos);
        modelGuia.save()
          
          .then(result => {
            res.status(201).json({message: 'Se Agrego  Guia',result});
          })
          .catch(err => {
            res.status(500).json({error:err.message})
          });  
});
/* listar Guias */
router.get('/', function (req, res, next) {

    Guia.find().select('-__v').exec().then(docs => {
        if(docs.length == 0){
        return res.status(404).json({message: 'No existen Guias disponibles'});
        }
        res.json({data:docs});
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});
/* LIstar Guias de un docente */
router.get('/docente/:id', function (req, res, next) {
    Guia.find({docente:req.params.id}).select('-__v').exec().then(docs => {
        if(docs.length == 0){
        return res.status(404).json({message: 'No existen Guias registrados'});
        }
        res.json({data:docs});
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});



router.patch('/:id', function (req, res) {
    let idGuia = req.params.id;
    const datos = {//solo se puede actualizar el contenido ??
        contenidoHtml:req.body.contenidoHtml
    };
    
    Guia.updateOne({_id: idGuia}, datos).exec()
        .then(result => {
            let message = 'Datos actualizados';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el reGuia';
            }
            if (result.ok == 1 && result.n == 1 && result.nModified == 0) {
                message = 'Se recibieron los mismos datos antiguos,no se realizaron cambios';
            }
            res.json({
                message,
                result
            });
            
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        });
});
// no son necesarios VVVVVVV seguridad, audi
router.delete('/:id', function (req, res) {
    let idGuia = req.params.id;
    Guia.deleteOne({_id: idGuia}).exec()
        .then(result => {
            let message = 'Se elimino el reGuia';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el reGuia';
            }
            res.json({
                message,
                result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;
