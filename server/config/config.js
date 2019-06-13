//import { url } from "inspector";

//==============================
//--configuracion del puerto
//==============================
process.env.PORT = process.env.PORT|| 3000; 




//==============================
//--Entorno de desarrollo
//==============================
process.env.NODE_ENV= process.env.NODE_ENV||'dev';


//==============================
//--Vencimiento del token
//==============================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = '48h'


//==============================
//--SEED de autenticación
//==============================
process.env.SEED=  process.env.SEED||'este-es-el-seed-desarrollo';


//==============================
//--Entorno de  DB
//==============================
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB='mongodb://localhost:27017/cafe'
}
else{
    // MONGO_URI = variable de entorno generada en  heroku config:set MONGO_URI="mongodb:/.....
    urlDB=process.env.MONGO_URI;
}

process.env.MYURLDB = urlDB;

//==============================
//--Google Client ID
//==============================

process.env.CLIENT_ID = process.env.CLIENT_ID||'720116371248-hlk1momp3i0epai1a1s34rhavdn0huga.apps.googleusercontent.com'