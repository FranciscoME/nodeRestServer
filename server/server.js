const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyparser = require('body-parser');
require('./config/config');



app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(require('./routes/usuario'));



mongoose.connect(process.env.MYURLDB,{ useNewUrlParser: true , useCreateIndex:true},(err,res)=>{
    if(err) throw err;

    console.log('Base de datos online');
}); 

app.listen(process.env.PORT,()=>{console.log("escuchando servidor en pto: "+process.env.PORT);})