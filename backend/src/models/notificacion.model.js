const db = require('../config/database')

const NotificacionModel = {
  async crear({ id_usuario, tipo, titulo, mensaje }) {
    const [r] = await db.query(
      `INSERT INTO notificacion (id_usuario, tipo, titulo, mensaje) VALUES (?, ?, ?, ?)`,
      [id_usuario, tipo, titulo, mensaje]
    )
    return r.insertId
  },

  async findByUsuario(id_usuario, limite = 30) {
    const [rows] = await db.query(
      `SELECT * FROM notificacion WHERE id_usuario = ? ORDER BY created_at DESC LIMIT ?`,
      [id_usuario, limite]
    )
    return rows
  },

  async contarNoLeidas(id_usuario) {
    const [rows] = await db.query(
      `SELECT COUNT(*) AS total FROM notificacion WHERE id_usuario = ? AND leida = 0`,
      [id_usuario]
    )
    return Number(rows[0].total)
  },

  async marcarLeida(id, id_usuario) {
    await db.query(
      `UPDATE notificacion SET leida = 1 WHERE id = ? AND id_usuario = ?`,
      [id, id_usuario]
    )
  },

  async marcarTodasLeidas(id_usuario) {
    await db.query(
      `UPDATE notificacion SET leida = 1 WHERE id_usuario = ?`,
      [id_usuario]
    )
  },
}

module.exports = NotificacionModel
