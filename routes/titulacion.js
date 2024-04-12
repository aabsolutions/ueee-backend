/*
ruta: /api/titulacion
*/
const { check } = require('express-validator');
const { Router } = require('express');

const {
    getListadoTitulacionEstudiantes,
    guardarTitulacion
} = require('../controllers/titulacion');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/estudiantes/:cid', validarJWT, getListadoTitulacionEstudiantes);

router.put('/:enrid',[
    validarJWT,
    check('enrid','El código de enrolamiento es requerido').not().isEmpty(),
    validarCampos, 
] 
,guardarTitulacion);

module.exports = router;