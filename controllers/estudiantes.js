const { request } = require('express');
const { mongoose } = require('mongoose');

const { validarMongoID } = require('../middlewares/validar-mongoid');

const Estudiante = require('../models/estudiante');
const Estudiante_curso = require('../models/estudiante_curso');
const Estudiante_imc = require('../models/estudiante_imc');
const Curso = require('../models/curso');

const getEstudiantes = async (req, res = response) => {

    const from = Number(req.query.from)||0;
    const limit = Number(req.query.limit)||0;

    const [estudiantes, total] = await Promise.all([
        Estudiante
                .find({},'')
                .skip(from)
                .limit(limit)
                .sort({apellidos: 1,nombres: 1}),
        Estudiante.countDocuments()
    ]);

    res.json({
        ok: true,
        estudiantes,
        total
    });
}

const getListadoEstudiantesPorCurso = async (req, res = response) => {

    const periodo = process.env.PERIODO_ACTIVO;
    const curso = req.params.cid;

    const [enrolamientos, total] = await Promise.all([
        Estudiante_curso.aggregate([
            [
                {
                  '$lookup': {
                    'from': 'estudiantes', 
                    'localField': 'estudiante', 
                    'foreignField': '_id', 
                    'as': 'estudiante'
                  }
                }, {
                  '$unwind': {
                    'path': '$estudiante'
                  }
                }, {
                  '$match': {
                    '$and': [{
                                'periodo': periodo,
                                'curso': new mongoose.Types.ObjectId(curso)}]
                  }
                }, {
                  '$sort': {
                    'estudiante.apellidos': 1
                  }
                },
                {
                    '$project': {
                      'estudiante._id': 1,
                      'estudiante.cedula': 1,
                      'estudiante.apellidos': 1,
                      'estudiante.nombres': 1,
                      'estudiante.f_nac': 1,
                      'estudiante.sexo': 1,
                    }
                  }
              ]
        ])
        ,
        Estudiante_curso.find({curso: new mongoose.Types.ObjectId(curso)}).count()
    ]);

    res.json({
        ok: true,
        enrolamientos,
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

const getEstudianteMatricula = async(req, res  = response) => {
    
    const eid = req.params.eid;
    const periodo = process.env.PERIODO_ACTIVO;

    try {
        const matricula = await Estudiante_curso.aggregate(
            
            [
                {
                  $lookup: {
                    from: 'cursos',
                    localField: 'curso',
                    foreignField: '_id',
                    as: 'datosCurso'
                  }
                },
                { $unwind: { path: '$datosCurso' } },
                {
                  $match: {
                    $and: [
                      {
                        periodo: periodo,
                        estudiante: new mongoose.Types.ObjectId(eid)
                      }
                    ]
                  }
                },
                {
                  $project: {
                    'datosCurso._id': 1,
                    'datosCurso.grado': 1,
                    'datosCurso.nivel': 1,
                    'datosCurso.paralelo': 1,
                    'datosCurso.jornada': 1,
                    'datosCurso.especialidad': 1
                  }
                }
              ]
        );
        res.json({
            ok: true,
            matricula
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

const registroEstudianteImc = async (req, res = response) => {

    const estudiante = req.params.id;
    const usuario = req.uid;
    const { periodo, peso, talla, fecha_toma } = req.body;

    //validaciones de estudiante

    if(!validarMongoID(estudiante)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id del estudiante enviado no es válido'
        });
    }

    const estudianteDB = await Estudiante.findById(estudiante);

    if(!estudianteDB){
        return res.status(404).json({
            ok: false,
            msg: 'El estudiante con el id indicado no existe'
        });
    }

    try {

        const datosRegistro = {
            periodo,
            estudiante,
            peso,
            talla,
            fecha_toma,
            usuario
        }

        const verificaExisteRegistroIgual = await Estudiante_imc.findOne({
            $and: [{periodo},
                   {estudiante}]
        });

        if(verificaExisteRegistroIgual){
            return res.status(404).json({
                ok: false,
                msg: 'Ya existe una toma registrada para ese periodo'
            });
        }

        const registroEstudianteImc = new Estudiante_imc(datosRegistro);
        await registroEstudianteImc.save();


        res.json({
            ok: true,
            message: 'Registro realizado corréctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const actualizarRegistroEstudianteImc = async (req, res = response) => {

    const rid = req.params.id;
    const usuario = req.uid;
    const { peso, talla } = req.body;

    //validaciones de estudiante

    if(!validarMongoID(rid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id del registro IMC enviado no es válido'
        });
    }

    const registroImcDB = await Estudiante_imc.findById(rid);

    if(!registroImcDB){
        return res.status(404).json({
            ok: false,
            msg: 'El registro con el id indicado no existe'
        });
    }

    try {

        const datosActualizar = {
            peso,
            talla,
            usuario
        }
        await Estudiante_imc.findByIdAndUpdate(rid, datosActualizar, {new: true});

        res.json({
            ok: true,
            message: 'Registro actualizado corréctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const asignacionEstudianteCurso = async (req, res = response) => {

    const estudiante = req.params.id;
    const usuario = req.uid;
    const { curso, matricula } = req.body;

    

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

    //validaciones de estudiante

    if(!validarMongoID(estudiante)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id del estudiante enviado no es válido'
        });
    }

    const estudianteDB = await Estudiante.findById(estudiante);

    if(!estudianteDB){
        return res.status(404).json({
            ok: false,
            msg: 'El estudiante con el id indicado no existe'
        });
    }

    try {

        const periodo = process.env.PERIODO_ACTIVO;

        const datosAsignacion = {
            periodo,
            estudiante,
            curso,
            usuario
        }

        const verificaExisteAsignacionIgual = await Estudiante_curso.findOne({
            $and: [{periodo},
                   {estudiante},
                   {curso}]
        });

        if(verificaExisteAsignacionIgual){
            return res.status(404).json({
                ok: false,
                msg: 'El estudiante ya se encuentra asignado al curso indicado'
            });
        }

        if(matricula!=0){
            actualizaAsignacionEstudianteCurso = await Estudiante_curso.findByIdAndUpdate(new mongoose.Types.ObjectId(matricula), datosAsignacion, {new: true});
        }else{
            const asignacionEstudianteCurso = new Estudiante_curso(datosAsignacion);
            await asignacionEstudianteCurso.save();
        }

        res.json({
            ok: true,
            message: 'Asignación realizada corréctamente'
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
    actualizarEstudiante,
    actualizarRegistroEstudianteImc, 
    asignacionEstudianteCurso,
    estadoEstudiante,
    getEstudiantes,
    getEstudianteId,
    getEstudianteMatricula, 
    getListadoEstudiantesPorCurso,
    guardarEstudiante, 
    registroEstudianteImc
};