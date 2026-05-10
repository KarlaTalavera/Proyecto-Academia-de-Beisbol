const NotificacionModel = require('../models/notificacion.model')

const NotificacionController = {
  async listar(req, res) {
    const notificaciones = await NotificacionModel.findByUsuario(req.usuario.id)
    res.json(notificaciones)
  },

  async contarNoLeidas(req, res) {
    const total = await NotificacionModel.contarNoLeidas(req.usuario.id)
    res.json({ total })
  },

  async marcarLeida(req, res) {
    await NotificacionModel.marcarLeida(req.params.id, req.usuario.id)
    res.json({ ok: true })
  },

  async marcarTodasLeidas(req, res) {
    await NotificacionModel.marcarTodasLeidas(req.usuario.id)
    res.json({ ok: true })
  },
}

module.exports = NotificacionController
