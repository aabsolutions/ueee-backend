/*
ruta: /api/estudiantes
*/
const { check } = require('express-validator');
const { Router } = require('express');

const { getEstudiantes, guardarEstudiante, actualizarEstudiante, borrarEstudiante, getEstudianteId, asignacionEstudianteCurso, estadoEstudiante } = require('../controllers/estudiantes');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//router.get(ruta_dentro, controlador)
router.get('/', validarJWT, getEstudiantes);
router.get('/:id', validarJWT, getEstudianteId);

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

router.delete('/:id', [
    validarJWT,
    check('estado','El estado es requerido').not().isEmpty(),
    validarCampos
], estadoEstudiante);

module.exports = router;