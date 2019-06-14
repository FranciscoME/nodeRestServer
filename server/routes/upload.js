const express = require('express');
const fileUpload= require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

//Default options
app.use(fileUpload({useTempFiles: true}));


app.put('/upload/:tipo/:id', (req,res)=>{

    let tipo=req.params.tipo;
    let id= req.params.id


    if(!req.files){
        return res.status(400).json({ok:false,err:{message:'No se ha seleccionado ningún archivo'}});
    }

    //Validar tipo
    let tiposValidos = ['productos','usuarios'];

    //Si no esta asignado a un producto o usuario
    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,err:{message:'Los tipos permitidos son: '+tiposValidos.join(', '),
        //    ext:extensionArchivo
        }})
    }



    let archivo = req.files.archivo;

    let nombreCortadoArchivo = archivo.name.split('.');

    let extensionArchivo = nombreCortadoArchivo[nombreCortadoArchivo.length-1];
    
    //Extenciones permitidas
    let extencionesValidas = ['png','jpg','gif','jpeg'];

    //Si no es una extencion valida
    if(extencionesValidas.indexOf(extensionArchivo)<0){
        return res.status(400).json({
            ok:false,err:{message:'Las extenciones validas son: '+extencionesValidas.join(', '),
            ext:extensionArchivo
        }})
    }

    //Cambiar nombre al archivo para hacerlo 'unico'
    
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`,(err)=>{
        if(err){
            return res.status(400).json({ok:false,err});
        }
    })
    

    switch (tipo) {
        case 'usuarios':   
                //aqui, la imagen ya esta guardada            
                imagenUsuario(id,res,nombreArchivo);
            
            break;
        case 'productos':
                //aqui, la imagen ya esta guardada            
                ImagenProducto(id,res,nombreArchivo);
            break;    
    
        default:
            break;
    }

    // if(tipo==='usuarios'){
    
    //     //aqui, la imagen ya esta guardada
    
    //     imagenUsuario(id,res,nombreArchivo);
    // }
    // else{
     
    //     //aqui, la imagen ya esta guardada
    
    //     ImagenProducto(id,res,nombreArchivo);
    // }


});


function imagenUsuario(id,res,nombreArchivo){
    Usuario.findById(id,(err,usuarioDB)=>{
        if(err){
            //Si ocurre un error.. aun así ya se habia guardado la imagen asi que hay que eliminarla
            borraArchivo(nombreArchivo,'usuarios')
            return res.status(500).json({ok:false,err});
        }

        if(!usuarioDB){
            borraArchivo(nombreArchivo,'usuarios')
            return res.status(400).json({ok:false,err:{message:'El usuario no existe'}});
        }


        //Borramos archivo si ya existe en la carpeta, para despues agregar el nuevo archivo
        borraArchivo(usuarioDB.img,'usuarios')


        usuarioDB.img= nombreArchivo;

        usuarioDB.save((err,usuarioDBNomImagenGuardada)=>{
            if(err){
                return res.status(500).json({ok:false,err});
            }

            res.json({
            ok:true,
            usuario:usuarioDBNomImagenGuardada,
            img:nombreArchivo
            })

        })

    });
}    


function ImagenProducto(id,res,nombreArchivo) {

    Producto.findById(id,(err,productoDB)=>{
        if(err){
            borraArchivo(nombreArchivo,'productos')
            return res.status(500).json({ok:false,err});
        }
        if(!productoDB){
            borraArchivo(nombreArchivo,'productos')
            return res.status(400).json({ok:false,err:{message:'El producto no existe'}});
        }
        //Borramos archivo si ya existe en la carpeta, para despues agregar el nuevo archivo
        borraArchivo(productoDB.img,'productos')
        productoDB.img=nombreArchivo;

        productoDB.save((err,productoDBNomImagenGuardada)=>{
            if(err){
                return res.status(500).json({ok:false,err});
            }

            res.json({
                ok:true,
                producto:productoDBNomImagenGuardada,
                img:nombreArchivo
            })

        });

    })
    
}

function borraArchivo(nombreImagen,tipo) {
    
    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`);

    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}


module.exports=app;
