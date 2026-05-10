<template>
  <div>

    <!-- Page header -->
    <div class="page-header mb-4">
      <h2 class="page-title">Dashboard</h2>
      <p class="page-subtitle">{{ temporadaNombre || 'Resumen general de la liga' }}</p>
    </div>

    <!-- Row 1: Próximo Partido + Estadísticas Temporada -->
    <div class="row g-3 mb-3">

      <!-- Próximo Partido -->
      <div class="col-lg-7">
        <div class="dash-card h-100">
          <div class="dash-card-header">
            <span class="dash-card-title">Próximo Partido</span>
            <RouterLink :to="{ name: 'Partidos' }" class="dash-link">Ver calendario</RouterLink>
          </div>
          <div v-if="proximoPartido" class="next-game">
            <div class="next-game-meta">
              <IconCalendarEvent :size="14" stroke-width="1.7" />
              <span>{{ formatFechaLarga(proximoPartido.fecha_juego) }}</span>
              <span class="mx-1">|</span>
              <span>{{ proximoPartido.hora_juego?.substring(0,5) }}</span>
            </div>
            <div class="next-game-matchup">
              <div class="next-game-team">
                <div class="team-badge team-badge--home">
                  {{ inicialEquipo(proximoPartido.equipo_casa) }}
                </div>
                <span class="next-game-name">{{ proximoPartido.equipo_casa }}</span>
              </div>
              <div class="next-game-vs">VS</div>
              <div class="next-game-team">
                <div class="team-badge team-badge--away">
                  {{ inicialEquipo(proximoPartido.equipo_visitante) }}
                </div>
                <span class="next-game-name">{{ proximoPartido.equipo_visitante }}</span>
              </div>
            </div>
            <div class="next-game-lugar">
              <IconMapPin :size="13" stroke-width="1.7" />
              {{ proximoPartido.lugar }}
            </div>
          </div>
          <div v-else class="text-center py-4 text-muted" style="font-size:0.85rem;">
            No hay partidos programados
          </div>
        </div>
      </div>

      <!-- Estadísticas de la temporada -->
      <div class="col-lg-5">
        <div class="dash-card h-100">
          <div class="dash-card-header">
            <span class="dash-card-title">Estadísticas de Temporada</span>
            <RouterLink :to="{ name: 'Reportes' }" class="dash-link">Ver reportes</RouterLink>
          </div>
          <div class="season-stats">
            <div class="season-bar">
              <div class="season-bar-fill" :style="{ width: barFinalizados + '%' }"></div>
            </div>
            <div class="season-stats-grid">
              <div class="season-stat">
                <div class="season-stat-val">{{ stats.partidosTotal }}</div>
                <div class="season-stat-lbl">JJ</div>
              </div>
              <div class="season-stat">
                <div class="season-stat-val">{{ stats.finalizados }}</div>
                <div class="season-stat-lbl">Finalizados</div>
              </div>
              <div class="season-stat">
                <div class="season-stat-val">{{ stats.programados }}</div>
                <div class="season-stat-lbl">Programados</div>
              </div>
              <div class="season-stat">
                <div class="season-stat-val">{{ stats.equipos }}</div>
                <div class="season-stat-lbl">Equipos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Row 2: Gráficos rápidos -->
    <div class="row g-3 mb-3">

      <!-- Top Bateadores -->
      <div :class="auth.puedeFinanzas ? 'col-lg-7' : 'col-12'">
        <div class="dash-card h-100">
          <div class="dash-card-header">
            <span class="dash-card-title">Top Bateadores — Home Runs</span>
            <RouterLink :to="{ name: 'Reportes' }" class="dash-link">Ver reporte</RouterLink>
          </div>
          <div v-if="!top5Bateadores.length" class="text-center py-3 text-muted" style="font-size:0.85rem;">Sin estadísticas registradas</div>
          <div v-else class="chart-hbar">
            <div v-for="(b, i) in top5Bateadores" :key="i"
                 class="hbar-row"
                 :class="{ 'hbar-row--active': hbarHovered === i, 'hbar-row--dim': hbarHovered !== -1 && hbarHovered !== i }"
                 @mouseenter="hbarHovered = i"
                 @mouseleave="hbarHovered = -1">
              <div class="hbar-rank">{{ i + 1 }}</div>
              <div class="hbar-label">{{ b.jugador?.split(' ')[0] || '—' }}</div>
              <div class="hbar-track">
                <div class="hbar-fill" :style="{ width: (b.HR / top5Bateadores[0].HR * 100) + '%', background: hbarColor(i) }"></div>
              </div>
              <div class="hbar-val" :style="{ color: hbarColor(i) }">{{ b.HR }} HR</div>
              <!-- Mini tooltip al hover -->
              <div v-if="hbarHovered === i" class="hbar-tooltip">
                <span class="fw-bold">{{ b.jugador }}</span>
                <span class="ms-2 text-muted" style="font-size:0.72rem;">{{ b.nombre_equipo }}</span>
                <div style="font-size:0.72rem; margin-top:2px;">
                  HR: <strong>{{ b.HR }}</strong> · RBI: <strong>{{ b.RBI }}</strong> · AVE: <strong>.{{ aveStr(b.AVE) }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Origen de Ingresos (solo finanzas/admin) -->
      <div v-if="auth.puedeFinanzas" class="col-lg-5">
        <div class="dash-card h-100">
          <div class="dash-card-header">
            <span class="dash-card-title">Origen de Ingresos</span>
            <RouterLink :to="{ name: 'Reportes' }" class="dash-link">Ver reporte</RouterLink>
          </div>
          <div v-if="!origenCategorias.length" class="text-center py-3 text-muted" style="font-size:0.85rem;">Sin ingresos registrados</div>
          <div v-else class="origen-chart">
            <canvas ref="canvasDashPie" width="180" height="180" style="display:block; margin: 0 auto;"></canvas>
            <div class="origen-legend">
              <div v-for="c in origenCategorias" :key="c.categoria" class="origen-legend-item">
                <span class="origen-dot" :style="{ background: colorOrigen(c.categoria) }"></span>
                <span class="origen-name">{{ c.categoria }}</span>
                <span class="origen-pct">{{ c.porcentaje }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Row 3: Posiciones + KPI cards -->
    <div class="row g-3">

      <!-- Tabla de Posiciones -->
      <div class="col-lg-7">
        <div class="dash-card">
          <div class="dash-card-header">
            <span class="dash-card-title">Posiciones</span>
            <RouterLink :to="{ name: 'Reportes' }" class="dash-link">Ver completo</RouterLink>
          </div>
          <div v-if="cargando" class="text-center py-4 text-muted" style="font-size:0.85rem;">Cargando...</div>
          <div v-else-if="!posiciones.length" class="text-center py-4 text-muted" style="font-size:0.85rem;">Sin datos de posiciones</div>
          <table v-else class="standings-table">
            <thead>
              <tr>
                <th class="st-pos">#</th>
                <th class="st-team">Equipo</th>
                <th><AbrevTooltip ab="JJ" /></th>
                <th><AbrevTooltip ab="G" /></th>
                <th><AbrevTooltip ab="P" /></th>
                <th><AbrevTooltip ab="CF" /></th>
                <th class="st-pct"><AbrevTooltip ab="PCT" /></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pos, i) in posiciones.slice(0, 8)" :key="pos.id_equipo"
                  :class="{ 'st-highlight': i === 0 }">
                <td class="st-pos">{{ i + 1 }}</td>
                <td class="st-team">
                  <div class="st-team-cell">
                    <div class="team-badge-sm" :style="{ background: coloresEquipo[i] }">
                      {{ inicialEquipo(pos.nombre_equipo) }}
                    </div>
                    <span class="st-team-name">{{ pos.nombre_equipo }}</span>
                  </div>
                </td>
                <td>{{ pos.jugados }}</td>
                <td class="fw-bold">{{ pos.ganados }}</td>
                <td>{{ pos.perdidos }}</td>
                <td>{{ (pos.carreras_favor || 0) + ':' + (pos.carreras_contra || 0) }}</td>
                <td class="st-pct fw-bold">{{ calcPct(pos.ganados, pos.jugados) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- KPI Mini Cards -->
      <div class="col-lg-5">
        <div class="row g-3">

          <div class="col-6">
            <div class="dash-mini-card">
              <div class="dash-mini-icon" style="background:rgba(99,102,241,0.12); color:#6366f1;">
                <IconUsers :size="20" stroke-width="1.7" />
              </div>
              <div class="dash-mini-label">Jugadores</div>
              <div class="dash-mini-value">{{ stats.jugadores }}</div>
            </div>
          </div>

          <div class="col-6">
            <div class="dash-mini-card">
              <div class="dash-mini-icon" style="background:rgba(20,184,166,0.12); color:#14b8a6;">
                <IconTrophy :size="20" stroke-width="1.7" />
              </div>
              <div class="dash-mini-label">Líder</div>
              <div class="dash-mini-value dash-mini-value--sm">{{ liderNombre }}</div>
            </div>
          </div>

          <div class="col-6" v-if="auth.puedeFinanzas">
            <div class="dash-mini-card">
              <div class="dash-mini-icon" style="background:rgba(34,197,94,0.12); color:#16a34a;">
                <IconWallet :size="20" stroke-width="1.7" />
              </div>
              <div class="dash-mini-label">Balance</div>
              <div class="dash-mini-value dash-mini-value--sm">{{ formatBs(stats.balance) }}</div>
            </div>
          </div>

          <div class="col-6">
            <div class="dash-mini-card">
              <div class="dash-mini-icon" style="background:rgba(249,115,22,0.12); color:#f97316;">
                <IconFlame :size="20" stroke-width="1.7" />
              </div>
              <div class="dash-mini-label">Avg Carreras</div>
              <div class="dash-mini-value">{{ promedioCarreras }}</div>
            </div>
          </div>

          <!-- Último resultado -->
          <div class="col-12">
            <div class="dash-mini-card dash-last-result" v-if="ultimoResultado">
              <div class="dash-card-title" style="font-size:0.72rem; margin-bottom:8px;">Último Resultado</div>
              <div class="last-result-row">
                <div class="last-result-team">
                  <div class="team-badge-sm" style="background:#3b82f6;">{{ inicialEquipo(ultimoResultado.equipo_casa) }}</div>
                  <span>{{ ultimoResultado.equipo_casa }}</span>
                </div>
                <div class="last-result-score">
                  <span class="score-num">{{ ultimoResultado.carreras_casa }}</span>
                  <span class="score-sep">-</span>
                  <span class="score-num">{{ ultimoResultado.carreras_visitante }}</span>
                </div>
                <div class="last-result-team last-result-team--right">
                  <span>{{ ultimoResultado.equipo_visitante }}</span>
                  <div class="team-badge-sm" style="background:#6366f1;">{{ inicialEquipo(ultimoResultado.equipo_visitante) }}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/store/auth'
import AbrevTooltip from '@/components/AbrevTooltip.vue'
import {
  IconUsers,
  IconCalendarEvent,
  IconWallet,
  IconTrophy,
  IconFlame,
  IconMapPin,
} from '@tabler/icons-vue'

const auth = useAuthStore()
const cargando = ref(false)
const posiciones = ref([])
const partidos = ref([])
const temporadaNombre = ref('')
const stats = ref({ equipos: 0, jugadores: 0, partidosTotal: 0, finalizados: 0, programados: 0, balance: 0 })

// Charts
const top5Bateadores = ref([])
const origenCategorias = ref([])
const canvasDashPie = ref(null)

const HBAR_COLORS = ['#6366f1', '#8b5cf6', '#0ea5e9', '#14b8a6', '#fb7185']
function hbarColor(i) { return HBAR_COLORS[i % HBAR_COLORS.length] }
const hbarHovered = ref(-1)
function aveStr(v) { return v != null ? Number(v).toFixed(3).replace('0.', '').padStart(3, '0') : '000' }

const ORIGEN_COLORES = {
  'Patrocinios':             '#8b5cf6',
  'Taquilla':                '#0ea5e9',
  'Inscripciones de Equipos':'#14b8a6',
  'Concesiones':             '#6366f1',
  'Multas':                  '#fb7185',
  'Otros':                   '#94a3b8',
}
function colorOrigen(cat) { return ORIGEN_COLORES[cat] || '#94a3b8' }

function _renderPie(progress, hoveredIdx) {
  const canvas = canvasDashPie.value
  if (!canvas) return
  const cats = origenCategorias.value.filter(c => c.total > 0)
  if (!cats.length) return

  const ctx = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height
  const cx = W / 2, cy = H / 2
  const rBase = Math.min(W, H) / 2 - 10
  ctx.clearRect(0, 0, W, H)

  const total = cats.reduce((s, c) => s + c.total, 0)
  let ang = -Math.PI / 2

  cats.forEach((cat, idx) => {
    const fullSlice = (cat.total / total) * 2 * Math.PI
    const slice = fullSlice * progress
    const isHov = idx === hoveredIdx
    const r = isHov ? rBase + 7 : rBase
    const midAngle = ang + slice / 2
    const ox = isHov ? Math.cos(midAngle) * 5 : 0
    const oy = isHov ? Math.sin(midAngle) * 5 : 0

    if (isHov) { ctx.shadowColor = colorOrigen(cat.categoria); ctx.shadowBlur = 12 }
    else { ctx.shadowBlur = 0 }

    ctx.beginPath()
    ctx.moveTo(cx + ox, cy + oy)
    ctx.arc(cx + ox, cy + oy, r, ang, ang + slice)
    ctx.closePath()
    ctx.fillStyle = colorOrigen(cat.categoria)
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()

    // Porcentaje encima del segmento (midAngle ya es el centro del arco)
    if (fullSlice > 0.28 && progress > 0.85) {
      const lx = cx + ox + (r * 0.68) * Math.cos(midAngle)
      const ly = cy + oy + (r * 0.68) * Math.sin(midAngle)
      ctx.fillStyle = '#fff'
      ctx.font = isHov ? 'bold 12px sans-serif' : 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(cat.porcentaje + '%', lx, ly)
    }

    ang += slice
  })

  // agujero del donut
  ctx.beginPath()
  ctx.arc(cx, cy, rBase * 0.48, 0, 2 * Math.PI)
  ctx.fillStyle = 'rgba(255,255,255,0.96)'
  ctx.fill()

  // Texto central
  const totalGeneral = origenCategorias.value.reduce((s, c) => s + c.total, 0)
  const totalStr = new Intl.NumberFormat('es-VE', { notation: 'compact', maximumFractionDigits: 1 }).format(totalGeneral)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#94a3b8'
  ctx.font = 'bold 11px sans-serif'
  ctx.fillText('TOTAL', cx, cy - 10)
  ctx.fillStyle = '#6366f1'
  ctx.font = 'bold 13px sans-serif'
  ctx.fillText(totalStr + ' Bs.', cx, cy + 9)
}

let _pieHoverIdx = -1
let _pieListenersAdded = false

function _addPieHover() {
  const canvas = canvasDashPie.value
  if (!canvas || _pieListenersAdded) return
  _pieListenersAdded = true
  canvas.style.cursor = 'default'

  canvas.addEventListener('mousemove', (e) => {
    const cats = origenCategorias.value.filter(c => c.total > 0)
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const mx = (e.clientX - rect.left) * scaleX
    const my = (e.clientY - rect.top) * scaleY
    const cx = canvas.width / 2, cy = canvas.height / 2
    const rBase = Math.min(canvas.width, canvas.height) / 2 - 10
    const dx = mx - cx, dy = my - cy
    const dist = Math.sqrt(dx * dx + dy * dy)

    let newHov = -1
    if (dist >= rBase * 0.48 && dist <= rBase + 10) {
      const total = cats.reduce((s, c) => s + c.total, 0)
      let mouseAng = Math.atan2(dy, dx)
      if (mouseAng < -Math.PI / 2) mouseAng += 2 * Math.PI
      let startAng = -Math.PI / 2
      for (let i = 0; i < cats.length; i++) {
        const slice = (cats[i].total / total) * 2 * Math.PI
        if (mouseAng >= startAng && mouseAng < startAng + slice) { newHov = i; break }
        startAng += slice
      }
    }
    if (newHov !== _pieHoverIdx) {
      _pieHoverIdx = newHov
      canvas.style.cursor = newHov >= 0 ? 'pointer' : 'default'
      _renderPie(1, _pieHoverIdx)
    }
  })
  canvas.addEventListener('mouseleave', () => {
    _pieHoverIdx = -1
    canvas.style.cursor = 'default'
    _renderPie(1, -1)
  })
}

function dibujarMiniPie() {
  _pieListenersAdded = false
  _pieHoverIdx = -1
  const DURATION = 900
  const start = performance.now()
  function frame(now) {
    const t = Math.min((now - start) / DURATION, 1)
    const eased = 1 - Math.pow(1 - t, 3)   // ease-out cubic
    _renderPie(eased, -1)
    if (t < 1) requestAnimationFrame(frame)
    else _addPieHover()
  }
  requestAnimationFrame(frame)
}

const coloresEquipo = [
  'linear-gradient(135deg,#f59e0b,#f97316)',
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#3b82f6,#06b6d4)',
  'linear-gradient(135deg,#14b8a6,#10b981)',
  'linear-gradient(135deg,#ec4899,#f43f5e)',
  'linear-gradient(135deg,#8b5cf6,#a855f7)',
  'linear-gradient(135deg,#64748b,#475569)',
  'linear-gradient(135deg,#ef4444,#dc2626)',
]

function extraerFecha(f) {
  if (!f) return ''
  return typeof f === 'string' ? f.substring(0, 10) : new Date(f).toISOString().substring(0, 10)
}

const proximoPartido = computed(() => {
  const hoy = new Date().toISOString().substring(0, 10)
  return partidos.value
    .filter(p => p.estado === 'programado' && extraerFecha(p.fecha_juego) >= hoy)
    .sort((a, b) => extraerFecha(a.fecha_juego).localeCompare(extraerFecha(b.fecha_juego)) || (a.hora_juego || '').localeCompare(b.hora_juego || ''))[0] || null
})

const ultimoResultado = computed(() => {
  return partidos.value
    .filter(p => p.estado === 'finalizado' && p.carreras_casa != null)
    .sort((a, b) => extraerFecha(b.fecha_juego).localeCompare(extraerFecha(a.fecha_juego)) || (b.hora_juego || '').localeCompare(a.hora_juego || ''))[0] || null
})

const liderNombre = computed(() => {
  if (!posiciones.value.length) return '—'
  const nombre = posiciones.value[0].nombre_equipo
  return nombre.length > 14 ? nombre.substring(0, 12) + '...' : nombre
})

const barFinalizados = computed(() => {
  if (!stats.value.partidosTotal) return 0
  return Math.round((stats.value.finalizados / stats.value.partidosTotal) * 100)
})

const promedioCarreras = computed(() => {
  const finalizados = partidos.value.filter(p => p.estado === 'finalizado' && p.carreras_casa != null)
  if (!finalizados.length) return '0.0'
  const total = finalizados.reduce((s, p) => s + Number(p.carreras_casa || 0) + Number(p.carreras_visitante || 0), 0)
  return (total / finalizados.length).toFixed(1)
})

function formatBs(v) {
  return new Intl.NumberFormat('es-VE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v || 0) + ' Bs.'
}

function inicialEquipo(nombre) {
  return nombre?.charAt(0)?.toUpperCase() || '?'
}

function formatFechaLarga(f) {
  if (!f) return ''
  // fecha_juego puede venir como ISO completo o solo YYYY-MM-DD
  const str = typeof f === 'string' ? f.substring(0, 10) : new Date(f).toISOString().substring(0, 10)
  const [y, m, d] = str.split('-').map(Number)
  const fecha = new Date(y, m - 1, d)
  return fecha.toLocaleDateString('es-VE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function calcPct(g, j) {
  if (!j) return '.000'
  return (g / j).toFixed(3).replace(/^0/, '')
}

async function cargar() {
  cargando.value = true
  try {
    const resTemp = await api.get('/temporadas').catch(() => ({ data: [] }))
    const tempActiva = resTemp.data.find(t => t.activa)
    const idTemp = tempActiva?.id_temporada || resTemp.data[0]?.id_temporada
    temporadaNombre.value = tempActiva?.nombre || ''

    const promesas = [
      api.get('/equipos').catch(() => ({ data: [] })),
      api.get('/jugadores').catch(() => ({ data: [] })),
      api.get('/partidos').catch(() => ({ data: [] })),
    ]
    if (idTemp) {
      promesas.push(
        api.get('/reportes/posiciones', { params: { temporada: idTemp } }).catch(() => ({ data: [] }))
      )
    }
    if (auth.puedeFinanzas && idTemp) {
      promesas.push(
        api.get('/finanzas/balance', { params: { temporada: idTemp } }).catch(() => ({ data: { balance: 0 } }))
      )
    }

    const res = await Promise.all(promesas)
    const equiposData = res[0].data
    const jugadoresData = res[1].data
    const partidosData = res[2].data

    stats.value.equipos = equiposData.length
    stats.value.jugadores = jugadoresData.length
    stats.value.partidosTotal = partidosData.length
    stats.value.finalizados = partidosData.filter(p => p.estado === 'finalizado').length
    stats.value.programados = partidosData.filter(p => p.estado === 'programado').length

    partidos.value = partidosData
    if (res[3]) posiciones.value = res[3].data
    if (auth.puedeFinanzas && res[idTemp ? 4 : 3]) {
      const balRes = res[idTemp ? 4 : 3]
      stats.value.balance = balRes?.data?.balance || 0
    }

    // Cargar datos de gráficos del dashboard
    if (idTemp) {
      const [resBat, resOrigen] = await Promise.all([
        api.get('/reportes/estadisticas-bateadores', { params: { temporada: idTemp } }).catch(() => ({ data: [] })),
        auth.puedeFinanzas
          ? api.get('/reportes/origen-ingresos', { params: { temporada: idTemp } }).catch(() => ({ data: { categorias: [] } }))
          : Promise.resolve({ data: { categorias: [] } }),
      ])
      const bateadores = Array.isArray(resBat.data) ? resBat.data : []
      top5Bateadores.value = [...bateadores].sort((a, b) => b.HR - a.HR).slice(0, 5).filter(b => b.HR > 0)
      origenCategorias.value = resOrigen.data?.categorias || []
      if (origenCategorias.value.length) {
        await nextTick()
        requestAnimationFrame(dibujarMiniPie)
      }
    }
  } finally {
    cargando.value = false
  }
}

onMounted(cargar)
</script>

<style scoped>
/* ── Dashboard Cards ── */
.dash-card {
  border-radius: 18px;
  padding: 1.2rem 1.4rem;
  background: rgba(255,255,255,0.78);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.65);
  box-shadow: 0 4px 28px rgba(0,0,0,0.06);
}
.dash-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.dash-card-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e293b;
}
.dash-link {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6366f1;
  text-decoration: none;
}
.dash-link:hover { text-decoration: underline; }

/* ── Next Game ── */
.next-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 8px 0;
}
.next-game-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 600;
}
.next-game-matchup {
  display: flex;
  align-items: center;
  gap: 24px;
  width: 100%;
  justify-content: center;
}
.next-game-team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 110px;
}
.team-badge {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 800;
  color: white;
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
}
.team-badge--home {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
}
.team-badge--away {
  background: linear-gradient(135deg, #f97316, #f59e0b);
}
.next-game-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
}
.next-game-vs {
  font-size: 1rem;
  font-weight: 900;
  color: #e11d48;
  background: rgba(225,29,72,0.08);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.next-game-lugar {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 600;
}

/* ── Season Stats ── */
.season-stats {
  padding: 8px 0;
}
.season-bar {
  height: 8px;
  background: rgba(0,0,0,0.06);
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 20px;
}
.season-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #14b8a6, #3b82f6);
  border-radius: 99px;
  transition: width 0.6s ease;
}
.season-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  text-align: center;
}
.season-stat-val {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}
.season-stat-lbl {
  font-size: 0.68rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-top: 4px;
}

