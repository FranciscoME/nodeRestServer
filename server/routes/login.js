const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const app = express();


app.post('/login', (req,res)=>{

    let body = req.body;
    Usuario.findOne({email:body.email}, (err, usuarioDB)=>{
        if(err){
            return res.status(500).json({ok:false,err})
        }

        if(!usuarioDB){
            return res.status(400).json({ok:false,err:{ message:"<usuario> o contraseña incorrecto"}})
        }

        //bcrypt.comareSync ofrece saber si hay match en las contraseñas
        if(!bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(400).json({ok:false,err:{ message:"usuario o <contraseña> incorrecto"}})
        }
        
        //generamos el token 
        let token = jwt.sign({
            usuario:usuarioDB
        },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN })

        //se envia la respuesta junto con el token y datos
        res.json({
            ok:true,
            usuario:usuarioDB,
            token
        })

    })

});











module.exports=app;