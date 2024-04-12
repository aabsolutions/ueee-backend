const { request, response } = require('express');
const { mongoose } = require('mongoose');
const { populate } = require('dotenv');

const Titulacion = require('../models/titulacion');

const { validarMongoID } = require('../middlewares/validar-mongoid');

const getListadoTitulacionEstudiantes = async (req = request, res = response) => {

    const periodo = req.query.periodo;
    const curso = req.params.cid;

    const [titulados, total] = await Promise.all([
        Titulacion.aggregate(
            [ 
                {
                  '$lookup': {
                    'from': 'estudiante_cursos', 
                    'localField': 'enrolamiento', 
                    'foreignField': '_id', 
                    'as': 'dataEstudiante',
                    'pipeline':[
                        {
                        '$lookup':{
                                'from': 'estudiantes', 
                                'localField': 'estudiante', 
                                'foreignField': '_id', 
                                'as': 'estudiante',
                            }
                        },
                        {
                            '$unwind': {
                                'path': '$estudiante'
                              }
                        }
                    ]
                  }
                }, {
                  '$unwind': {
                    'path': '$dataEstudiante'
                  }
                }, {
                  '$match': {
                    '$and': [{
                            'dataEstudiante.periodo': periodo,
                            'dataEstudiante.curso': new mongoose.Types.ObjectId(curso)}]
                  }
                }, {
                    '$project': {
                        '_id': 1,
                        'nota_grado': 1,
                        'dataEstudiante.estudiante.cedula': 1,
                        'dataEstudiante.estudiante.apellidos': 1,
                        'dataEstudiante.estudiante.nombres': 1,
                        'acta_public_id': 1,
                        'acta_secure_url': 1,
                        'titulo_public_id': 1,
                        'titulo_secure_url': 1,
                    }
                }
              ]
        ),
        Titulacion.countDocuments()
    ]);
    res.json({
        ok: true,
        titulados,
        total
    });
}

// const getEstudianteId = async(req, res  = response) => {
    
//     const eid = req.params.id;

//     try {
//         const estudiante = await Estudiante.findById(eid)
//                                .populate('usuario','nombre img');

//         res.json({
//             ok: true,
//             estudiante
//         });
//     } catch (error) {
//         console.log(error);
//         res.json({
//             ok: true,
//             msg: 'Estudiante no encontrado'
//         });
//     }
// }

const guardarTitulacion = async(req = request, res = response) => {
  
    const uid = req.uid;
    const datosTitulacion = new Titulacion({
        usuario: uid,
        enrolamiento: req.params.enrid,
        ...req.body
    }) 
   
    try {

        const titulacion = new Titulacion( datosTitulacion );
        await titulacion.save();

        res.json({
            ok: true,
            titulacion
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al guardar registro...'
        });
    }
}

// const actualizarEstudiante = async (req, res = response) => {

//     const eid = req.params.id;
//     const usuario = req.uid;
    
//     if(!validarMongoID(eid)){
//         return res.status(500).json({
//             ok: false,
//             msg: 'El Id enviado no es válido'
//         });
//     }

//     try {

//         const estudianteDB = await Estudiante.findById(eid);

//         if(!estudianteDB){
//             return res.status(404).json({
//                 ok: false,
//                 msg: 'El usuario con el Id indicado no existe'
//             });
//         }

//         const { cedula, ...campos } = req.body;

//         if(estudianteDB.cedula !== cedula){
            
//             const existeCedula = await Estudiante.findOne({cedula});
            
//             if(existeCedula){
//                 return res.status(400).json({
//                     ok: false,
//                     msg: 'Ya existe un usuario con la cedula a actualizar'
//                 })
//             }
//         }

//         const datosEstudianteActualizar = { cedula, ...campos, usuario };
//         const estudianteActualizado = await Estudiante.findByIdAndUpdate(eid, datosEstudianteActualizar, {new: true});


//         res.json({
//             ok: true,
//             estudiante: estudianteActualizado
//         })
        
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             ok: false,
//             msg: 'Error inesperado'
//         })
//     }

// }

// const asignacionEstudianteCurso = async (req, res = response) => {

//     const estudiante = req.params.id;
//     const usuario = req.uid;
//     const { curso } = req.body;

//     const periodo = process.env.PERIODO;

//     //validaciones de curso

//     if(!validarMongoID(curso)){
//         return res.status(500).json({
//             ok: false,
//             msg: 'El Id del curso enviado no es válido'
//         });
//     }

//     const cursoDB = await Curso.findById(curso);

//     if(!cursoDB){
//         return res.status(404).json({
//             ok: false,
//             msg: 'El curso con el id indicado no existe'
//         });
//     }

//     //validaciones de estudiante

//     if(!validarMongoID(estudiante)){
//         return res.status(500).json({
//             ok: false,
//             msg: 'El Id del estudiante enviado no es válido'
//         });
//     }

//     const estudianteDB = await Estudiante.findById(estudiante);

//     if(!estudianteDB){
//         return res.status(404).json({
//             ok: false,
//             msg: 'El estudiante con el id indicado no existe'
//         });
//     }

//     try {

//         const datosAsignacion = {
//             periodo,
//             estudiante,
//             curso,
//             usuario
//         }

//         const verificaExisteAsignacion = await Estudiante_curso.findOne({
//             $and: [{periodo},
//                    {estudiante},
//                    {curso}]
//         });

//         if(verificaExisteAsignacion){
//             return res.status(404).json({
//                 ok: false,
//                 msg: 'Ya existe una asignación realizada para el estudiante indicado'
//             });
//         }

//         const asignacionEstudianteCurso = new Estudiante_curso(datosAsignacion);
//         await asignacionEstudianteCurso.save();

//         res.json({
//             ok: true,
//             message: 'Asignación realizada corréctamente'
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             ok: false,
//             msg: 'Error inesperado'
//         })
//     }
// }

// const estadoEstudiante = async (req, res = response) => {

//     const eid = req.params.id;
//     const uid = req.uid;
//     const { estado } = req.body; 

//     if(!validarMongoID(eid)){
//         return res.status(500).json({
//             ok: false,
//             msg: 'El Id enviado no es válido'
//         });
//     }

//     try {

//         const estudianteDB = await Estudiante.findById(eid);

//         if(!estudianteDB){
//             return res.status(404).json({
//                 ok: false,
//                 msg: 'El usuario con el id indicado no existe'
//             });
//         }

//         const estudianteActualizado = await Estudiante.findByIdAndUpdate(eid, {estado, usuario: uid}, {new: true});

//         res.json({
//             ok: true,
//             estudiante: estudianteActualizado
//         })
        
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             ok: false,
//             msg: 'Error inesperado'
//         })
//     }

// }

module.exports = { 
    guardarTitulacion,
    getListadoTitulacionEstudiantes
};