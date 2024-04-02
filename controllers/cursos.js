const bcrypt = require('bcryptjs');
const { response, request } = require('express');
const mongoose = require('mongoose');

const Curso = require('../models/curso');
const { validarMongoID } = require('../middlewares/validar-mongoid');

const getCursos = async (req, res = response) => {

    const from = Number(req.query.from)||0;
    const limit = Number(req.query.limit)||0;
 
    const [cursos, total] = await Promise.all([
        Curso
                .find({},'grado nivel paralelo jornada especialidad usuario')
                .populate('grado', 'nombre')
                .populate('especialidad','nombreCorto')
                .sort({grado:1, paralelo: 1, especialidad: 1})
                .skip(from)
                .limit(limit),
        Curso.countDocuments()
    ]);

    res.json({
        ok: true,
        cursos,
        total
    });

}

const getCursoId = async(req, res  = response) => {
    
    const cid = req.params.id;

    if(!validarMongoID(cid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id enviado no es válido'
        });
    }

    try {
        const curso = await Curso.findById(cid)
                                 .populate('grado', 'nombre')
                                 .populate('especialidad','nombreCorto');
        if(curso){
            res.json({
                ok: true,
                curso
            });
        }else{
            res.status(500).json({
                ok: false,
                msg: 'Curso no encontrado'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}


const guardarCurso = async(req, res = response) => {
    
    const uid = req.uid;
    const { grado, paralelo, jornada, especialidad } = req.body;

    if(!validarMongoID(grado)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id enviado no es válido'
        });
    }
   
    try {

        const verificaExiste = await Curso.findOne({
            $and: [{grado},{paralelo},{jornada},{especialidad}]
        });

        if(verificaExiste){
            return res.status(404).json({
                ok: false,
                msg: 'Ya existe un curso con la información ingresada'
            });
        }

        const nuevoCurso = req.body;
        const curso = new Curso( nuevoCurso );
        await curso.save();

        res.json({
            ok: true,
            curso,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const actualizarCurso = async (req, res = response) => {

    const cid = req.params.id;
    const usuario = req.uid;

    const datosNuevoCurso = new Curso({
        usuario,
        _id: cid,
        ...req.body
    })

    if(!validarMongoID(cid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id enviado no es válido'
        });
    }

    try {

        const cursoDB = await Curso.findById(cid);

        if(!cursoDB){
            return res.status(404).json({
                ok: false,
                msg: 'El curso con el id indicado no existe'
            });
        }

        const { grado, paralelo, jornada, especialidad } = req.body;

        const verificaExiste = await Curso.findOne({
            $and: [{grado},{paralelo},{jornada},{especialidad}]
        });

        if(verificaExiste){
            return res.status(404).json({
                ok: false,
                msg: 'Ya existe un curso con la información ingresada'
            });
        }

        const cursoActualizado = await Curso.findByIdAndUpdate(cid, datosNuevoCurso, {new: true});

        res.json({
            ok: true,
            curso: cursoActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const borrarCurso = async (req, res = response) => {
    
    const cid = req.params.id;

    if(!validarMongoID(cid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id enviado no es válido'
        });
    }

    try {

        const cursoDB = await Curso.findById(cid);

        if(!cursoDB){
            return res.status(404).json({
                ok: false,
                msg: 'El usuario con el id indicado no existe'
            });
        }

        await Curso.findByIdAndDelete(cid);

        return res.status(200).json({
            ok: true,
            msg: 'El curso de código ' + cid + ' fue eliminado'
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
   
}

module.exports = { getCursos, getCursoId, guardarCurso, actualizarCurso, borrarCurso }