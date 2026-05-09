<template>
  <div>
    <div class="page-header d-flex align-items-center justify-content-between mb-4">
      <div>
        <h2 class="page-title">Reportes de Mi Equipo</h2>
        <p class="page-subtitle">Estadísticas y análisis de rendimiento</p>
      </div>
    </div>

    <!-- Estadísticas básicas -->
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div class="card stat-card">
          <div class="card-body text-center">
            <div class="stat-icon">
              <IconTrophy :size="32" />
            </div>
            <div class="stat-number">{{ stats.victorias }}</div>
            <div class="stat-label">Victorias</div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card stat-card">
          <div class="card-body text-center">
            <div class="stat-icon">
              <IconX :size="32" />
            </div>
            <div class="stat-number">{{ stats.derrotas }}</div>
            <div class="stat-label">Derrotas</div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card stat-card">
          <div class="card-body text-center">
            <div class="stat-icon">
              <IconTarget :size="32" />
            </div>
            <div class="stat-number">{{ stats.porcentaje }}</div>
            <div class="stat-label">Porcentaje</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Jugadores con mejores estadísticas -->
    <div class="card">
      <div class="card-header">
        <h5 class="card-title">Mejores Jugadores</h5>
      </div>
      <div class="card-body">
        <div v-if="jugadores.length === 0" class="text-center py-4 text-muted">
          No hay datos disponibles
        </div>
        <div v-else class="table-responsive">
          <table class="table table-vcenter">
            <thead>
              <tr>
                <th>Jugador</th>
                <th>Posición</th>
                <th>AVG</th>
                <th>HR</th>
                <th>RBI</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="j in jugadores.slice(0, 10)" :key="j.id_jugador">
                <td>{{ j.nombre }} {{ j.apellido }}</td>
                <td>{{ j.posicion }}</td>
                <td>{{ j.avg || '—' }}</td>
                <td>{{ j.hr || 0 }}</td>
                <td>{{ j.rbi || 0 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { IconTrophy, IconX, IconTarget } from '@tabler/icons-vue'

const stats = ref({
  victorias: 0,
  derrotas: 0,
  porcentaje: '0%'
})

const jugadores = ref([])

onMounted(async () => {
  await cargarStats()
  await cargarJugadores()
})

async function cargarStats() {
  try {
    const { data: partidos } = await api.get('/dueno/partidos')
    const finalizados = partidos.filter(p => p.estado === 'finalizado')
    stats.value.victorias = finalizados.filter(p => /* lógica para determinar victoria */ true).length // Ajustar
    stats.value.derrotas = finalizados.length - stats.value.victorias
    stats.value.porcentaje = finalizados.length > 0 ? ((stats.value.victorias / finalizados.length) * 100).toFixed(1) + '%' : '0%'
  } catch (e) {
    console.error('Error cargando stats:', e)
  }
}

async function cargarJugadores() {
  try {
    const { data } = await api.get('/dueno/jugadores')
    // Aquí podrías agregar lógica para calcular estadísticas reales
    jugadores.value = data.map(j => ({ ...j, avg: '—', hr: 0, rbi: 0 })) // Placeholder
  } catch (e) {
    console.error('Error cargando jugadores:', e)
  }
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
</style>