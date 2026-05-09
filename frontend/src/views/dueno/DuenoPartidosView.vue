<template>
  <div>
    <div class="page-header d-flex align-items-center justify-content-between mb-4">
      <div>
        <h2 class="page-title">Partidos de Mi Equipo</h2>
        <p class="page-subtitle">Historial y próximos partidos</p>
      </div>
    </div>

    <!-- Tabla -->
    <div class="card">
      <div class="card-header d-flex align-items-center gap-2 flex-wrap">
        <div class="input-group input-group-sm" style="max-width:260px;">
          <span class="input-group-text" style="background:transparent;">
            <IconSearch :size="14" class="text-muted" />
          </span>
          <input v-model="busqueda" class="form-control" placeholder="Buscar partido..." style="border-left:none;" />
        </div>
        <select v-model="filtroEstado" class="form-select form-select-sm" style="max-width:150px;">
          <option value="">Todos</option>
          <option value="programado">Programados</option>
          <option value="en_curso">En Curso</option>
          <option value="finalizado">Finalizados</option>
          <option value="suspendido">Suspendidos</option>
        </select>
        <span class="ms-auto text-muted" style="font-size:0.8rem;">{{ partidosFiltrados.length }} partido(s)</span>
      </div>

      <div class="table-responsive">
        <table class="table table-vcenter card-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Equipos</th>
              <th>Estado</th>
              <th>Resultado</th>
              <th>Lugar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="cargando">
              <td colspan="6" class="text-center py-5">
                <span class="spinner-border spinner-border-sm text-primary me-2"></span> Cargando...
              </td>
            </tr>
            <tr v-else-if="!partidosFiltrados.length">
              <td colspan="6" class="text-center py-5 text-muted">
                <IconCalendarEvent :size="32" stroke-width="1.2" class="mb-2 d-block mx-auto" style="opacity:0.3;" />
                No hay partidos
              </td>
            </tr>
            <tr v-for="p in partidosFiltrados" :key="p.id_partido">
              <td>{{ formatFecha(p.fecha_juego) }}</td>
              <td>{{ p.hora_juego }}</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <strong>{{ p.equipo_casa }}</strong> vs <strong>{{ p.equipo_visitante }}</strong>
                </div>
              </td>
              <td>
                <span class="badge" :class="getEstadoClass(p.estado)">
                  {{ getEstadoLabel(p.estado) }}
                </span>
              </td>
              <td>
                <span v-if="p.estado === 'finalizado'">
                  {{ p.carreras_home }} - {{ p.carreras_visitantes }}
                </span>
                <span v-else>—</span>
              </td>
              <td>{{ p.lugar || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { IconSearch, IconCalendarEvent } from '@tabler/icons-vue'

const partidos = ref([])
const busqueda = ref('')
const filtroEstado = ref('')
const cargando = ref(false)

const partidosFiltrados = computed(() =>
  partidos.value.filter(p => {
    const matchBusqueda = `${p.equipo_casa} ${p.equipo_visitante}`.toLowerCase().includes(busqueda.value.toLowerCase())
    const matchEstado = !filtroEstado.value || p.estado === filtroEstado.value
    return matchBusqueda && matchEstado
  })
)

function getEstadoClass(estado) {
  const classes = {
    programado: 'bg-blue-lt text-blue',
    en_curso: 'bg-yellow-lt text-yellow',
    finalizado: 'bg-green-lt text-green',
    suspendido: 'bg-red-lt text-red'
  }
  return classes[estado] || 'bg-secondary-lt text-secondary'
}

function getEstadoLabel(estado) {
  const labels = {
    programado: 'Programado',
    en_curso: 'En Curso',
    finalizado: 'Finalizado',
    suspendido: 'Suspendido'
  }
  return labels[estado] || estado
}

async function cargar() {
  cargando.value = true
  try {
    const { data } = await api.get('/dueno/partidos')
    partidos.value = data
  } finally {
    cargando.value = false
  }
}

function formatFecha(f) {
  if (!f) return '—'
  return new Date(f).toLocaleDateString('es-VE')
}

onMounted(cargar)
</script>