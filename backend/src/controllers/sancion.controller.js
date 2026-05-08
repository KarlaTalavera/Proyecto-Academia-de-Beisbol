const SancionModel = require('../models/sancion.model')
const { notificarAdmin, notificarCaja } = require('../services/notificacion.service')

const SancionController = {
  async listar(req, res) {
    const { rol, id_equipo } = req.usuario
    const data = await SancionModel.findAll(req.query.temporada || null)
    if (rol === 'dueno') {
      // Filtrar sanciones solo para su equipo o jugadores de su equipo
      const filtered = data.filter(s => s.id_equipo === id_equipo || s.jugador_id_equipo === id_equipo)
      return res.json(filtered)
    }
    res.json(data)
  },

  async obtener(req, res) {
    const item = await SancionModel.findById(req.params.id)
    if (!item) return res.status(404).json({ error: 'Sanción no encontrada' })
    res.json(item)
  },

  async crear(req, res) {
    const { id_temporada, tipo, descripcion, fecha_sancion } = req.body
    if (!id_temporada || !tipo || !descripcion || !fecha_sancion) {
      return res.status(400).json({ error: 'id_temporada, tipo, descripcion y fecha_sancion son requeridos' })
    }
    const id = await SancionModel.create(req.body)
    notificarAdmin({
      titulo: 'Nueva sanción registrada',
      mensaje: `Se registró una sanción de tipo "${tipo}": ${descripcion}`,
    }).catch(console.error)
    res.status(201).json({ id_sancion: id })
  },

  async actualizar(req, res) {
    const sancionAntes = await SancionModel.findById(req.params.id)
    const affected = await SancionModel.update(req.params.id, req.body)
    if (!affected) return res.status(404).json({ error: 'Sanción no encontrada' })

    // Notificar a caja cuando una multa queda cumplida
    const ahora = req.body
    if (
      sancionAntes?.tipo === 'multa' &&
      sancionAntes?.estado !== 'cumplida' &&
      ahora.estado === 'cumplida'
    ) {
      const monto = sancionAntes.monto_multa
      notificarCaja({
        titulo: '💰 Multa cumplida — registrar ingreso',
        mensaje: `La multa de ${monto} Bs. (${sancionAntes.descripcion}) fue marcada como cumplida. Registra el ingreso en el módulo de Finanzas con categoría "Multa".`,
      }).catch(console.error)
      notificarAdmin({
        titulo: 'Multa cumplida',
        mensaje: `Multa de ${monto} Bs. marcada como cumplida: ${sancionAntes.descripcion}`,
      }).catch(console.error)
    }

    res.json({ ok: true })
  },

  async eliminar(req, res) {
    const affected = await SancionModel.delete(req.params.id)
    if (!affected) return res.status(404).json({ error: 'Sanción no encontrada' })
    res.json({ ok: true })
  },
}

module.exports = SancionController
