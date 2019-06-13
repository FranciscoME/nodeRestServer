const express = require('express');
const app = express();

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let Categoria = require('../models/categoria');

//const _ = require('underscore');

//===========================
//Mostrar todas las categorias
//===========================
app.get('/categoria', verificaToken, (req, res) => {

    //Categoria.find({}, ['descripcion','usuario']) si quiero datos especificos
    //Categoria.find({}) Obtener todos los datos con el id del usuario que lo creo

    Categoria.find({})
         //Mostrar datos ordenados
         .sort('descripcion')
         //Muestra los datos de la relacion
         //All data usuario , 'datos en particular que queremos del usuario'
        .populate('usuario','nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Categoria.count({}, (err, count) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    categorias,
                    conteo: count
                })
            })

        })
})

//===========================
//Mostrar todas las categorias
//===========================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

  
    Categoria.findById(id,(err,categoriaDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(500).json({
                ok:false,
                err:{
                    message:'Categoria no encontrada'
                }
            })
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        })

    })

  


})

//===========================
//Crear nueva categoria
//===========================

app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {
    //Obtenemos el id del usuario que lo creo
    
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {

            return res.status(400).json({ ok: false, err })
        }


        if (!categoriaDB) {

            return res.status(400).json({ ok: false, err })
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        })



    })


})

app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    //let body = _.pick(req.body,['descripcion']);
    let body = req.body
    let descCategoria = { descripcion: body.descripcion };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({ ok: false, err })
        }

        if (!categoriaDB) {

            return res.status(400).json({ ok: false, err })
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })

})


app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({ ok: false, err })
        }

        if (categoriaBorrada === null) {
            return res.status(400).json({ ok: false, error: { message: 'Categoria no encontrada' } });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });

    })


})


module.exports = app;