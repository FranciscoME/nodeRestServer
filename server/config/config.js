import { url } from "inspector";

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
    urlDB='mongodb://paco:pancho1@ds135217.mlab.com:35217/cafe'
}

process.env.MYURLDB = urlDB;