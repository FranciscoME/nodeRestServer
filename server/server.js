const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyparser = require('body-parser');
require('./config/config');

//Para que reconozca el path de la carpeta public
const path = require('path');

//parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({extended:false}));
//parse application/json
app.use(bodyparser.json());

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname,'../public')));


//Acceso a multiples rutas
app.use(require('./routes/index'));






mongoose.connect(process.env.MYURLDB,{ useNewUrlParser: true , useCreateIndex:true},(err,res)=>{
    if(err) throw err;

    console.log('Base de datos online');
}); 

app.listen(process.env.PORT,()=>{console.log("escuchando servidor en pto: "+process.env.PORT);})