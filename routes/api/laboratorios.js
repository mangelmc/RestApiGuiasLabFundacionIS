var express = require('express');
var router = express.Router();


const Laboratorio = require('../../database/models/laboratorio');
const Respuesta = require('../../database/models/respuesta');
const Curso = require('../../database/models/curso');
const Guia = require('../../database/models/guia');




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
        Laboratorio.findOne({guia:fields.guia,estudiante:fields.estudiante}).exec()
            .then(result=>{
                if (result != null) {
                    return  'exists'
                }else{
                    return modelLaboratorio.save()
                }
            })
            .then(result => {
                if (result === 'exists') {
                    return res.status(400).json({message: 'El laboratorio ya existe'});
                }
                res.status(201).json({message: 'Se Agrego  Laboratorio',result});
            })
            .catch(err => {
                res.status(500).json({error:err.message})
            });  
});
/* listar Laboratorios */
router.get('/', function (req, res, next) {

    Laboratorio.find().select('-__v').populate('guia','-contenidoHtml -docente -fechaRegistro -__v').populate('estudiante','-tipo -fechaRegistro -password -__v').exec().then(docs => {
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

/* LIstar Laboratorios de un estudiante por curso*/
router.get('/estudiante/:id', function (req, res) {
    idEstudiante = req.params.id;
    let criterios = {};
    if (req.query.curso != undefined && req.query.curso.length == 24 ) {
        criterios.curso = req.query.curso;
    }else{
        return res.status(400).json({message: 'Debe especificar curso'});
    }
    Guia.find(criterios).select('_id').exec()
    //Laboratorio.find({estudiante:req.params.id}).select('-__v').exec()
    .then(docs => {
        if(docs.length == 0){
            return 'notfound';
        }
        let guias = [];
        for (let i = 0; i < docs.length; i++) {
            guias.push({guia: docs[i]._id,estudiante:idEstudiante});            
        }
        //allGuias = docs;
        //console.log(guias);
        return Laboratorio.find().or(guias).populate('guia','-__v -contenidoHtml').exec()
        
    })
    .then(docs => {
        if(docs == 'notfound'){
            return res.status(404).json({message: 'No existen Guias registradas'});
        }else{
            if (docs.length == 0) {
                return res.status(404).json({message: 'No existen Laboratorios registrados'});
            }
            res.json({labs:docs});
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});
/* estadistica de un estudiente*/
router.get('/estadistica/:id', function (req, res) {
    idEstudiante = req.params.id;
    let criterios = {};
    let countGuias = 0;
    if (req.query.curso != undefined && req.query.curso.length == 24 ) {
        criterios.curso = req.query.curso;
    }else{
        return res.status(400).json({message: 'Debe especificar curso'});
    }

    Guia.find(criterios).select('_id').exec()
    //Laboratorio.find({estudiante:req.params.id}).select('-__v').exec()
    .then(docs => {
        if(docs.length == 0){
            return 'notfound';
        }
        let guias = [];
        countGuias = docs.length;
        for (let i = 0; i < docs.length; i++) {
            guias.push({guia: docs[i]._id,estudiante:idEstudiante});            
        }
        //allGuias = docs;
        //console.log(guias);
        return Laboratorio.find().or(guias).exec()
    })
    .then(docs => {
        if(docs == 'notfound'){
            return res.status(404).json({message: 'No existen Guias registradas'});
        }else{
            if (docs.length == 0) {
                return res.status(404).json({message: 'No existen Laboratorios registrados'});
            }
            res.json({labs:docs,guias:countGuias});
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err.message
        })
    });
});

router.get('/:id', function (req, res) {
    
	let laboratorio = {};
	
	Laboratorio.findOne({_id: req.params.id}).select('-__v ')
	.populate({
		path: 'guia',
		select: '-__v',
		populate: { 
			path: 'curso',
			select: '-__v',
			populate: {path: 'materia',select:'-__v'}
		}
	  })
	.populate('estudiante','-__v -password').exec()
	.then(doc => {
        //console.log('lab',doc);
		if(doc === null){
           
			return false;//
		}else {            
            laboratorio = doc;
			return Respuesta.find({laboratorio: req.params.id}).select('-__v').populate('pregunta','-__v').exec();
		}   
	})
	.then(docs => {
		//console.log(laboratorio);
		if (docs === false) {
			return res.status(404).json({messageL: 'No se encontro el laboratorio'});
		}else{
            //console.log(docs);
            if(docs.length == 0){
				return res.status(404).json({messageR: 'No se encontraron las respuestas asociadas al laboratorio ',laboratorio});
			}
			res.json({data:docs,laboratorio});
		} 
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
                message = 'No se encontro el Laboratorio';
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
// no son necesarios  seguridad, audi
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