/* ── Standings Table ── */
.standings-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}
.standings-table th {
  font-size: 0.68rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 6px 10px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  text-align: center;
}
.standings-table td {
  padding: 10px 10px;
  color: #334155;
  text-align: center;
  border-bottom: 1px solid rgba(0,0,0,0.04);
  font-weight: 500;
}
.standings-table tr:last-child td { border-bottom: none; }
.standings-table .st-pos { width: 32px; color: #94a3b8; font-weight: 700; }
.standings-table .st-team { text-align: left; }
.standings-table .st-pct { color: #6366f1; }
.st-highlight td { background: rgba(99,102,241,0.04); }
.st-highlight .st-pos { color: #f59e0b; font-weight: 800; }

.st-team-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.team-badge-sm {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
}
.st-team-name {
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
}

/* ── Mini KPI Cards ── */
.dash-mini-card {
  border-radius: 16px;
  padding: 1.1rem 1.2rem;
  background: rgba(255,255,255,0.78);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.65);
  box-shadow: 0 4px 28px rgba(0,0,0,0.06);
}
.dash-mini-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}
.dash-mini-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin-bottom: 2px;
}
.dash-mini-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.1;
}
.dash-mini-value--sm {
  font-size: 1.05rem;
}

/* ── Last Result ── */
.dash-last-result {
  background: linear-gradient(135deg, rgba(30,41,59,0.95), rgba(51,65,85,0.92));
  border: 1px solid rgba(255,255,255,0.08);
  color: white;
}
.dash-last-result .dash-card-title { color: rgba(255,255,255,0.5); }
.last-result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.last-result-team {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  min-width: 0;
}
.last-result-team--right {
  justify-content: flex-end;
}
.last-result-score {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.score-num {
  font-size: 1.4rem;
  font-weight: 900;
  color: white;
}
.score-sep {
  font-size: 1rem;
  color: rgba(255,255,255,0.3);
  font-weight: 700;
}

/* ── Horizontal Bar Chart ── */
.chart-hbar {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px 0;
}
.hbar-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 8px;
  border-radius: 10px;
  transition: background 0.15s;
  position: relative;
  cursor: default;
}
.hbar-row--active { background: rgba(0,0,0,0.04); }
.hbar-row--dim .hbar-fill { opacity: 0.3; }
.hbar-row--dim .hbar-label,
.hbar-row--dim .hbar-val  { opacity: 0.45; }
.hbar-rank {
  font-size: 0.68rem;
  font-weight: 800;
  color: #94a3b8;
  width: 14px;
  flex-shrink: 0;
  text-align: center;
}
.hbar-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: #334155;
  width: 72px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
  transition: opacity 0.15s;
}
.hbar-track {
  flex: 1;
  height: 10px;
  background: rgba(0,0,0,0.05);
  border-radius: 99px;
  overflow: hidden;
}
.hbar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.7s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.2s;
}
.hbar-val {
  font-size: 0.72rem;
  font-weight: 700;
  width: 42px;
  text-align: right;
  flex-shrink: 0;
  transition: opacity 0.15s;
}
.hbar-tooltip {
  position: absolute;
  left: 50%;
  top: calc(100% + 6px);
  transform: translateX(-50%);
  background: #1e293b;
  color: #fff;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 0.76rem;
  white-space: nowrap;
  pointer-events: none;
  z-index: 30;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.08);
}

/* ── Origen Ingresos Mini ── */
.origen-chart {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0;
}
.origen-legend {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.origen-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.76rem;
}
.origen-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.origen-name {
  flex: 1;
  color: #334155;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.origen-pct {
  color: #64748b;
  font-weight: 700;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .next-game-matchup { gap: 12px; }
  .next-game-team { min-width: 80px; }
  .team-badge { width: 44px; height: 44px; font-size: 1rem; border-radius: 12px; }
  .next-game-vs { width: 34px; height: 34px; font-size: 0.85rem; }
  .season-stat-val { font-size: 1.2rem; }
  .last-result-team span { font-size: 0.7rem; }
}
</style>
