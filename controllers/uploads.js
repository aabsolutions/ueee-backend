const { response, request } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");
const { cloudUploadFile } = require('../helpers/cloudinary');

const { validarMongoID } = require("../middlewares/validar-mongoid");
const path = require('path');
const fs = require('fs');

const Estudiante = require('../models/estudiante');
const Usuario = require('../models/usuario');
const Titulacion = require('../models/titulacion');

const uploadFile = (req = request, res = response) => {

    const type = req.params.type;
    const id   = req.params.id;
    const usuario = req.uid;

    const validPath = ['usuarios','estudiantes','actas','titulos'];

    if(!validPath.includes(type)){
        return res.status(400).json({
            ok: false,
            msg: 'Invalid Path: must be usuarios|estudiantes|titulos|actas'
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

    const validFileExtName = ['png','jpg','jpeg','gif','pdf'];

    if(!validFileExtName.includes(fileExtName)){
        return res.status(400).json({
            ok: false,
            msg: 'Extensión de archivo inválida, permitidos: png|jpg|jpeg|gif|pdf'
        })
    }

    const fileName = `${uuidv4()}.${fileExtName}`;
    const storePath = `./uploads/${type}/${fileName}`;

    actualizarImagen(type, id, fileName, usuario).then(
        async result => {
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
                const uploadResult = await uploadToCloudinary(id, type, fileName);

                if(!uploadResult){
                    console.log('No se pudo subir el archivo');
                    res.json({
                        ok: false
                    });
                }else{
                    res.json({
                        ok: true,
                        msg: 'Archivo subido corréctamente',
                        fileName,
                        url: uploadResult
                    });
                }

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

const uploadToCloudinary = async (id, type, filename) => {

    const urlFileToUpload = path.join(__dirname, `../uploads/${type}/${filename}`);

    try {

        //ejecución de upload del archivo en la nube
        const uploadResult = await cloudUploadFile(urlFileToUpload, type);

        switch (type) {
            case 'estudiantes':
                
                await Estudiante.findByIdAndUpdate(id,{
                    img_public_id: uploadResult.public_id,
                    img_secure_url: uploadResult.secure_url
                });
    
                return uploadResult.secure_url;
    
            case 'usuarios':
    
                await Usuario.findByIdAndUpdate(id,{
                    img_public_id: uploadResult.public_id,
                    img_secure_url: uploadResult.secure_url
                });
    
                return uploadResult.secure_url;
    
            case 'titulos':
               
                await Titulacion.findByIdAndUpdate(id,{
                    titulo_public_id: uploadResult.public_id,
                    titulo_secure_url: uploadResult.secure_url
                });
                return uploadResult.secure_url;

            case 'actas':
               
                await Titulacion.findByIdAndUpdate(id,{
                    acta_public_id: uploadResult.public_id,
                    acta_secure_url: uploadResult.secure_url
                });
                return uploadResult.secure_url;
    
        }
        
    } catch (error) {
        console.error('Error al subir a la nube', error);
        return false;
    }    


}

module.exports = {
    uploadFile, getImage
}
