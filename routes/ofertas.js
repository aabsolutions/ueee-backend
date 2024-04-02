/*
ruta: /api/ofertas
*/
const { check } = require('express-validator');
const { Router } = require('express');

const { getGrados, getGradoId, guardarGrado, actualizarGrado } = require('../controllers/ofertas');
const { getEspecialidades, getEspecialidadId, guardarEspecialidad, actualizarEspecialidad } = require('../controllers/ofertas');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//GRADOS
router.get('/grados', validarJWT, getGrados);
router.get('/grados/:id', validarJWT, getGradoId);

router.post('/grados/',[
    validarJWT,
    check('nombre','El nombre es requerido').not().isEmpty(),
    check('nivelCorto','El nivel corto es requerido').not().isEmpty(),
    check('nivelLargo','El nivel largo es requerido').not().isEmpty(),
    check('secuencia','La secuencia es requerida').not().isEmpty(),
    validarCampos, 
] 
,guardarGrado);

router.put('/grados/:id',[
    validarJWT,
    check('nombre','El nombre es requerido').not().isEmpty(),
    check('nivelCorto','El nivel corto es requerido').not().isEmpty(),
    check('nivelLargo','El nivel largo es requerido').not().isEmpty(),
    check('secuencia','La secuencia es requerida').not().isEmpty(),
    validarCampos
] 
,actualizarGrado);

//ESPECIALIDADES
router.get('/especialidades', validarJWT, getEspecialidades);
router.get('/especialidades/:id', validarJWT, getEspecialidadId);

router.post('/especialidades/',[
    validarJWT,
    check('nombreCorto','El nombre corto es requerido').not().isEmpty(),
    check('nombreLargo','El nombre largo es requerido').not().isEmpty(),
    check('categoria','El nivel largo es requerido').not().isEmpty(),
    validarCampos, 
] 
,guardarEspecialidad);

router.put('/especialidades/:id',[
    validarJWT,
    check('nombreCorto','El nombre es requerido').not().isEmpty(),
    check('nombreLargo','El nivel corto es requerido').not().isEmpty(),
    check('categoria','El nivel largo es requerido').not().isEmpty(),
    validarCampos
] 
,actualizarEspecialidad);


module.exports = router;