const { response, request } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");
const { validarMongoID } = require("../middlewares/validar-mongoid");
const path = require('path');
const fs = require('fs');

const uploadFile = (req = request, res = response) => {

    const type = req.params.type;
    const id   = req.params.id;
    const validPath = ['usuarios','estudiantes'];

    if(!validPath.includes(type)){
        return res.status(400).json({
            ok: false,
            msg: 'Invalid Path: must be usuarios|estudiantes'
        })
    }

    //validar si es id de mongo valido
    if (!validarMongoID(id)) {
        return res.status(400).json({
            ok: false,
            msg: 'El Id enviado no es válido'
        })
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha seleccionado archivo para cargar'
        });
      }

    const file        = req.files.image;
    const splitName   = file.name.split('.');
    const fileExtName = splitName[splitName.length - 1];

    const validFileExtName = ['png','jpg','jpeg','gif'];

    if(!validFileExtName.includes(fileExtName)){
        return res.status(400).json({
            ok: false,
            msg: 'Extensión de archivo inválida, permitidos: png|jpg|jpeg|gif'
        })
    }

    const fileName = `${uuidv4()}.${fileExtName}`;

    const storePath = `./uploads/${type}/${fileName}`;


    actualizarImagen(type, id, fileName).then(
        result => {
            if(result){
                file.mv(storePath, (err) =>{
                    if(err){
                        console.log(err)
                        return res.status(500).json({
                            ok: false,
                            msg: 'Error al mover la imagen'
                        });
                    }     
                });
                res.json({
                    ok: true,
                    msg: 'Archivo subido corréctamente',
                    fileName
                });
            }else{
                return res.status(500).json({
                    ok: false,
                    msg: 'Error: ID no corresponde a ningún registro en la base'
                });
            }        
        });

}

const getImage = ( req, res ) =>{
        
    const type = req.params.type;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${type}/${foto}`);

    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathNoImg = path.join(__dirname, `../uploads/no-image.jpg`);
        res.sendFile(pathNoImg);
    }

}

module.exports = {
    uploadFile, getImage
}
