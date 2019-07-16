var createError = require('http-errors');
var express = require('express');
var path = require('path');

var logger = require('morgan');

var indexRouter = require('./routes/index');
var usuariosRouter = require('./routes/api/usuarios');
var imagenesRouter = require('./routes/api/imagenes');
var materiasRouter = require('./routes/api/materias');
var cursosRouter = require('./routes/api/cursos');
var integrantesRouter = require('./routes/api/integrantes');
var guiasRouter = require('./routes/api/guias');
var preguntasRouter = require('./routes/api/preguntas');
var laboratoriosRouter = require('./routes/api/laboratorios');
var respuestasRouter = require('./routes/api/respuestas');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/imagenes', imagenesRouter);
app.use('/api/materias', materiasRouter);
app.use('/api/cursos', cursosRouter);
app.use('/api/integrantes', integrantesRouter);
app.use('/api/guias', guiasRouter);
app.use('/api/preguntas', preguntasRouter);
app.use('/api/laboratorios', laboratoriosRouter);
app.use('/api/respuestas', respuestasRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.json({error: err.message})
});

const port = 8000;
app.listen(port, ()=>{
    console.log('Servidor escuchando en el puerto ' + port);
});



module.exports = app;
