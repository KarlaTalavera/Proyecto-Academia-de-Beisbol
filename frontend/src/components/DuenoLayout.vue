<template>
  <div class="page">

    <!-- ===== SIDEBAR ===== -->
    <aside class="navbar navbar-vertical navbar-expand-lg">
      <div class="container-fluid flex-column h-100" style="padding: 0;">

        <!-- Brand -->
        <RouterLink class="navbar-brand d-flex align-items-center gap-2 text-decoration-none" to="/">
          <img src="/logos/logorepor.png" class="brand-logo" alt="Liga Diamante" />
          <div class="brand-text">
            <strong>Liga Diamante</strong>
            <span>Sistema de Gestión</span>
          </div>
        </RouterLink>

        <!-- Nav -->
        <div class="navbar-collapse collapse show flex-column flex-grow-1 overflow-auto" id="sidebar-menu">
          <ul class="navbar-nav w-100">

            <li class="nav-section-label">Principal</li>

            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'DuenoDashboard' }" active-class="">
                <span class="nav-link-icon"><IconLayoutDashboard :size="20" stroke-width="1.7" /></span>
                <span class="nav-link-title">Dashboard</span>
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'DuenoEquipo' }">
                <span class="nav-link-icon"><IconShield :size="20" stroke-width="1.7" /></span>
                <span class="nav-link-title">Mi Equipo</span>
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'DuenoJugadores' }">
                <span class="nav-link-icon"><IconUsers :size="20" stroke-width="1.7" /></span>
                <span class="nav-link-title">Jugadores</span>
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'DuenoPartidos' }">
                <span class="nav-link-icon"><IconCalendarEvent :size="20" stroke-width="1.7" /></span>
                <span class="nav-link-title">Partidos</span>
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'DuenoReportes' }">
                <span class="nav-link-icon"><IconChartBar :size="20" stroke-width="1.7" /></span>
                <span class="nav-link-title">Reportes</span>
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'DuenoSanciones' }">
                <span class="nav-link-icon"><IconGavel :size="20" stroke-width="1.7" /></span>
                <span class="nav-link-title">Sanciones</span>
              </RouterLink>
            </li>

          </ul>
        </div>

        <!-- User card bottom -->
        <div class="w-100 pb-2">
          <div class="sidebar-user">
            <div class="user-avatar">{{ inicialNombre }}</div>
            <div class="user-info">
              <div class="user-name">{{ auth.nombre }}</div>
              <div class="user-role">{{ etiquetaRol }}</div>
            </div>
            <button class="btn-logout" @click="cerrarSesion" title="Cerrar sesión">
              <IconLogout :size="18" stroke-width="1.7" />
            </button>
          </div>
        </div>

      </div>
    </aside>

    <!-- ===== PAGE WRAPPER ===== -->
    <div class="page-wrapper">

      <!-- Top header -->
      <div class="top-header d-none d-lg-flex">
        <div class="top-greeting">
          Bienvenido de vuelta, <strong>{{ auth.nombre }}</strong> 👋
        </div>
        <div class="top-user-info">
          <div class="user-date">{{ fechaHoy }}</div>
          <div class="user-role-badge">{{ etiquetaRol }}</div>
        </div>
      </div>

      <!-- Page content -->
      <div class="page-body">
        <div class="container-fluid">
          <RouterView />
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import {
  IconLayoutDashboard,
  IconShield,
  IconUsers,
  IconCalendarEvent,
  IconChartBar,
  IconGavel,
  IconLogout
} from '@tabler/icons-vue'

const auth = useAuthStore()
const router = useRouter()

const inicialNombre = computed(() => auth.nombre?.charAt(0)?.toUpperCase() || '?')

const etiquetaRol = computed(() => {
  const roles = {
    administrador: 'Administrador',
    dueno: 'Dueño de Equipo',
    caja: 'Caja',
    anotador: 'Anotador',
    publico: 'Público'
  }
  return roles[auth.rol] || 'Usuario'
})

const fechaHoy = computed(() => {
  return new Date().toLocaleDateString('es-VE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

function cerrarSesion() {
  auth.logout()
  router.push({ name: 'LandingInicio' })
}
</script>

<style scoped>
/* Copiar estilos de AppLayout.vue si es necesario */
</style>