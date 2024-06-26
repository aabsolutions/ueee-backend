/*
ruta: /api/estudiantes
*/
const { check } = require('express-validator');
const { Router } = require('express');

const { 
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
} = require('../controllers/estudiantes');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//router.get(ruta_dentro, controlador)
router.get('/', validarJWT, getEstudiantes);
router.get('/:id', validarJWT, getEstudianteId);
router.get('/listado/:cid', validarJWT, getListadoEstudiantesPorCurso);
router.get('/matricula/:eid', validarJWT, getEstudianteMatricula);



router.post('/',[
    validarJWT,
    check('cedula','La cédula es requerida').not().isEmpty(),
    check('apellidos','Los apellidos son requeridos').not().isEmpty(),
    check('nombres','Los nombres son requeridos').not().isEmpty(),
    check('f_nac','La fecha de nacimiento es requerida').not().isEmpty(),
    check('sexo','El sexo es requerida').not().isEmpty(),
    validarCampos, 
] 
,guardarEstudiante);

router.put('/:id',[
    validarJWT,
    check('cedula','La cédula es requerida').not().isEmpty(),
    check('apellidos','Los apellidos son requeridos').not().isEmpty(),
    check('nombres','Los nombres son requeridos').not().isEmpty(),
    check('f_nac','La fecha de nacimiento es requerida').not().isEmpty(),
    check('sexo','El sexo es requerida').not().isEmpty(),
    validarCampos
] 
,actualizarEstudiante);

router.put('/asignacion/:id',[
    validarJWT,
    check('curso','El id del curso es requerido').not().isEmpty(),
    validarCampos
] 
,asignacionEstudianteCurso);

router.put('/imc/:id',[
    validarJWT,
    check('periodo','El periodo del registro es requerido').not().isEmpty(),
    check('peso','El peso del estudiante es requerido').not().isEmpty(),
    check('talla','La talla peso del estudiante es requerido').not().isEmpty(),
    check('fecha_toma','La fecha de la toma es es requerida').not().isEmpty(),
    validarCampos
] 
,registroEstudianteImc);

router.put('/imc/actualizar/:id',[
    validarJWT,
    check('peso','El peso del estudiante es requerido').not().isEmpty(),
    check('talla','La talla peso del estudiante es requerido').not().isEmpty(),
    validarCampos
] 
,actualizarRegistroEstudianteImc);

router.delete('/:id', [
    validarJWT,
    check('estado','El estado es requerido').not().isEmpty(),
    validarCampos
], estadoEstudiante);

module.exports = router;