const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion:{
        type:String,
        unique:true,
        required:[true,'Descripcion es requerida']
        
    },
    usuario:{type: Schema.Types.ObjectId, ref:'usuario'}
    
});

module.exports= mongoose.model('categoria',categoriaSchema);
