/*
ruta: /api/cursos
*/
const { check } = require('express-validator');
const { Router } = require('express');

const { getCursos, guardarCurso, getCursoId, actualizarCurso, borrarCurso } = require('../controllers/cursos');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//router.get(ruta_dentro, controlador)
router.get('/', validarJWT, getCursos);
router.get('/:id', validarJWT, getCursoId);

router.post('/',[
    validarJWT,
    check('grado','El grado es requerido').not().isEmpty(),
    check('paralelo','El paralelo es requerido').not().isEmpty(),
    check('jornada','La jornada es requerida').not().isEmpty(),
    validarCampos, 
] 
,guardarCurso);
router.put('/:id',[
    validarJWT,
    check('paralelo','El paralelo es requerido').not().isEmpty(),
    check('jornada','La jornada es requerida').not().isEmpty(),
    validarCampos
] 
,actualizarCurso);
router.delete('/:id', validarJWT, borrarCurso);

module.exports = router;