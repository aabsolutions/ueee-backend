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

    try {
        switch (tabla) {
            case 'usuarios':
                datosEncontrados = await Usuario.find({ nombre: strBusquedaRegex },'');    
                break;
            case 'estudiantes':
                datosEncontrados = await Estudiante.find({$or:[{ apellidos: strBusquedaRegex },{ nombres: strBusquedaRegex }]},'')
                                                    .skip(0)
                                                    .limit(5)
                                                    .sort({apellidos: 1,nombres: 1})
                                                    .populate('curso','grado nivel paralelo jornada especialidad')
                break;
            case 'cursos':
                    datosEncontrados = await Curso.find({$or:[{ grado: strBusquedaRegex },{ nivel: strBusquedaRegex },{ jornada: strBusquedaRegex },{ especialidad: strBusquedaRegex }]},'')
                                                       .sort({grado:1, paralelo: 1})
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