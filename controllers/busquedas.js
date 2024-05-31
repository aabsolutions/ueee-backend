const { response, request } = require('express');

const Estudiante = require('../models/estudiante');
const Curso = require('../models/curso');
const Usuario = require('../models/usuario');

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

    let datosEncontrados = [];

    // [
    //     {
    //       '$lookup': {
    //         'from': 'estudiante_cursos', 
    //         'localField': '_id', 
    //         'foreignField': 'estudiante', 
    //         'as': 'datosMatricula', 
    //         'pipeline': [
    //           {
    //             '$lookup': {
    //               'from': 'cursos', 
    //               'localField': 'curso', 
    //               'foreignField': '_id', 
    //               'as': 'datosCurso'
    //             }
    //           }, {
    //             '$unwind': {
    //               'path': '$datosCurso'
    //             }
    //           }
    //         ]
    //       }
    //     }, {
    //       '$unwind': {
    //         'path': '$datosMatricula'
    //       }
    //     }, {
    //       '$match': {
    //         '$and': [
    //           {
    //             '_id': new ObjectId('6646b1055e2d24fd87d67f3a'), 
    //             'datosMatricula.periodo': '2024-2025'
    //           }
    //         ]
    //       }
    //     }, {
    //       '$project': {
    //         '_id': 1, 
    //         'cedula': 1, 
    //         'apellidos': 1, 
    //         'nombres': 1, 
    //         'sexo': 1, 
    //         'datosMatricula.datosCurso.grado': 1, 
    //         'datosMatricula.datosCurso.nivel': 1, 
    //         'datosMatricula.datosCurso.paralelo': 1, 
    //         'datosMatricula.datosCurso.especialidad': 1, 
    //         'datosMatricula.datosCurso.jornada': 1
    //       }
    //     }
    //   ]

    try {
        switch (tabla) {
            case 'usuarios':
                datosEncontrados = await Usuario.find({ nombre: strBusquedaRegex },'');    
                break;
            case 'estudiantes':
                datosEncontrados = await Estudiante.find({$or:[{ apellidos: strBusquedaRegex },{ nombres: strBusquedaRegex }]},'')
                                                    .skip(0)
                                                    .limit(0)
                                                    .sort({apellidos: 1,nombres: 1})
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