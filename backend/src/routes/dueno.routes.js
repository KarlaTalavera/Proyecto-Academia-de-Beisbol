const router = require('express').Router()
const DuenoController = require('../controllers/dueno.controller')
const { verificarToken } = require('../middlewares/auth')
const { duenoConEquipo } = require('../middlewares/roles')

// Todas las rutas requieren ser dueño con equipo asignado
router.use(verificarToken, duenoConEquipo)

router.get('/equipo', DuenoController.obtenerEquipo)
router.get('/partidos', DuenoController.obtenerPartidos)
router.get('/jugadores', DuenoController.obtenerJugadores)
router.put('/jugadores/:id', DuenoController.editarJugador)
router.get('/sanciones', DuenoController.obtenerSanciones)

module.exports = router