const db = require('../config/database')

const PartidoModel = {
  async findAll(id_temporada, id_equipo = null) {
    let base = `
      SELECT p.*,
             ec.nombre_equipo AS equipo_casa,
             ev.nombre_equipo AS equipo_visitante,
             t.nombre         AS temporada,
             r.carreras_home  AS carreras_casa,
             r.carreras_visitantes AS carreras_visitante,
             es.nombre       AS estadio_nombre,
             es.ciudad       AS estadio_ciudad,
             es.direccion    AS estadio_direccion,
             es.capacidad    AS estadio_capacidad
      FROM partido p
      JOIN equipo ec    ON p.id_equipo_casa      = ec.id_equipo
      JOIN equipo ev    ON p.id_equipo_visitante  = ev.id_equipo
      JOIN temporada t  ON p.id_temporada         = t.id_temporada
      LEFT JOIN resultado r ON p.id_partido       = r.id_partido
      LEFT JOIN estadio es ON p.id_estadio        = es.id_estadio`
    const params = []
    if (id_temporada) {
      base += ' WHERE p.id_temporada = ?'
      params.push(id_temporada)
    }
    if (id_equipo) {
      base += params.length ? ' AND' : ' WHERE'
      base += ' (p.id_equipo_casa = ? OR p.id_equipo_visitante = ?)' 
      params.push(id_equipo, id_equipo)
    }
    base += ' ORDER BY p.fecha_juego, p.hora_juego'
    const [rows] = await db.query(base, params)
    return rows
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT p.*,
              ec.nombre_equipo AS equipo_casa,
              ev.nombre_equipo AS equipo_visitante,
              es.nombre       AS estadio_nombre,
              es.ciudad       AS estadio_ciudad,
              es.direccion    AS estadio_direccion,
              es.capacidad    AS estadio_capacidad
       FROM partido p
       JOIN equipo ec ON p.id_equipo_casa     = ec.id_equipo
       JOIN equipo ev ON p.id_equipo_visitante = ev.id_equipo
       LEFT JOIN estadio es ON p.id_estadio = es.id_estadio
       WHERE p.id_partido = ?`,
      [id]
    )
    return rows[0] || null
  },

  async create({ id_temporada, id_equipo_casa, id_equipo_visitante, fecha_juego, hora_juego, id_estadio, lugar, innings_programados }) {
    const [result] = await db.query(
      `INSERT INTO partido (id_temporada, id_equipo_casa, id_equipo_visitante, fecha_juego, hora_juego, id_estadio, lugar, innings_programados)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_temporada, id_equipo_casa, id_equipo_visitante, fecha_juego, hora_juego, id_estadio || null, lugar || null, innings_programados || 9]
    )
    return result.insertId
  },

  async updateEstado(id, estado) {
    const [result] = await db.query('UPDATE partido SET estado=? WHERE id_partido=?', [estado, id])
    return result.affectedRows
  },

  async updateFechaHora(id, fecha_juego, hora_juego) {
    const [result] = await db.query(
      'UPDATE partido SET fecha_juego=?, hora_juego=?, estado=? WHERE id_partido=?',
      [fecha_juego, hora_juego, 'programado', id]
    )
    return result.affectedRows
  },

  async autoFinalizarVencidos() {
    await db.query(
      `UPDATE partido SET estado='finalizado'
       WHERE estado='programado'
       AND TIMESTAMP(fecha_juego, hora_juego) < NOW()`
    )
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM partido WHERE id_partido = ?', [id])
    return result.affectedRows
  },

  async findByEquipo(id_equipo) {
    const [rows] = await db.query(
      `SELECT * FROM partido 
      WHERE (id_equipo_casa = ? OR id_equipo_visitante = ?) 
      AND estado = 'programado' 
      ORDER BY fecha_juego ASC`, 
      [id_equipo, id_equipo]
    )
    return rows
  },

  async findLineup(id_partido) {
    const [rows] = await db.query(
      `SELECT l.*, j.nombre, j.apellido, j.posicion, e.nombre_equipo
       FROM lineup l
       JOIN jugador j ON l.id_jugador = j.id_jugador
       JOIN equipo  e ON l.id_equipo  = e.id_equipo
       WHERE l.id_partido = ?
       ORDER BY e.id_equipo, l.orden_bateo`,
      [id_partido]
    )
    return rows
  },

  async setLineup(entries) {
    // entries: [{ id_partido, id_jugador, id_equipo, orden_bateo, posicion_juego, es_titular }]
    const values = entries.map(e => [e.id_partido, e.id_jugador, e.id_equipo, e.orden_bateo, e.posicion_juego, e.es_titular ?? 1])
    await db.query(
      `INSERT INTO lineup (id_partido, id_jugador, id_equipo, orden_bateo, posicion_juego, es_titular)
       VALUES ?
       ON DUPLICATE KEY UPDATE orden_bateo=VALUES(orden_bateo), posicion_juego=VALUES(posicion_juego), es_titular=VALUES(es_titular)`,
      [values]
    )
  },
}

module.exports = PartidoModel
