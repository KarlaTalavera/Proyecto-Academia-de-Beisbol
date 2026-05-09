<template>
  <div>
    <div class="page-header d-flex align-items-center justify-content-between mb-4">
      <div>
        <h2 class="page-title">Dashboard de Dueño</h2>
        <p class="page-subtitle">Estadísticas y resumen de tu equipo</p>
      </div>
    </div>

    <!-- Estadísticas del equipo -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card stat-card">
          <div class="card-body text-center">
            <div class="stat-icon">
              <IconUsers :size="32" />
            </div>
            <div class="stat-number">{{ equipoStats.jugadores }}</div>
            <div class="stat-label">Jugadores</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stat-card">
          <div class="card-body text-center">
            <div class="stat-icon">
              <IconCalendarEvent :size="32" />
            </div>
            <div class="stat-number">{{ equipoStats.partidos }}</div>
            <div class="stat-label">Partidos</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stat-card">
          <div class="card-body text-center">
            <div class="stat-icon">
              <IconTrophy :size="32" />
            </div>
            <div class="stat-number">{{ equipoStats.victorias }}</div>
            <div class="stat-label">Victorias</div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stat-card">
          <div class="card-body text-center">
            <div class="stat-icon">
              <IconAlertTriangle :size="32" />
            </div>
            <div class="stat-number">{{ equipoStats.sanciones }}</div>
            <div class="stat-label">Sanciones</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Próximos partidos -->
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="card-title">Próximos Partidos</h5>
      </div>
      <div class="card-body">
        <div v-if="proximosPartidos.length === 0" class="text-center py-4 text-muted">
          No hay partidos programados
        </div>
        <div v-else class="table-responsive">
          <table class="table table-vcenter">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Equipo Local</th>
                <th>Equipo Visitante</th>
                <th>Lugar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in proximosPartidos" :key="p.id_partido">
                <td>{{ formatFecha(p.fecha_juego) }}</td>
                <td>{{ p.hora_juego }}</td>
                <td>{{ p.equipo_casa }}</td>
                <td>{{ p.equipo_visitante }}</td>
                <td>{{ p.lugar || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Jugadores destacados -->
    <div class="card">
      <div class="card-header">
        <h5 class="card-title">Jugadores de tu Equipo</h5>
      </div>
      <div class="card-body">
        <div v-if="jugadores.length === 0" class="text-center py-4 text-muted">
          No hay jugadores registrados
        </div>
        <div v-else class="row g-3">
          <div v-for="j in jugadores.slice(0, 6)" :key="j.id_jugador" class="col-md-4">
            <div class="card player-card">
              <div class="card-body text-center">
                <div class="player-avatar">{{ j.nombre.charAt(0) }}{{ j.apellido.charAt(0) }}</div>
                <h6 class="player-name">{{ j.nombre }} {{ j.apellido }}</h6>
                <div class="player-pos">{{ j.posicion }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/store/auth'
import { IconUsers, IconCalendarEvent, IconTrophy, IconAlertTriangle } from '@tabler/icons-vue'

const auth = useAuthStore()

const equipoStats = ref({
  jugadores: 0,
  partidos: 0,
  victorias: 0,
  sanciones: 0
})

const proximosPartidos = ref([])
const jugadores = ref([])

onMounted(async () => {
  await cargarEstadisticas()
  await cargarProximosPartidos()
  await cargarJugadores()
})

async function cargarEstadisticas() {
  try {
    // Obtener datos del equipo
    const equipoRes = await api.get('/dueno/equipo')
    // Obtener partidos
    const partidosRes = await api.get('/dueno/partidos')
    // Obtener sanciones
    const sancionesRes = await api.get('/dueno/sanciones')

    equipoStats.value.jugadores = (await api.get('/dueno/jugadores')).data.length
    equipoStats.value.partidos = partidosRes.data.length
    equipoStats.value.victorias = partidosRes.data.filter(p => p.estado === 'finalizado' && /* lógica para victoria */ true).length // Ajustar lógica
    equipoStats.value.sanciones = sancionesRes.data.length
  } catch (e) {
    console.error('Error cargando estadísticas:', e)
  }
}

async function cargarProximosPartidos() {
  try {
    const { data } = await api.get('/dueno/partidos')
    proximosPartidos.value = data.filter(p => p.estado === 'programado').slice(0, 5)
  } catch (e) {
    console.error('Error cargando partidos:', e)
  }
}

async function cargarJugadores() {
  try {
    const { data } = await api.get('/dueno/jugadores')
    jugadores.value = data
  } catch (e) {
    console.error('Error cargando jugadores:', e)
  }
}

function formatFecha(f) {
  return new Date(f).toLocaleDateString('es-VE')
}
</script>

<style scoped>
.stat-card {
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-icon {
  color: #6366f1;
  margin-bottom: 0.5rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #1e293b;
}

.stat-label {
  color: #64748b;
  font-size: 0.875rem;
}

.player-card {
  border: 1px solid #e2e8f0;
}

.player-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #6366f1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin: 0 auto 0.5rem;
}

.player-name {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.player-pos {
  font-size: 0.75rem;
  color: #64748b;
}
</style>