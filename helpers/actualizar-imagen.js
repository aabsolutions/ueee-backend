const Estudiante = require('../models/estudiante');
const Usuario = require('../models/usuario');

const fs = require('fs');

const borrarImgAnterior = ( path ) => {
    if(fs.existsSync(path)){
        fs.unlinkSync(path);
    }
}

const actualizarImagen = async(path, id, fileName)=> {

    let oldPath = '';

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
    }    

}

module.exports = { actualizarImagen }