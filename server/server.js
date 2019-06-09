const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyparser = require('body-parser');
require('./config/config');


//parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({extended:false}));
//parse application/json
app.use(bodyparser.json());
//Acceso a multiples rutas
app.use(require('./routes/index'));




mongoose.connect(process.env.MYURLDB,{ useNewUrlParser: true , useCreateIndex:true},(err,res)=>{
    if(err) throw err;

    console.log('Base de datos online');
}); 

app.listen(process.env.PORT,()=>{console.log("escuchando servidor en pto: "+process.env.PORT);})