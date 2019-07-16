var express = require('express');
var router = express.Router();


const Laboratorio = require('../../database/models/laboratorio');


/* Agregar nuevo Laboratorio */
router.post("/", (req, res) => {
        let fields = req.body;
        let datos = {
            guia:fields.guia,
            estudiante:fields.estudiante,
        }
        if(fields.tiempo != undefined){
            datos.tiempo = fields.tiempo
        }
        const modelLaboratorio = new Laboratorio(datos);
        modelLaboratorio.save()
          
          .then(result => {
            res.status(201).json({message: 'Se Agrego  Laboratorio',result});
          })
          .catch(err => {
            res.status(500).json({error:err.message})
          });  
});
/* listar Laboratorios */
router.get('/', function (req, res, next) {

    Laboratorio.find().select('-__v').exec().then(docs => {
        if(docs.length == 0){
        return res.status(404).json({message: 'No existen Laboratorios disponibles'});
        }
        res.json({data:docs});
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});
/* LIstar Laboratorios de un docente */
router.get('/docente/:id', function (req, res, next) {
    Laboratorio.find({docente:req.params.id}).select('-__v').exec().then(docs => {
        if(docs.length == 0){
        return res.status(404).json({message: 'No existen Laboratorios registrados'});
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
    let idLaboratorio = req.params.id;
    const datos = {};

    Object.keys(req.body).forEach((key) => {
      if (key != 'guia' ||key != 'estudiante'  ) {
        datos[key] = req.body[key];  
      }  
    });
    Laboratorio.updateOne({_id: idLaboratorio}, datos).exec()
        .then(result => {
            let message = 'Datos actualizados';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el reLaboratorio';
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
    let idLaboratorio = req.params.id;
    Laboratorio.deleteOne({_id: idLaboratorio}).exec()
        .then(result => {
            let message = 'Se elimino el reLaboratorio';
            if (result.ok == 0) {
                message = 'Verifique los datos, no se realizaron cambios';
            }
            if (result.ok == 1 && result.n == 0) {
                message = 'No se encontro el reLaboratorio';
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
