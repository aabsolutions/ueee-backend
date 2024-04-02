/*
    Path: /api/busqueda
*/

const { Router } = require('express');

const { validarJWT } = require('../middlewares/validar-jwt');

const { busquedaALL, busquedaColeccion } = require('../controllers/busquedas');

const router = Router();

router.get('/:str', [ validarJWT ] ,busquedaALL );
router.get('/:tbl/:str', [ validarJWT ] ,busquedaColeccion );


// router.post('/', [], );

// router.put('/:id',[], );

// router.delete('/:id', );

module.exports = router;