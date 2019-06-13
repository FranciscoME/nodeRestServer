const express = require('express');

const app = express();

const {verificaToken} = require('../middlewares/autenticacion');

const Producto = require('../models/producto');


const _ = require('underscore');

//=============================
//Obtener todos los productos
//=============================

app.get('/producto',verificaToken,(req,res)=>{
    
    let desde = req.query.desde ||0;
    desde = Number(desde);
   // let hasta = req.query.hasta ||0;

    Producto.find({disponible:true})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err,productosDB)=>{
            if(err){return res.status(500).json({ok:false,err})}

            Producto.count({},(err,count)=>{
                if(err){return res.status(400).json({ok:false,err})}

                res.json({
                    ok:true,
                    productos:productosDB,
                    conteo:count
                })
            })
        })        
})


//=============================
//Obtener todos los productos
//=============================
app.get('/producto/:id',verificaToken,(req,res)=>{
    let id = req.params.id;

    Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria','nombre')
    .exec((err,productoDB)=>{
        if(err){
            return res.status(500).json({ok:false,err})
        }

        if(!productoDB){
            return res.status(400).json({ok:false,err:{message:'No se encontro un producto con ese id'}})
        }
        res.json({
            ok:true,
            producto:productoDB
        })
    })

})

//=============================
// Buscar productos
//=============================

app.get('/producto/buscar/:termino',verificaToken,(req,res)=>{

    let termino = req.params.termino;

    let regex = new RegExp(termino,'i')
    Producto.find({nombre:regex}) 
    .populate('categoria','descripcion')
    .exec((err,productos)=>{
        if(err){
            return res.status(500).json({ok:false,err})
        }

        res.json({
            ok:true,
            productos
        })
    })

})



//=============================
//Crear un nuevo producto
//=============================

app.post('/producto',verificaToken,(req,res)=>{

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible:body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err,productoDB)=>{
        if(err){return res.status(400).json({ok:false,err})}

        if(!productoDB){return res.status(500).json({ok:false,err})}

        res.status(201).json({
            ok:true,
            producto:productoDB
        })
    })
    
})



//=============================
//Actualizar un nuevo producto
//=============================

app.put('/producto/:id',verificaToken,(req,res)=>{
    
    //Tambien se puede actualizar de la siguiente forma
    // //obtener los datos enviados en el query de la peticion
    // let id = req.params.id;
    // //obtener los datos enviados por el formulario
    // let body= _.pick(req.body,['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria', 'usuario']);

    // Producto.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,productoDB)=>{
    //     if(err){
    //         return res.status(400).json({ok:false,err})
    //     }

    //     res.json({
    //         ok:true,
    //         producto:productoDB
    //     });
    // })

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id,(err,productoDB)=>{

        if(err){
            return res.status(400).json({ok:false,err})
        }

        if(!productoDB){
            return res.status(400).json({ok:false,err:{message:'Producto no encontrado'}})
        }

        productoDB.nombre= body.nombre;
        productoDB.precioUni= body.precioUni;
        productoDB.categoria= body.categoria;
        productoDB.disponible= body.disponible;
        productoDB.descripcion= body.descripcion;

        productoDB.save((err,productoGuardado)=>{
            if(err){
                return res.status(400).json({ok:false,err})
            }

            res.json({
                ok:true,
                producto:productoGuardado
            })
        });


    })


});


//=============================
//Eliminar un producto
//=============================

app.delete('/producto/:id',verificaToken,(req,res)=>{
    let id = req.params.id;
    let cambiaDisponible = {disponible:false}
    //Tambien se puede hacer de esta forma
    // Producto.findByIdAndUpdate(id,cambiaDisponible,{new:true},(err,productoEliminadoDB)=>{
    //     if(err){
    //         return res.status(400).json({ok:false,err})
    //     }

    //     if(!productoEliminadoDB){
    //         return res.status(400).json({ok:false,err:{message:'Producto no encontrado'}})
    //     }

    //     res.json({
    //         ok:true,
    //         message:'Producto eliminado',
    //         producto:productoEliminadoDB
    //     })

    // })


    Producto.findById(id,(err,productoDB)=>{
        if(err){
            return res.status(500).json({ok:false,err})
        }

        if(!productoDB){
            return res.status(400).json({ok:false,err:{message:'Id no existe'}})
        }

        productoDB.disponible=false;

        productoDB.save((err,productoBorrado)=>{
            if(err){
                return res.status(500).json({ok:false,err})
            }

            res.json({
                ok:true,
                producto:productoBorrado,
                message:'Producto borrado'
            })
        });


    })

})


module.exports=app;
