const { response } = require("express");
const bcrypt = require('bcryptjs');

const Usuario = require("../models/usuario");
const { generarJWT } = require('../helpers/jwt')
const { getMenuFrontEnd } = require("../helpers/menu-frontend");

const login = async (req, res = response)=>{

    const { email, password } = req.body;

    try {

        //verificar email
        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'El email utilizado no existe'
            })
        }

        //verificar clave

        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(404).json({
                ok: false,
                msg: 'La constraseña no es correcta'
            })
        }

        //Generar JWT

        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd(usuarioDB.role)
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }

}

const renovarJWT = async(req, res = response) => {

    const uid = req.uid;

    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFrontEnd(usuario.role)
    });

}

module.exports = { login, renovarJWT };