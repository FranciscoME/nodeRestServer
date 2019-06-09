//import { url } from "inspector";

//--configuracion del puerto
process.env.PORT = process.env.PORT|| 3000; 





//Entorno de desarrollo
process.env.NODE_ENV= process.env.NODE_ENV||'dev';

//--Entorno de  DB
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB='mongodb://localhost:27017/cafe'
}
else{
    // MONGO_URI = variable de entorno generada en  heroku config:set MONGO_URI="mongodb:/.....
    urlDB=process.env.MONGO_URI;
}

process.env.MYURLDB = urlDB;