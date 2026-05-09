<template>
  <div>
    <div class="page-header d-flex align-items-center justify-content-between mb-4">
      <div>
        <h2 class="page-title">Mi Equipo</h2>
        <p class="page-subtitle">Información y detalles de tu equipo</p>
      </div>
    </div>

    <div v-if="equipo" class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-md-4 text-center">
            <img v-if="equipo.logo_url" :src="equipo.logo_url" alt="Logo" class="equipo-logo mb-3" />
            <div v-else class="equipo-logo-placeholder mb-3">
              <IconShield :size="64" />
            </div>
            <h4>{{ equipo.nombre_equipo }}</h4>
          </div>
          <div class="col-md-8">
            <div class="row g-3">
              <div class="col-sm-6">
                <strong>Entrenador:</strong> {{ equipo.entrenador }}
              </div>
              <div class="col-sm-6">
                <strong>Responsable:</strong> {{ equipo.responsable }}
              </div>
              <div class="col-sm-6">
                <strong>Email:</strong> {{ equipo.email || 'No especificado' }}
              </div>
              <div class="col-sm-6">
                <strong>Teléfono:</strong> {{ equipo.telefono || 'No especificado' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <IconLoader class="spinner-border text-primary" :size="32" />
      <p class="mt-2">Cargando información del equipo...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { IconShield, IconLoader } from '@tabler/icons-vue'

const equipo = ref(null)

onMounted(async () => {
  try {
    const { data } = await api.get('/dueno/equipo')
    equipo.value = data
  } catch (e) {
    console.error('Error cargando equipo:', e)
  }
})
</script>

<style scoped>
.equipo-logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
}

.equipo-logo-placeholder {
  width: 120px;
  height: 120px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  margin: 0 auto;
}
</style>