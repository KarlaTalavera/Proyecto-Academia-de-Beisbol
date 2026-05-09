<template>
  <div>
    <div class="page-header d-flex align-items-center justify-content-between mb-4">
      <div>
        <h2 class="page-title">Jugadores de Mi Equipo</h2>
        <p class="page-subtitle">Gestiona los jugadores de tu equipo</p>
      </div>
      <button class="btn btn-primary d-flex align-items-center gap-2" @click="abrirFormulario()">
        <IconPlus :size="18" stroke-width="2" /> Nuevo Jugador
      </button>
    </div>

    <!-- Tabla -->
    <div class="card">
      <div class="card-header d-flex align-items-center gap-2 flex-wrap">
        <div class="input-group input-group-sm" style="max-width:260px;">
          <span class="input-group-text" style="background:transparent;">
            <IconSearch :size="14" class="text-muted" />
          </span>
          <input v-model="busqueda" class="form-control" placeholder="Buscar jugador..." style="border-left:none;" />
        </div>
        <span class="ms-auto text-muted" style="font-size:0.8rem;">{{ jugadoresFiltrados.length }} jugador(es)</span>
      </div>

      <div class="table-responsive">
        <table class="table table-vcenter card-table">
          <thead>
            <tr>
              <th>Jugador</th>
              <th>Posición</th>
              <th>Rol</th>
              <th>Brazo Dom.</th>
              <th>Estado</th>
              <th style="width:100px;"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="cargando">
              <td colspan="6" class="text-center py-5">
                <span class="spinner-border spinner-border-sm text-primary me-2"></span> Cargando...
              </td>
            </tr>
            <tr v-else-if="!jugadoresFiltrados.length">
              <td colspan="6" class="text-center py-5 text-muted">
                <IconUsers :size="32" stroke-width="1.2" class="mb-2 d-block mx-auto" style="opacity:0.3;" />
                No hay jugadores
              </td>
            </tr>
            <tr v-for="j in jugadoresFiltrados" :key="j.id_jugador">
              <td>
                <div class="d-flex align-items-center gap-3">
                  <div v-if="j.foto_url" class="jugador-avatar">
                    <img :src="j.foto_url" alt="Foto" />
                  </div>
                  <div v-else class="jugador-avatar-placeholder">
                    {{ j.nombre?.charAt(0)?.toUpperCase() }}{{ j.apellido?.charAt(0)?.toUpperCase() }}
                  </div>
                  <div>
                    <div class="fw-semibold">{{ j.nombre }} {{ j.apellido }}</div>
                    <div class="text-muted" style="font-size:0.75rem;">{{ formatFecha(j.fecha_nacimiento) }}</div>
                  </div>
                </div>
              </td>
              <td>{{ j.posicion }}</td>
              <td>
                <span class="badge" :class="j.rol === 'bateador' ? 'bg-blue-lt text-blue' : 'bg-orange-lt text-orange'">
                  {{ j.rol }}
                </span>
              </td>
              <td>{{ j.brazo_dominante || '—' }}</td>
              <td>
                <span class="badge" :class="j.activo ? 'bg-success-lt text-success' : 'bg-danger-lt text-danger'">
                  {{ j.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <div class="d-flex gap-1">
                  <button class="btn btn-sm btn-ghost-secondary" @click="abrirEditar(j)" title="Editar">
                    <IconEdit :size="14" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal formulario -->
    <div v-if="modalForm" class="modal modal-blur show d-block" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editando ? 'Editar Jugador' : 'Nuevo Jugador' }}</h5>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>
          <form @submit.prevent="guardarJugador">
            <div class="modal-body">
              <div v-if="errorForm" class="alert alert-danger py-2 mb-3">{{ errorForm }}</div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label required">Nombre</label>
                  <input v-model="form.nombre" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label required">Apellido</label>
                  <input v-model="form.apellido" class="form-control" required />
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label required">Fecha de Nacimiento</label>
                  <input v-model="form.fecha_nacimiento" type="date" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label required">Cédula</label>
                  <input v-model="form.cedula" class="form-control" />
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 mb-3">
                  <label class="form-label required">Rol</label>
                  <select v-model="form.rol" class="form-select" required>
                    <option value="bateador">Bateador</option>
                    <option value="pitcher">Pitcher</option>
                    <option value="utilidad">Utilidad</option>
                  </select>
                </div>
                <div class="col-md-4 mb-3">
                  <label class="form-label required">Posición</label>
                  <select v-model="form.posicion" class="form-select" required>
                    <option value="P">P</option>
                    <option value="C">C</option>
                    <option value="1B">1B</option>
                    <option value="2B">2B</option>
                    <option value="3B">3B</option>
                    <option value="SS">SS</option>
                    <option value="LF">LF</option>
                    <option value="CF">CF</option>
                    <option value="RF">RF</option>
                    <option value="DH">DH</option>
                    <option value="UT">UT</option>
                  </select>
                </div>
                <div class="col-md-4 mb-3">
                  <label class="form-label">Brazo Dominante</label>
                  <select v-model="form.brazo_dominante" class="form-select">
                    <option value="">— Seleccionar —</option>
                    <option value="derecho">Derecho</option>
                    <option value="izquierdo">Izquierdo</option>
                    <option value="ambidiestro">Ambidiestro</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-ghost-secondary me-auto" @click="cerrarModal">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="guardando">
                {{ guardando ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div v-if="modalForm" class="modal-backdrop show"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/store/auth'
import { useToast } from '@/composables/useToast'
import { IconSearch, IconUsers, IconPlus, IconEdit } from '@tabler/icons-vue'

const auth = useAuthStore()
const toast = useToast()

const jugadores = ref([])
const busqueda = ref('')
const cargando = ref(false)
const modalForm = ref(false)
const editando = ref(false)
const guardando = ref(false)
const errorForm = ref('')
const form = ref({
  nombre: '',
  apellido: '',
  fecha_nacimiento: '',
  cedula: '',
  rol: 'bateador',
  posicion: 'UT',
  brazo_dominante: ''
})

const jugadoresFiltrados = computed(() =>
  jugadores.value.filter(j =>
    `${j.nombre} ${j.apellido}`.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

function abrirFormulario() {
  form.value = {
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    cedula: '',
    rol: 'bateador',
    posicion: 'UT',
    brazo_dominante: ''
  }
  editando.value = false
  errorForm.value = ''
  modalForm.value = true
}

function abrirEditar(jugador) {
  form.value = { ...jugador }
  editando.value = true
  errorForm.value = ''
  modalForm.value = true
}

function cerrarModal() {
  modalForm.value = false
}

async function guardarJugador() {
  errorForm.value = ''
  guardando.value = true
  try {
    if (editando.value) {
      await api.put(`/dueno/jugadores/${form.value.id_jugador}`, form.value)
      toast.success('Jugador actualizado')
    } else {
      // Para crear, usar el endpoint general pero filtrar
      await api.post('/jugadores', { ...form.value, id_equipo: auth.id_equipo })
      toast.success('Jugador creado')
    }
    modalForm.value = false
    await cargar()
  } catch (e) {
    errorForm.value = e.response?.data?.error || 'Error al guardar'
  } finally {
    guardando.value = false
  }
}

async function cargar() {
  cargando.value = true
  try {
    const { data } = await api.get('/dueno/jugadores')
    jugadores.value = data
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

<style scoped>
.jugador-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.jugador-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.jugador-avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #6366f1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
  flex-shrink: 0;
}
</style>