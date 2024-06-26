const { response, request } = require('express');

const Estudiante = require('../models/estudiante');
const Curso = require('../models/curso');
const Usuario = require('../models/usuario');
const { result } = require('lodash');
const { $and } = require('sift');

const busquedaALL = async(req = request, res = response) => {

    const strBusqueda = req.params.str;
    const strBusquedaRegex = RegExp(strBusqueda,'i');

    try {
        
        const [coincidenciasUsuario, coincidenciasEstudiante] = await Promise.all([
            Usuario.find({ nombre: strBusquedaRegex },'uid nombre img'),
            Estudiante.find({$or:[{ apellidos: strBusquedaRegex },{ nombres: strBusquedaRegex }]},'uid apellidos nombres img')
        ])
        
        res.json({
            ok: true,
            coincidenciasUsuario,
            coincidenciasEstudiante
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error Busqueda Total: Hable con el administrador'
        })
    }
}

const busquedaColeccion = async(req = request, res = response) => {

    const tabla = req.params.tbl;
    const strBusqueda = req.params.str;
    const strBusquedaRegex = new RegExp(strBusqueda,'i');
    const periodo = process.env.PERIODO_ACTIVO;

    let datosEncontrados = [];

    try {
        switch (tabla) {
            case 'usuarios':
                datosEncontrados = await Usuario.find({ nombre: strBusquedaRegex },'');    
                break;
            case 'estudiantes_por_asignar':
                  datosEncontrados = await Estudiante.aggregate([
                    {
                      '$lookup': {
                        'from': 'estudiante_cursos', 
                        'localField': '_id', 
                        'foreignField': 'estudiante', 
                        'as': 'result'
                      }
                    }, {
                      '$match': {
                        '$and':[
                          {
                            '$or': [
                              { 'apellidos': strBusquedaRegex },{ 'nombres': strBusquedaRegex }
                             ],
                            'result': []
                          }
                        ]
                      }
                    }
                    , {
                      '$unset': [
                        'f_nac', 'sexo', 'createdAt', 'updatedAt', 'usuario', 'result'
                      ]
                    },
                      {
                        '$sort':{
                            'apellidos': 1, 
                            'nombres': 1 
                        }
                    }
                  ]);
                  break;
              
            case 'estudiantes_matriculados':
                // datosEncontrados = await Estudiante.find({$or:[{ apellidos: strBusquedaRegex },{ nombres: strBusquedaRegex }]},'')
                //                                     .skip(0)
                //                                     .limit(0)
                //                                     .sort({apellidos: 1,nombres: 1})
                datosEncontrados = await Estudiante.aggregate([
                             {
                              '$lookup': {
                                'from': 'estudiante_cursos', 
                                'localField': '_id', 
                                'foreignField': 'estudiante', 
                                'as': 'datosMatricula', 
                                'pipeline': [
                                  {
                                    '$lookup': {
                                      'from': 'cursos', 
                                      'localField': 'curso', 
                                      'foreignField': '_id', 
                                      'as': 'datosCurso'
                                    }
                                  }, {
                                    '$unwind': {
                                      'path': '$datosCurso'
                                    }
                                  }
                                ]
                              }
                            }, {
                              '$unwind': {
                                'path': '$datosMatricula',
                                //para poder conservar los estudiantes que no tienen matricula asignada en la proyección de la consulta 
                                'preserveNullAndEmptyArrays': true
                              }
                            }, {
                              '$match': {

                                    '$or': [
                                            { 'apellidos': strBusquedaRegex },{ 'nombres': strBusquedaRegex }
                                        ],
                                    'datosMatricula.periodo': periodo
                                  
                                
                              }
                            }, {
                              '$project': {
                                '_id': 1, 
                                'cedula': 1, 
                                'apellidos': 1, 
                                'nombres': 1, 
                                'sexo': 1, 
                                'datosMatricula.datosCurso.grado': 1, 
                                'datosMatricula.datosCurso.nivel': 1, 
                                'datosMatricula.datosCurso.paralelo': 1, 
                                'datosMatricula.datosCurso.especialidad': 1, 
                                'datosMatricula.datosCurso.jornada': 1
                              }
                            },
                            {
                                '$sort':{
                                    'apellidos': 1, 
                                    'nombres': 1 
                                }
                            }
                ]);
                
                break;
            case 'cursos':
                    datosEncontrados = await Curso.find({$or:[{ grado: strBusquedaRegex },{ nivel: strBusquedaRegex },{ jornada: strBusquedaRegex },{ especialidad: strBusquedaRegex }]},'')
                    break;
            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'Invalid Collection',
                    field: tabla
                });
                break;
        }
        res.json({
            ok: true,
            collection: tabla,
            data: datosEncontrados
        });
                
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}


module.exports = {
    busquedaALL, busquedaColeccion
}