const router = require('express').Router()
const { verificarToken } = require('../middlewares/auth')
const NotificacionController = require('../controllers/notificacion.controller')

router.get('/',           verificarToken, NotificacionController.listar)
router.get('/no-leidas',  verificarToken, NotificacionController.contarNoLeidas)
router.patch('/todas-leidas', verificarToken, NotificacionController.marcarTodasLeidas)
router.patch('/:id/leida',    verificarToken, NotificacionController.marcarLeida)

module.exports = router
