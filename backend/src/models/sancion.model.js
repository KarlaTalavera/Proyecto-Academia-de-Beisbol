const db = require('../config/database')

const SancionModel = {
  async findAll(id_temporada, id_equipo = null) {
    let base = `
      SELECT s.*,
             CONCAT(j.nombre, ' ', j.apellido) AS jugador_nombre,
             e.nombre_equipo,
             t.nombre AS temporada
      FROM sancion s
      LEFT JOIN jugador   j ON s.id_jugador   = j.id_jugador
      LEFT JOIN equipo    e ON s.id_equipo    = e.id_equipo
      JOIN      temporada t ON s.id_temporada = t.id_temporada`
    const params = []
    const conditions = []
    if (id_temporada) {
      conditions.push('s.id_temporada = ?')
      params.push(id_temporada)
    }
    if (id_equipo) {
      conditions.push('(s.id_equipo = ? OR j.id_equipo = ?)')
      params.push(id_equipo, id_equipo)
    }
    if (conditions.length) base += ' WHERE ' + conditions.join(' AND ')
    base += ' ORDER BY s.fecha_sancion DESC'
    const [rows] = await db.query(base, params)
    return rows
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT s.*,
              CONCAT(j.nombre, ' ', j.apellido) AS jugador_nombre,
              e.nombre_equipo, t.nombre AS temporada
       FROM sancion s
       LEFT JOIN jugador   j ON s.id_jugador   = j.id_jugador
       LEFT JOIN equipo    e ON s.id_equipo    = e.id_equipo
       JOIN      temporada t ON s.id_temporada = t.id_temporada
       WHERE s.id_sancion = ?`,
      [id]
    )
    return rows[0] || null
  },

  async create({ id_temporada, id_jugador, id_equipo, tipo, descripcion, fecha_sancion, partidos_suspension, monto_multa }) {
    const [result] = await db.query(
      `INSERT INTO sancion (id_temporada, id_jugador, id_equipo, tipo, descripcion, fecha_sancion, partidos_suspension, monto_multa)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_temporada, id_jugador || null, id_equipo || null, tipo, descripcion, fecha_sancion, partidos_suspension || 0, monto_multa || 0]
    )
    return result.insertId
  },

  async update(id, { tipo, descripcion, fecha_sancion, partidos_suspension, monto_multa, estado }) {
    const [result] = await db.query(
      `UPDATE sancion SET tipo=?, descripcion=?, fecha_sancion=?, partidos_suspension=?, monto_multa=?, estado=?
       WHERE id_sancion=?`,
      [tipo, descripcion, fecha_sancion, partidos_suspension || 0, monto_multa || 0, estado || 'activa', id]
    )
    return result.affectedRows
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM sancion WHERE id_sancion = ?', [id])
    return result.affectedRows
  },
}

module.exports = SancionModel
