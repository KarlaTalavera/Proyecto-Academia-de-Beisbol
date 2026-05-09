const router             = require('express').Router()
const PartidoController  = require('../controllers/partido.controller')
const { verificarToken } = require('../middlewares/auth')
const { soloRoles }      = require('../middlewares/roles')

// Administrador o dueño pueden cambiar estado y reprogramar
const gestion  = soloRoles('administrador', 'dueno', 'anotador')
// Anotador es el ÚNICO que puede cargar lineup, resultado y estadísticas
const anotador = soloRoles('anotador')
// Taquilla: admin, dueño y caja
const taquilla = soloRoles('administrador', 'dueno', 'caja')

// ── Partidos ────────────────────────────────────────────────
router.get('/',    verificarToken, PartidoController.listar)
router.get('/:id', verificarToken, PartidoController.obtener)
router.post('/',              verificarToken, soloRoles('administrador'), PartidoController.crear)
router.patch('/:id/estado',   verificarToken, gestion, PartidoController.actualizarEstado)
router.patch('/:id/reprogramar', verificarToken, gestion, PartidoController.reprogramar)
router.delete('/:id',         verificarToken, soloRoles('administrador'), PartidoController.eliminar)

// ── Lineup (solo anotador) ───────────────────────────────────
router.get('/:id/lineup',  verificarToken, PartidoController.getLineup)
router.post('/:id/lineup', verificarToken, anotador, PartidoController.setLineup)

// ── Resultado (solo anotador) ────────────────────────────────
router.get('/:id/resultado',  verificarToken, PartidoController.getResultado)
router.post('/:id/resultado', verificarToken, anotador, PartidoController.guardarResultado)

// ── Desempeño individual (solo anotador) ─────────────────────
router.get('/:id/desempeno',           verificarToken, PartidoController.getDesempeno)
router.post('/:id/desempeno/bateador', verificarToken, anotador, PartidoController.guardarDesempenoBateador)
router.post('/:id/desempeno/pitcher',  verificarToken, anotador, PartidoController.guardarDesempenoPitcher)

// ── Taquilla (solo admin y dueño) ────────────────────────────
router.get('/:id/taquilla',   verificarToken, PartidoController.getTaquilla)
router.patch('/:id/taquilla', verificarToken, taquilla, PartidoController.guardarTaquilla)

module.exports = router
