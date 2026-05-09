const db = require('../config/database')

const DuenoController = {
  async obtenerEquipo(req, res) {
    const [[equipo]] = await db.query(
      'SELECT * FROM equipo WHERE id_equipo = ?',
      [req.usuario.id_equipo]
    )
    if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' })
    res.json(equipo)
  },

  async obtenerPartidos(req, res) {
    const [partidos] = await db.query(`
      SELECT p.*, e1.nombre_equipo as equipo_casa, e2.nombre_equipo as equipo_visitante
      FROM partido p
      JOIN equipo e1 ON p.id_equipo_casa = e1.id_equipo
      JOIN equipo e2 ON p.id_equipo_visitante = e2.id_equipo
      WHERE p.id_equipo_casa = ? OR p.id_equipo_visitante = ?
      ORDER BY p.fecha_juego DESC, p.hora_juego DESC
    `, [req.usuario.id_equipo, req.usuario.id_equipo])
    res.json(partidos)
  },

  async obtenerJugadores(req, res) {
    const [jugadores] = await db.query(`
      SELECT * FROM jugador
      WHERE id_equipo = ? AND activo = 1
      ORDER BY nombre, apellido
    `, [req.usuario.id_equipo])
    res.json(jugadores)
  },

  async editarJugador(req, res) {
    const { nombre, apellido, fecha_nacimiento, rol, posicion, brazo_dominante } = req.body
    const [result] = await db.query(`
      UPDATE jugador SET
        nombre = ?, apellido = ?, fecha_nacimiento = ?, rol = ?, posicion = ?, brazo_dominante = ?
      WHERE id_jugador = ? AND id_equipo = ?
    `, [nombre, apellido, fecha_nacimiento, rol, posicion, brazo_dominante, req.params.id, req.usuario.id_equipo])
    if (!result.affectedRows) return res.status(404).json({ error: 'Jugador no encontrado o no pertenece a tu equipo' })
    res.json({ ok: true })
  },

  async obtenerSanciones(req, res) {
    const [sanciones] = await db.query(`
      SELECT s.*, j.nombre as nombre_jugador, j.apellido as apellido_jugador
      FROM sancion s
      LEFT JOIN jugador j ON s.id_jugador = j.id_jugador
      WHERE j.id_equipo = ? OR s.id_equipo = ?
      ORDER BY s.fecha_sancion DESC
    `, [req.usuario.id_equipo, req.usuario.id_equipo])
    res.json(sanciones)
  }
}

module.exports = DuenoController