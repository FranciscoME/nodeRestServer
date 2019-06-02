const express = require('express');
const app = express();
const bodyparser = require('body-parser');
require('./config/config');


app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.get('/usuario',(req,res)=>{
    res.json('getUsuario')
})

app.post('/usuario',(req,res)=>{
    let body = req.body;
    if(body.nombre===undefined){
        res.status(400).json({ok:false,mensaje:'El nombre es necesario'})
    }
    else{
        res.json({persona:body})
    }
    
})

app.put('/usuario/:id',(req,res)=>{
    let id = req.params.id;
    res.json({id});
})

app.delete('/usuario',(req,res)=>{
    res.json('delete usuario')
})



app.listen(process.env.PORT,()=>{console.log("escuchando servidor en pto: "+process.env.PORT);})