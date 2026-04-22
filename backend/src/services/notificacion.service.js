const db = require('../config/database')
const NotificacionModel = require('../models/notificacion.model')
const { enviarCorreo } = require('./email.service')

async function notificarAdmin({ titulo, mensaje }) {
  const [admins] = await db.query(
    `SELECT id_usuario FROM usuario WHERE rol = 'administrador' AND activo = 1`
  )
  for (const a of admins) {
    await NotificacionModel.crear({ id_usuario: a.id_usuario, tipo: 'admin', titulo, mensaje })
  }
}

async function notificarCaja({ titulo, mensaje }) {
  const [cajas] = await db.query(
    `SELECT id_usuario FROM usuario WHERE rol = 'caja' AND activo = 1`
  )
  for (const c of cajas) {
    await NotificacionModel.crear({ id_usuario: c.id_usuario, tipo: 'caja', titulo, mensaje })
  }
}

async function emailAnotadores({ asunto, html }) {
  const [anotadores] = await db.query(
    `SELECT email FROM usuario WHERE rol = 'anotador' AND activo = 1`
  )
  for (const a of anotadores) {
    await enviarCorreo({ para: a.email, asunto, html }).catch(console.error)
  }
}

async function emailFansEquipos({ equipos, asunto, html }) {
  const placeholders = equipos.map(() => '?').join(',')
  const [fans] = await db.query(
    `SELECT DISTINCT u.email, u.nombre
     FROM seguimiento s
     JOIN usuario u ON s.id_usuario = u.id_usuario
     WHERE s.id_equipo IN (${placeholders}) AND u.activo = 1`,
    equipos
  )
  for (const fan of fans) {
    await enviarCorreo({ para: fan.email, asunto, html }).catch(console.error)
  }
}

module.exports = { notificarAdmin, notificarCaja, emailAnotadores, emailFansEquipos }
