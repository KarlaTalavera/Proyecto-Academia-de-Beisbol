const db = require('../config/database')
const { emailAnotadores } = require('../services/notificacion.service')

async function checkPartidosSinAnotar() {
  const [partidos] = await db.query(`
    SELECT p.id_partido, p.fecha_juego,
           ec.nombre_equipo AS casa, ev.nombre_equipo AS visitante
    FROM partido p
    JOIN equipo ec ON p.id_equipo_casa      = ec.id_equipo
    JOIN equipo ev ON p.id_equipo_visitante = ev.id_equipo
    LEFT JOIN desempeno_bateador db2 ON db2.id_partido = p.id_partido
    WHERE p.estado = 'finalizado'
      AND db2.id_partido IS NULL
    GROUP BY p.id_partido
  `)

  for (const p of partidos) {
    const fecha = new Date(p.fecha_juego).toLocaleDateString('es-VE')
    await emailAnotadores({
      asunto: `⚾ Partido sin anotar: ${p.casa} vs ${p.visitante}`,
      html: `
        <div style="font-family:sans-serif; max-width:500px; margin:auto;">
          <h2 style="color:#1e293b;">Partido pendiente de estadísticas</h2>
          <p>El partido <strong>${p.casa} vs ${p.visitante}</strong> del ${fecha}
          está marcado como <strong>Finalizado</strong> pero no tiene estadísticas de bateadores registradas.</p>
          <p>Por favor ingresa al sistema y registra las estadísticas del partido.</p>
          <hr/>
          <p style="font-size:0.85rem; color:#64748b;">Liga Diamante — Sistema de Gestión</p>
        </div>
      `,
    })
  }
}

function iniciarJobAnotador() {
  // Revisar cada hora
  setInterval(() => checkPartidosSinAnotar().catch(console.error), 60 * 60 * 1000)
  // Primera revisión al iniciar (30s de gracia para que BD conecte)
  setTimeout(() => checkPartidosSinAnotar().catch(console.error), 30_000)
}

module.exports = { iniciarJobAnotador }
