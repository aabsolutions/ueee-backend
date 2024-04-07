const { response, request } = require('express');
const Curso = require('../models/curso');

const { validarMongoID } = require('../middlewares/validar-mongoid');

const getCursos = async (req = request, res = response) => {

    const from = Number(req.query.from)||0;
    const limit = Number(req.query.limit)||0;
 
    const [cursos, total] = await Promise.all([
        Curso
                .find({},'')
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

const getCursosJornada = async (req = request, res = response) => {

    const from = Number(req.query.from)||0;
    const limit = Number(req.query.limit)||0;
    const jor = Number(req.query.jor)||0;
    const niv = Number(req.query.niv)||0;
    const esp = Number(req.query.esp)||0;


    
    switch (jor) {
        case 1:
            jornada = 'MATUTINA';            
            break;
        case 2:
            jornada = 'VESPERTINA';            
            break;
        case 3:
            jornada = 'NOCTURNA';            
            break;
        default:
            break;
    }
   
    switch (niv) {
        case 1:
            nivel = 'EGB SUPERIOR';            
            break;
        case 2:
            nivel = 'BACHILLERATO GENERAL UNIFICADO';            
            break;
        case 3:
            nivel = 'BACHILLERATO TECNICO';            
            break;
        default:
            break;
    }


    const cursos = [];
    const total = 0;

    if(jor>0){
        const [cursos, total] = await Promise.all([
            Curso
                    .find({$and: [{jornada, nivel}]},'')
                    .skip(from)
                    .limit(limit),
            Curso   .find({jornada}).count()
        ]);
        res.json({
            ok: true,
            cursos,
            total
        });
    }
 
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
        const curso = await Curso.findById(cid); 
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


const guardarCurso = async(req = request, res = response) => {
    
    const uid = req.uid;
    const { grado,
            grado_abrev,
            orden,
            nivel,
            nivel_abrev,
            paralelo,
            jornada,
            especialidad
    } = req.body;

    const datosNuevoCurso = new Curso({
       usuario: uid,
        ...req.body
    });
    
    try {
        const verificaExiste = await Curso.findOne({
            $and: [{grado},
                   {grado_abrev},
                   {nivel},
                   {nivel_abrev},
                   {paralelo},
                   {jornada},
                   {especialidad}]
        });

        if(verificaExiste){
            return res.status(404).json({
                ok: false,
                msg: 'Ya existe un curso con la información ingresada, no es posible guardar'
            });
        }

        const curso = new Curso( datosNuevoCurso );
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

const actualizarCurso = async (req = request, res = response) => {

    const cid = req.params.id;
    const usuario = req.uid;

    const datosCursoActualizar = new Curso({
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

        const { grado,
                grado_abrev,
                orden,
                nivel,
                nivel_abrev,
                paralelo,
                jornada,
                especialidad
        } = req.body;

        const verificaExiste = await Curso.findOne({
            $and: [{grado},
                   {grado_abrev},
                   {nivel},
                   {nivel_abrev},
                   {paralelo},
                   {jornada},
                   {especialidad}]
        });

        if(verificaExiste){
            return res.status(404).json({
                ok: false,
                msg: 'Ya existe un curso con la información ingresada, no es posible actualizar'
            });
        }

        const cursoActualizado = await Curso.findByIdAndUpdate(cid, datosCursoActualizar, {new: true});

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
                msg: 'El curso con el id indicado no existe'
            });
        }

        await Curso.findByIdAndDelete(cid);

        return res.status(200).json({
            ok: true,
            msg: 'El curso fue eliminado'
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
   
}

module.exports = { 
                    getCursos, 
                    getCursoId, 
                    guardarCurso, 
                    actualizarCurso, 
                    borrarCurso,
                    getCursosJornada
                 }