const jwt = require('jsonwebtoken');

//====================
//Verificar token
//====================

let verificaToken = (req,res,next)=>{
    //Obtener los heades de la peticion
    let token = req.get('token');

    jwt.verify(token,process.env.SEED,(err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario;
        
        //next hace que continue el procedimiento de la solicitud
        next();

    })

};


//====================
//Verificar ADMIN_ROLE
//====================

let verificaAdmin_Role = (req,res,next)=>{
    //Obtener los heades de la peticion
    let usuario = req.usuario;

    if(usuario.role !== 'ADMIN_ROLE'){
        return res.status(401).json({ok:false,message:'No tiene los permisos necesarios'})
    }
    else{
        next();
    }

    

};


module.exports={
    verificaToken,
    verificaAdmin_Role
}