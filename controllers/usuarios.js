const bcrypt = require('bcryptjs');
const { response, request } = require('express');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt')
const { validarMongoID } = require('../middlewares/validar-mongoid');

const getUsuarios = async (req, res = response) => {

    //const from = Number(req.query.from)||0;
 
    const [usuarios, total] = await Promise.all([
        Usuario
                .find({},'email nombre role img')
                .skip(0)
                .limit(5),
        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios,
        total
    });

}

const guardarUsuario = async(req, res = response) => {
    
    const { email, password } = req.body;

    try {

        const verificaExiste = await Usuario.findOne({email});

        if(verificaExiste){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ingresado ya está registrado'
            });
        }

        const usuario = new Usuario( req.body );

        //encriptar el password enviado
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const actualizarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    if(!validarMongoID(uid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id enviado no es válido'
        });
    }

    try {

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'El usuario con el id indicado no existe'
            });
        }

        //extraigo los campos que no voy a modificar y el email para comprobar 
        //si el correo que se envió ya está registrado

        const { password, email, ...campos} = req.body;

        if(usuarioDB.email !== email){
            
            const existeEmail = await Usuario.findOne({email});
            
            if(existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con el nuevo email a actualizar'
                })
            }
        }

        //regreso el campo email a conjunto de datos
        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const borrarUsuario = async (req, res = response) => {
    
    const uid = req.params.id;

    if(!validarMongoID(uid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id enviado no es válido'
        });
    }

    try {

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'El usuario con el id indicado no existe'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        return res.status(200).json({
            ok: true,
            msg: 'El usuario de código ' + uid + ' fue eliminado'
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
   
}

module.exports = { getUsuarios, guardarUsuario, actualizarUsuario, borrarUsuario }