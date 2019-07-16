var express = require('express');
var router = express.Router();


const Curso = require('../../database/models/curso');


/* Agregar nuevo Curso */
router.post("/", (req, res) => {
        let fields = req.body;
        let datos = {
            materia:fields.materia,
            docente:fields.docente,
            gestion:fields.gestion,
            grupo:fields.grupo,
        }

        const modelCurso = new Curso(datos);
        modelCurso.save()
          
          .then(result => {
            res.status(201).json({message: 'Se Agrego el Curso',result});
          })
          .catch(err => {
            res.status(500).json({error:err.message})
          });  
});
/* listar Cursos */
router.get('/', function (req, res, next) {

    Curso.find().select('-__v').exec().then(docs => {
        if(docs.length == 0){
        return res.status(404).json({message: 'No existen Cursos disponibles'});
        }
        res.json({data:docs});
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});
/* LIstar Cursos de un docente */
router.get('/docente/:id', function (req, res, next) {
    Curso.find({docente:req.params.id}).select('-__v').exec().then(docs => {
        if(docs.length == 0){
        return res.status(404).json({message: 'No existen Cursos registrados'});
        }
        res.json({data:docs});
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});

//// no son necesarios VVVVVVV

router.patch('/:id', function (req, res) {
    let idCurso = req.params.id;
    const datos = {
        gestion:req.body.gestion
    };

    
    Curso.updateOne({_id: idCurso}, datos).exec()
        .then(result => {
            let message = 'Datos actualizados';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el recurso';
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

router.delete('/:id', function (req, res) {
    let idCurso = req.params.id;
    Curso.deleteOne({_id: idCurso}).exec()
        .then(result => {
            let message = 'Se elimino el recurso';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el recurso';
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