const Estudiante = require('../models/estudiante');
const Usuario = require('../models/usuario');
const Titulacion = require('../models/titulacion');

const fs = require('fs');

const borrarImgAnterior = ( path ) => {
    if(fs.existsSync(path)){
        fs.unlinkSync(path);
    }
}

const actualizarImagen = async(path, id, fileName, usuario)=> {

    let oldPath = '';

    const uid = usuario;

    switch (path) {
        case 'estudiantes':

            const estudiante = await Estudiante.findById(id);
            if(!estudiante){
                return false;
            }else{
                oldPath = `./uploads/estudiantes/${ estudiante.img }`;
                borrarImgAnterior(oldPath);
                estudiante.img = fileName;
                await estudiante.save();
                return true;
            }

        case 'usuarios':

            const usuario = await Usuario.findById(id);
                
            if(!usuario){
                return false;
            }else{
                oldPath = `./uploads/usuarios/${ usuario.img }`;
                borrarImgAnterior(oldPath);
                usuario.img = fileName;
                await usuario.save();
                return true;
            }

        case 'titulos':

            var titulacion = await Titulacion.findById(id);                
            
            if(!titulacion){
                return false;
            }else{
                oldPath = `./uploads/titulos/${ titulacion.titulo_secure_url }`;
                borrarImgAnterior(oldPath);
                titulacion.titulo_secure_url = fileName;
                await titulacion.save();
                
                return true;
            }
        
        case 'actas':

            var titulacion = await Titulacion.findById(id);                
            
            if(!titulacion){
                return false;
            }else{
                oldPath = `./uploads/actas/${ titulacion.acta_secure_url }`;
                borrarImgAnterior(oldPath);
                titulacion.acta_secure_url = fileName;
                await titulacion.save();
                
                return true;
            }
    }    

}

module.exports = { actualizarImagen }