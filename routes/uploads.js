/*
    Path: /api/uploads
*/

const { Router } = require('express');
const expressFileUpload  = require('express-fileupload');

const { uploadFile, getImage } = require('../controllers/uploads');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.use(expressFileUpload());

router.put('/:type/:id', validarJWT ,uploadFile);

router.get('/:type/:foto', getImage);

module.exports = router;