const db = require('../config/database')
const { emailFansEquipos } = require('../services/notificacion.service')

async function notificarFansPartidosManana() {
  const manana = new Date()
  manana.setDate(manana.getDate() + 1)
  const fechaStr = manana.toISOString().slice(0, 10)

  const [partidos] = await db.query(`
    SELECT p.id_partido, p.fecha_juego, p.hora_juego, p.lugar,
           ec.nombre_equipo AS casa, ev.nombre_equipo AS visitante,
           p.id_equipo_casa, p.id_equipo_visitante
    FROM partido p
    JOIN equipo ec ON p.id_equipo_casa      = ec.id_equipo
    JOIN equipo ev ON p.id_equipo_visitante = ev.id_equipo
    WHERE p.estado = 'programado' AND p.fecha_juego = ?
  `, [fechaStr])

  for (const p of partidos) {
    const hora  = p.hora_juego?.substring(0, 5) || ''
    const lugar = p.lugar || 'por confirmar'
    const fecha = new Date(p.fecha_juego + 'T12:00:00').toLocaleDateString('es-VE', {
      weekday: 'long', day: 'numeric', month: 'long',
    })

    await emailFansEquipos({
      equipos: [p.id_equipo_casa, p.id_equipo_visitante],
      asunto:  `⚾ Mañana juega tu equipo: ${p.casa} vs ${p.visitante}`,
      html: `
        <div style="font-family:sans-serif; max-width:500px; margin:auto;">
          <h2 style="color:#1e293b;">¡Partido mañana!</h2>
          <p>Hay un partido de la Liga Diamante en el que participa un equipo que sigues:</p>
          <div style="background:#f1f5f9; border-radius:10px; padding:16px; margin:16px 0; text-align:center;">
            <h3 style="margin:0; color:#6366f1;">⚾ ${p.casa} vs ${p.visitante}</h3>
            <p style="margin:8px 0;">📅 ${fecha} a las ${hora}</p>
            <p style="margin:0;">📍 ${lugar}</p>
          </div>
          <p>¡No te lo pierdas!</p>
          <hr/>
          <p style="font-size:0.85rem; color:#64748b;">Liga Diamante — Sistema de Gestión</p>
        </div>
      `,
    })
  }
}

function msHasta8am() {
  const ahora  = new Date()
  const target = new Date(ahora)
  target.setDate(target.getDate() + 1)
  target.setHours(8, 0, 0, 0)
  return target - ahora
}

function iniciarJobFans() {
  function tick() {
    notificarFansPartidosManana().catch(console.error)
    setTimeout(tick, 24 * 60 * 60 * 1000)
  }
  setTimeout(tick, msHasta8am())
}

module.exports = { iniciarJobFans }
