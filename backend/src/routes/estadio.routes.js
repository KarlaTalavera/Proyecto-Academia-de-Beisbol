const router = require('express').Router()
const EstadioController = require('../controllers/estadio.controller')
const { verificarToken } = require('../middlewares/auth')
const { soloRoles } = require('../middlewares/roles')

const soloAdmin = soloRoles('administrador')

router.get('/', verificarToken, soloAdmin, EstadioController.listar)
router.get('/:id', verificarToken, soloAdmin, EstadioController.obtener)
router.post('/', verificarToken, soloAdmin, EstadioController.crear)
router.put('/:id', verificarToken, soloAdmin, EstadioController.actualizar)
router.delete('/:id', verificarToken, soloAdmin, EstadioController.eliminar)

module.exports = router
