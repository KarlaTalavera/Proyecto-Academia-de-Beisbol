<template>
  <div>
    <div class="page-header d-flex align-items-center justify-content-between mb-4">
      <div>
        <h2 class="page-title">Sanciones de Mi Equipo</h2>
        <p class="page-subtitle">Historial de sanciones de jugadores y equipo</p>
      </div>
    </div>

    <!-- Tabla -->
    <div class="card">
      <div class="card-header d-flex align-items-center gap-2 flex-wrap">
        <div class="input-group input-group-sm" style="max-width:260px;">
          <span class="input-group-text" style="background:transparent;">
            <IconSearch :size="14" class="text-muted" />
          </span>
          <input v-model="busqueda" class="form-control" placeholder="Buscar sanción..." style="border-left:none;" />
        </div>
        <span class="ms-auto text-muted" style="font-size:0.8rem;">{{ sancionesFiltradas.length }} sanción(es)</span>
      </div>

      <div class="table-responsive">
        <table class="table table-vcenter card-table">
          <thead>
            <tr>
              <th>Jugador</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="cargando">
              <td colspan="5" class="text-center py-5">
                <span class="spinner-border spinner-border-sm text-primary me-2"></span> Cargando...
              </td>
            </tr>
            <tr v-else-if="!sancionesFiltradas.length">
              <td colspan="5" class="text-center py-5 text-muted">
                <IconAlertTriangle :size="32" stroke-width="1.2" class="mb-2 d-block mx-auto" style="opacity:0.3;" />
                No hay sanciones
              </td>
            </tr>
            <tr v-for="s in sancionesFiltradas" :key="s.id_sancion">
              <td>{{ s.nombre_jugador || 'Equipo' }}</td>
              <td>{{ s.tipo_sancion }}</td>
              <td>{{ s.descripcion }}</td>
              <td>{{ formatFecha(s.fecha_sancion) }}</td>
              <td>
                <span class="badge" :class="s.estado === 'activa' ? 'bg-danger-lt text-danger' : 'bg-success-lt text-success'">
                  {{ s.estado }}
                </span>
              </td>
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
import { IconSearch, IconAlertTriangle } from '@tabler/icons-vue'

const sanciones = ref([])
const busqueda = ref('')
const cargando = ref(false)

const sancionesFiltradas = computed(() =>
  sanciones.value.filter(s =>
    `${s.nombre_jugador} ${s.tipo_sancion} ${s.descripcion}`.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

async function cargar() {
  cargando.value = true
  try {
    const { data } = await api.get('/dueno/sanciones')
    sanciones.value = data
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