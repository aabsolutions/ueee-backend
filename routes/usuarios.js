/*
ruta: /api/usuarios
*/
const { check } = require('express-validator');
const { Router } = require('express');

const { validarCampos } = require('../middlewares/validar-campos');
const { getUsuarios, guardarUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT ,getUsuarios);
router.post('/',[
    check('email','El correo es obligatorio').not().isEmpty(),
    check('password').not().isEmpty(),
    check('nombre').not().isEmpty(),
    validarCampos
], guardarUsuario);
router.put('/:id',[
    validarJWT,
    check('email','El correo es obligatorio').not().isEmpty(),
    check('nombre').not().isEmpty(),
    check('role').not().isEmpty(),
    validarCampos
], actualizarUsuario);
router.delete('/:id', validarJWT, borrarUsuario);

module.exports = router;