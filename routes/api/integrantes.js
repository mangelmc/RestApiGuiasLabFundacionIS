var express = require('express');
var router = express.Router();


const Integrante = require('../../database/models/integrante');


/* Agregar nuevo Integrante */
router.post("/", (req, res) => {
        let fields = req.body;
        let datos = {
            curso:fields.curso,
            estudiante:fields.estudiante,           
            gestion:fields.gestion//??
        }

        const modelIntegrante = new Integrante(datos);
        modelIntegrante.save()
          
          .then(result => {
            res.status(201).json({message: 'Se Agrego  Integrante',result});
          })
          .catch(err => {
            res.status(500).json({error:err.message})
          });  
});


/* listar Integrantes */
router.get('/', function (req, res, next) {
    criterios = {};
    /* LIstar Integrantes de un Curso */
    if (req.query.curso != undefined) {
        criterios.curso = req.query.curso
    }

    Integrante.find(criterios).populate('estudiante', '-password -__v -tipo').select('-__v').exec().then(docs => {
        if(docs.length == 0){
            return res.status(404).json({message: 'No existen Integrantes disponibles'});
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
    let idIntegrante = req.params.id;
    const datos = {//solo se puede actualizar la nota ??
        nota:req.body.nota
    };

    
    Integrante.updateOne({_id: idIntegrante}, datos).exec()
        .then(result => {
            let message = 'Datos actualizados';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el reIntegrante';
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
//// no son necesarios VVVVVVV seguridad, audi
router.delete('/:id', function (req, res) {
    let idIntegrante = req.params.id;
    Integrante.deleteOne({_id: idIntegrante}).exec()
        .then(result => {
            let message = 'Se elimino el reIntegrante';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el reIntegrante';
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
