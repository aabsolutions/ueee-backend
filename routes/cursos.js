/*
ruta: /api/cursos
*/
const { check } = require('express-validator');
const { Router } = require('express');

const { 
        getCursos, 
        getCursosFiltrados,
        getCursosFiltradosTitulacion,
        getOfertaActiva, 
        guardarCurso, 
        getCursoId, 
        actualizarCurso, 
        borrarCurso,
        getTotalesOferta
    } = require('../controllers/cursos');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//router.get(ruta_dentro, controlador)
router.get('/', validarJWT, getCursos);
router.get('/oferta/:jornada', validarJWT, getOfertaActiva);
router.get('/oferta/totales/:jornada', validarJWT, getTotalesOferta);
router.get('/:id', validarJWT, getCursoId);
router.get('/listado/filtro', validarJWT, getCursosFiltrados);
router.get('/listado/titulacion/filtro', validarJWT, getCursosFiltradosTitulacion);

router.post('/',[
    validarJWT,
    check('grado','El grado es requerido').not().isEmpty(),
    check('grado_abrev','La abreviatura del grado es requerida').not().isEmpty(),
    check('nivel','El nivel del grado es requerido').not().isEmpty(),
    check('nivel_abrev','La abreviatura del nivel es requerida').not().isEmpty(),
    check('paralelo','El paralelo es requerido').not().isEmpty(),
    check('jornada','La jornada es requerida').not().isEmpty(),
    validarCampos, 
] 
,guardarCurso);
router.put('/:id',[
    validarJWT,
    check('grado','El grado es requerido').not().isEmpty(),
    check('grado_abrev','La abreviatura del grado es requerida').not().isEmpty(),
    check('nivel','El nivel del grado es requerido').not().isEmpty(),
    check('nivel_abrev','La abreviatura del nivel es requerida').not().isEmpty(),
    check('paralelo','El paralelo es requerido').not().isEmpty(),
    check('jornada','La jornada es requerida').not().isEmpty(),
    validarCampos
] 
,actualizarCurso);
router.delete('/:id', validarJWT, borrarCurso);

module.exports = router;