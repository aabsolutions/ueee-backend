const { request } = require('express');
const { validarMongoID } = require('../middlewares/validar-mongoid');
const Estudiante = require('../models/estudiante');
const Curso = require('../models/curso');
const mongoose = require('mongoose');

// const getEstudiantes = async (req, res = response) => {

//     const jornada = Number(req.query.from)||0;
//     const limit = Number(req.query.limit)||0;

//     const estudiantes = await Estudiante.aggregate(
//         [
//             {
//               $lookup:
//                 {
//                   from: "cursos",
//                   localField: "curso",
//                   foreignField: "_id",
//                   pipeline: [
//                     {
//                       "$match": {
//                         jornada: "VESPERTINA"
//                       }
//                     }
//                   ],
//                   as: "estudianteCurso",
//                 },
//             },
//             {
//               $unwind:
//                 {
//                   path: "$estudianteCurso",
//                 },
//             },
//             {
//               $match:
//                 {
//                   curso: new mongoose.Types.ObjectId('65242786c9ec609664253554')
//                 },
//             },
//           ]
//     )

//     res.json({
//         estudiantes
//     });

// }

const getEstudiantes = async (req, res = response) => {

    const from = Number(req.query.from)||0;
    const limit = Number(req.query.limit)||0;
    const curso = Curso;

    const [estudiantes, total] = await Promise.all([
        Estudiante
                .find({},'cedula apellidos nombres f_nac sexo img estado curso usuario')
                .skip(from)
                .limit(limit)
                .sort({apellidos: 1,nombres: 1})
                //.populate('curso','grado nivel paralelo jornada especialidad'),
                .populate({
                    path: 'curso',
                    populate:[
                        {
                            path: 'grado', select: 'nombre nivelCorto'
                        },
                        {
                            path: 'especialidad', select: 'nombreCorto'
                        }
                    ]
                }),

                // .populate({
                //     path: "blogs", // populate blogs
                //     populate: {
                //        path: "comments" // in blogs, populate comments
                //     }
                //  })

        Estudiante.countDocuments()
    ]);

    res.json({
        ok: true,
        estudiantes,
        total
    });

}

const getEstudianteId = async(req, res  = response) => {
    
    const eid = req.params.id;

    try {
        const estudiante = await Estudiante.findById(eid)
                               .populate('usuario','nombre img');

        res.json({
            ok: true,
            estudiante
        });
    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Estudiante no encontrado'
        });
    }
}


const guardarEstudiante = async(req = request, res = response) => {
  
    const uid = req.uid;
    const datosNuevoEstudiante = new Estudiante({
        usuario: uid,
        ...req.body
    })

    const { cedula } = req.body;
    
    try {

        const verificaExiste = await Estudiante.findOne({cedula});

        if(verificaExiste){
            return res.status(400).json({
                ok: false,
                msg: 'La cédula ingresada ya está registrada'
            });
        }

        const estudiante = new Estudiante( datosNuevoEstudiante );

        await estudiante.save();

        res.json({
            ok: true,
            estudiante
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al guardar registro...'
        });
    }
}

const actualizarEstudiante = async (req, res = response) => {

    const eid = req.params.id;
    const usuario = req.uid;
    
    if(!validarMongoID(eid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id enviado no es válido'
        });
    }

    try {

        const estudianteDB = await Estudiante.findById(eid);

        if(!estudianteDB){
            return res.status(404).json({
                ok: false,
                msg: 'El usuario con el Id indicado no existe'
            });
        }

        const { cedula, ...campos } = req.body;

        if(estudianteDB.cedula !== cedula){
            
            const existeCedula = await Estudiante.findOne({cedula});
            
            if(existeCedula){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con la cedula a actualizar'
                })
            }
        }

        const datosEstudianteActualizar = { cedula, ...campos, usuario };
        const estudianteActualizado = await Estudiante.findByIdAndUpdate(eid, datosEstudianteActualizar, {new: true});


        res.json({
            ok: true,
            estudiante: estudianteActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const asignacionEstudianteCurso = async (req, res = response) => {

    const eid = req.params.id;
    const usuario = req.uid;
    const { curso } = req.body;

    //validaciones de curso

    if(!validarMongoID(curso)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id del curso enviado no es válido'
        });
    }

    const cursoDB = await Curso.findById(curso);

    if(!cursoDB){
        return res.status(404).json({
            ok: false,
            msg: 'El curso con el id indicado no existe'
        });
    }

    if(!validarMongoID(eid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id del estudiante enviado no es válido'
        });
    }

    try {

        const estudianteDB = await Estudiante.findById(eid);

        if(!estudianteDB){
            return res.status(404).json({
                ok: false,
                msg: 'El estudiante con el id indicado no existe'
            });
        }

        const estudianteActualizado = await Estudiante.findByIdAndUpdate(eid, {curso, usuario}, {new: true});

        res.json({
            ok: true,
            estudiante: estudianteActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const estadoEstudiante = async (req, res = response) => {

    const eid = req.params.id;
    const uid = req.uid;
    const { estado } = req.body; 

    if(!validarMongoID(eid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id enviado no es válido'
        });
    }

    try {

        const estudianteDB = await Estudiante.findById(eid);

        if(!estudianteDB){
            return res.status(404).json({
                ok: false,
                msg: 'El usuario con el id indicado no existe'
            });
        }

        const estudianteActualizado = await Estudiante.findByIdAndUpdate(eid, {estado, usuario: uid}, {new: true});

        res.json({
            ok: true,
            estudiante: estudianteActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

module.exports = { 
    getEstudiantes,
    getEstudianteId, 
    guardarEstudiante, 
    actualizarEstudiante, 
    estadoEstudiante,
    asignacionEstudianteCurso
};