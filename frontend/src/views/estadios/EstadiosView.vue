<template>
  <div>
    <div class="page-header d-flex align-items-center justify-content-between mb-4">
      <div>
        <h2 class="page-title">Estadios</h2>
        <p class="page-subtitle">Gestión de estadios para la programación de partidos</p>
      </div>
      <button class="btn btn-primary d-flex align-items-center gap-2" @click="abrirModal()">
        <IconPlus :size="18" stroke-width="2" /> Nuevo Estadio
      </button>
    </div>

    <div class="card">
      <div class="card-header d-flex align-items-center gap-2">
        <div class="input-group input-group-sm" style="max-width:280px;">
          <span class="input-group-text" style="background:transparent;">
            <IconSearch :size="15" class="text-muted" />
          </span>
          <input v-model="busqueda" class="form-control" placeholder="Buscar estadio..." />
        </div>
        <span class="ms-auto text-muted" style="font-size:0.8rem;">{{ estadiosFiltrados.length }} estadio(s)</span>
      </div>

      <div class="table-responsive">
        <table class="table table-vcenter card-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ciudad</th>
              <th>Dirección</th>
              <th>Capacidad</th>
              <th>Activo</th>
              <th class="text-end" style="width:130px;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="cargando">
              <td colspan="6" class="text-center py-5">
                <span class="spinner-border spinner-border-sm text-primary me-2"></span>
                Cargando estadios...
              </td>
            </tr>
            <tr v-else-if="!estadiosFiltrados.length">
              <td colspan="6" class="text-center py-5 text-muted">
                <IconBuilding :size="32" stroke-width="1.2" class="mb-2" style="opacity:0.3;" />
                No hay estadios registrados
              </td>
            </tr>
            <tr v-for="estadio in estadiosFiltrados" :key="estadio.id_estadio">
              <td>{{ estadio.nombre }}</td>
              <td>{{ estadio.ciudad }}</td>
              <td>{{ estadio.direccion || '—' }}</td>
              <td>{{ estadio.capacidad || 0 }}</td>
              <td>{{ estadio.activo ? 'Sí' : 'No' }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-ghost-primary me-1" @click="abrirModal(estadio)" title="Editar">
                  <IconPencil :size="15" />
                </button>
                <button class="btn btn-sm btn-ghost-danger" @click="confirmarEliminar(estadio)" title="Eliminar">
                  <IconTrash :size="15" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="modalAbierto" class="modal modal-blur show d-block" tabindex="-1">
      <div class="modal-dialog modal-md modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="d-flex align-items-center gap-2">
              <div class="team-avatar" style="width:32px;height:32px;font-size:0.8rem;">
                {{ form.nombre?.charAt(0)?.toUpperCase() || '+' }}
              </div>
              <h5 class="modal-title mb-0">{{ editando ? 'Editar Estadio' : 'Nuevo Estadio' }}</h5>
            </div>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>
          <form @submit.prevent="guardar">
            <div class="modal-body">
              <div v-if="errorModal" class="alert alert-danger py-2 mb-3">{{ errorModal }}</div>
              <div class="mb-3">
                <label class="form-label fw-semibold" style="font-size:0.82rem;">Nombre <span class="text-danger">*</span></label>
                <input v-model="form.nombre" class="form-control" placeholder="Nombre del estadio" required />
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold" style="font-size:0.82rem;">Ciudad <span class="text-danger">*</span></label>
                <input v-model="form.ciudad" class="form-control" placeholder="Ciudad" required />
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold" style="font-size:0.82rem;">Dirección</label>
                <input v-model="form.direccion" class="form-control" placeholder="Dirección del estadio" />
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold" style="font-size:0.82rem;">Capacidad</label>
                  <input v-model.number="form.capacidad" type="number" min="0" class="form-control" placeholder="0" />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold" style="font-size:0.82rem;">Activo</label>
                  <select v-model="form.activo" class="form-select">
                    <option :value="1">Sí</option>
                    <option :value="0">No</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-ghost-secondary" @click="cerrarModal">Cancelar</button>
              <button type="submit" class="btn btn-primary d-flex align-items-center gap-2" :disabled="guardando">
                <span v-if="guardando" class="spinner-border spinner-border-sm"></span>
                <IconDeviceFloppy :size="16" />
                {{ guardando ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div v-if="modalAbierto" class="modal-backdrop show"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/store/auth'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import {
  IconPlus, IconSearch, IconPencil, IconTrash, IconDeviceFloppy, IconBuilding,
} from '@tabler/icons-vue'

const toast = useToast()
const confirm = useConfirm()
const auth = useAuthStore()

const estadios = ref([])
const busqueda = ref('')
const cargando = ref(false)
const modalAbierto = ref(false)
const editando = ref(false)
const guardando = ref(false)
const errorModal = ref('')
const form = ref({ nombre: '', ciudad: '', direccion: '', capacidad: 0, activo: 1 })

const estadiosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  return estadios.value.filter(e =>
    e.nombre.toLowerCase().includes(q) ||
    e.ciudad.toLowerCase().includes(q) ||
    (e.direccion || '').toLowerCase().includes(q)
  )
})

async function cargarEstadios() {
  cargando.value = true
  try {
    const { data } = await api.get('/estadios')
    estadios.value = data
  } finally {
    cargando.value = false
  }
}

function abrirModal(estadio = null) {
  errorModal.value = ''
  if (estadio) {
    editando.value = true
    form.value = { ...estadio }
  } else {
    editando.value = false
    form.value = { nombre: '', ciudad: '', direccion: '', capacidad: 0, activo: 1 }
  }
  modalAbierto.value = true
}

function cerrarModal() {
  modalAbierto.value = false
}

async function guardar() {
  if (!form.value.nombre.trim() || !form.value.ciudad.trim()) {
    errorModal.value = 'Nombre y ciudad son obligatorios.'
    return
  }
  guardando.value = true
  errorModal.value = ''
  try {
    if (editando.value) {
      await api.put(`/estadios/${form.value.id_estadio}`, form.value)
    } else {
      await api.post('/estadios', form.value)
    }
    cerrarModal()
    cargarEstadios()
  } catch (e) {
    errorModal.value = e.response?.data?.error || 'Error al guardar el estadio'
  } finally {
    guardando.value = false
  }
}

async function confirmarEliminar(estadio) {
  const ok = await confirm.pedir(`¿Eliminar el estadio ${estadio.nombre}?`, { titulo: 'Eliminar estadio', variante: 'danger' })
  if (!ok) return
  await api.delete(`/estadios/${estadio.id_estadio}`)
  cargarEstadios()
}

onMounted(() => {
  if (!auth.esAdmin) return
  cargarEstadios()
})
</script>

<style scoped>
.page-header { gap: 1rem; }
</style>
