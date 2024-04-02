const { request } = require('express');
const { validarMongoID } = require('../middlewares/validar-mongoid');

const Grado = require('../models/grado');
const Especialidad = require('../models/especialidad');


const getGrados = async (req, res = response) => {

    const [grados, total] = await Promise.all([
        Grado
                .find({},'nombre nivelCorto nivelLargo secuencia usuario estado')
                .sort({secuencia: 1}),
        Grado.countDocuments()
    ]);

    res.json({
        ok: true,
        grados,
        total
    });

}

const getGradoId = async(req, res  = response) => {
    
    const gid = req.params.id;

    if(!validarMongoID(gid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id del grado enviado no es válido'
        });
    }

    try {
        const grado = await Grado.findById(gid)
                               .populate('usuario','nombre img');

        res.json({
            ok: true,
            grado
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: true,
            msg: 'Grado no encontrado'
        });
    }
}

const guardarGrado = async(req = request, res = response) => {
  
    const uid = req.uid;
    const { nombre, nivelCorto, nivelLargo } = req.body;
    
    try {

        const verificaExiste = await Grado.findOne(
            {
                $and: [{nombre},{nivelCorto},{nivelLargo}]
            }
        );

        if(verificaExiste){
            return res.status(400).json({
                ok: false,
                msg: 'El curso ingresado ya está registrado'
            });
        }

        const datosNuevoGrado = new Grado({
            usuario: uid,
            ...req.body
        })
        
        const grado = new Grado( datosNuevoGrado );

        await grado.save();

        res.json({
            ok: true,
            grado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al guardar registro...'
        });
    }
}

const actualizarGrado = async (req, res = response) => {

    const gid = req.params.id;
    const usuario = req.uid;
    
    if(!validarMongoID(gid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id del curso enviado no es válido'
        });
    }

    try {

        const gradoDB = await Grado.findById(gid);

        if(!gradoDB){
            return res.status(404).json({
                ok: false,
                msg: 'El curso con el Id indicado no existe'
            });
        }

        const { nombre, ...campos } = req.body;

        if(gradoDB.nombre !== nombre){
            
            const verificaExiste = await Grado.findOne({nombre});
            
            if(verificaExiste){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un grado con el nombre a actualizar'
                })
            }
        }

        const datosGradoActualizar = { nombre, ...campos, usuario };
        const gradoActualizado = await Grado.findByIdAndUpdate(gid, datosGradoActualizar, {new: true});


        res.json({
            ok: true,
            grado: gradoActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const getEspecialidades = async (req, res = response) => {

    const [especialidades, total] = await Promise.all([
        Especialidad
                .find({},'nombreCorto nombreLargo categoria usuario estado')
                .sort({nombreCorto: 1}),
                Especialidad.countDocuments()
    ]);

    res.json({
        ok: true,
        especialidades,
        total
    });

}

const getEspecialidadId = async(req, res  = response) => {
    
    const esid = req.params.id;

    if(!validarMongoID(esid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id de la especialidad enviado no es válido'
        });
    }

    try {
        const especialidad = await Especialidad.findById(esid)
                               .populate('usuario','nombre img');
        res.json({
            ok: true,
            especialidad
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: true,
            msg: 'Especialidad no encontrada'
        });
    }
}

const guardarEspecialidad = async(req = request, res = response) => {
  
    const uid = req.uid;
    const datosNuevaEspecialidad = new Especialidad({
        usuario: uid,
        ...req.body
    })

    const { nombreCorto } = req.body;
    
    try {

        const verificaExiste = await Especialidad.findOne({nombreCorto});

        if(verificaExiste){
            return res.status(400).json({
                ok: false,
                msg: 'La especialidad ingresada ya está registrada'
            });
        }

        const especialidad = new Especialidad( datosNuevaEspecialidad );

        await especialidad.save();

        res.json({
            ok: true,
            especialidad
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al guardar registro...'
        });
    }
}

const actualizarEspecialidad = async (req, res = response) => {

    const esid = req.params.id;
    const usuario = req.uid;
    
    if(!validarMongoID(esid)){
        return res.status(500).json({
            ok: false,
            msg: 'El Id del curso enviado no es válido'
        });
    }

    try {

        const especialidadDB = await Especialidad.findById(esid);

        if(!especialidadDB){
            return res.status(404).json({
                ok: false,
                msg: 'La especialidad con el Id indicado no existe'
            });
        }

        const { nombreCorto, ...campos } = req.body;

        if(especialidadDB.nombreCorto !== nombreCorto){
            
            const verificaExiste = await Especialidad.findOne({nombreCorto});
            
            if(verificaExiste){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe una especialidad con el nombre a actualizar'
                })
            }
        }

        const datosEspecialidadActualizar = { nombreCorto, ...campos, usuario };
        const especialidadActualizada = await Especialidad.findByIdAndUpdate(esid, datosEspecialidadActualizar, {new: true});

        res.json({
            ok: true,
            especialidad: especialidadActualizada
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
    getGrados,
    getGradoId, 
    guardarGrado, 
    actualizarGrado,
    getEspecialidades,
    getEspecialidadId, 
    guardarEspecialidad, 
    actualizarEspecialidad,
};