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
              <RouterLink class="nav-link" :to="{ name: 'Dashboard' }" active-class="">
                <span class="nav-link-icon"><IconLayoutDashboard :size="20" stroke-width="1.7" /></span>
                <span class="nav-link-title">Dashboard</span>
              </RouterLink>
            </li>

            <li v-if="auth.puedeVerGestion" class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'Equipos' }">
                <span class="nav-link-icon"><IconShield :size="20" stroke-width="1.7" /></span>
                <span class="nav-link-title">Equipos</span>
              </RouterLink>
            </li>

            <li v-if="auth.puedeVerGestion" class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'Jugadores' }">
                <span class="nav-link-icon"><IconUsers :size="20" stroke-width="1.7" /></span>
                <span class="nav-link-title">Jugadores</span>
              </RouterLink>
            </li>

            <li v-if="auth.puedeVerGestion || auth.puedeTaquilla" class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'Partidos' }">
                <span class="nav-link-icon"><IconCalendarEvent :size="20" stroke-width="1.7" /></span>
                <span class="nav-link-title">Partidos</span>
              </RouterLink>
            </li>

            <li v-if="auth.puedeVerReportes" class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'Reportes' }">
                <span class="nav-link-icon"><IconChartBar :size="20" stroke-width="1.7" /></span>
                <span class="nav-link-title">Reportes</span>
              </RouterLink>
            </li>

            <li v-if="auth.puedeVerSanciones" class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'Sanciones' }">
                <span class="nav-link-icon"><IconGavel :size="20" stroke-width="1.7" /></span>
                <span class="nav-link-title">Sanciones</span>
              </RouterLink>
            </li>

            <!-- Administración -->
            <template v-if="auth.puedeFinanzas || auth.esAdmin">
              <li class="nav-section-label mt-1">Administración</li>
            </template>

            <template v-if="auth.puedeFinanzas">
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'Ingresos' }">
                  <span class="nav-link-icon"><IconWallet :size="20" stroke-width="1.7" /></span>
                  <span class="nav-link-title">Finanzas</span>
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'Proveedores' }">
                  <span class="nav-link-icon"><IconBuildingStore :size="20" stroke-width="1.7" /></span>
                  <span class="nav-link-title">Proveedores</span>
                </RouterLink>
              </li>
            </template>

            <template v-if="auth.puedeEditar">
              <li v-if="!auth.esDueno" class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'Inscripciones' }">
                  <span class="nav-link-icon"><IconClipboardCheck :size="20" stroke-width="1.7" /></span>
                  <span class="nav-link-title">Inscripciones</span>
                </RouterLink>
              </li>
              <li v-if="!auth.esDueno" class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'NoticiasAdmin' }">
                  <span class="nav-link-icon"><IconNews :size="20" stroke-width="1.7" /></span>
                  <span class="nav-link-title">Noticias</span>
                </RouterLink>
              </li>
            </template>

            <template v-if="auth.esAdmin">
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'Temporadas' }">
                  <span class="nav-link-icon"><IconCalendar :size="20" stroke-width="1.7" /></span>
                  <span class="nav-link-title">Temporadas</span>
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'Usuarios' }">
                  <span class="nav-link-icon"><IconUsersGroup :size="20" stroke-width="1.7" /></span>
                  <span class="nav-link-title">Usuarios</span>
                </RouterLink>
              </li>
            </template>

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

          <!-- Campana de notificaciones -->
          <div v-if="auth.puedeFinanzas || auth.esAdmin" class="notif-wrapper me-2">
            <!-- Icono campana -->
            <div class="notif-bell" @click="toggleNotificaciones">
              <IconBell :size="22" stroke-width="1.7" />
              <span v-if="noLeidas > 0" class="notif-badge">
                {{ noLeidas > 9 ? '9+' : noLeidas }}
              </span>
            </div>

            <!-- Dropdown -->
            <div v-if="mostrarNotificaciones" class="notif-dropdown shadow" @click.stop>
              <div class="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
                <span class="fw-semibold" style="font-size:0.85rem;">Notificaciones</span>
                <button class="btn btn-xs btn-ghost-secondary" style="font-size:0.72rem;" @click="marcarTodasLeidas">
                  Marcar todo leído
                </button>
              </div>
              <div class="notif-list">
                <div v-if="!notificaciones.length" class="text-center text-muted py-4">
                  <IconBell :size="28" stroke-width="1.2" style="opacity:0.3;" />
                  <div style="font-size:0.82rem; margin-top:6px;">No tienes notificaciones por ahora</div>
                </div>
                <div v-for="n in notificaciones" :key="n.id"
                  class="notif-item px-3 py-2"
                  :class="{ 'notif-no-leida': !n.leida }"
                  @click="marcarLeida(n)">
                  <div class="fw-semibold" style="font-size:0.8rem;">{{ n.titulo }}</div>
                  <div class="text-muted" style="font-size:0.75rem;">{{ n.mensaje }}</div>
                  <div class="text-muted" style="font-size:0.68rem; margin-top:2px;">{{ formatFechaNotif(n.created_at) }}</div>
                </div>
              </div>
            </div>

            <!-- Overlay para cerrar al hacer click afuera -->
            <div v-if="mostrarNotificaciones"
              class="position-fixed top-0 start-0 w-100 h-100"
              style="z-index:1000;"
              @click="mostrarNotificaciones = false">
            </div>
          </div>

          <span class="ms-2 badge" :class="badgeRol">{{ etiquetaRol }}</span>
          <span class="top-user-name">{{ auth.nombre }}</span>
          <div class="top-user-avatar">{{ inicialNombre }}</div>
        </div>
      </div>

      <!-- Page body -->
      <div class="page-body">
        <div class="container-xl py-3">
          <RouterView />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import api from '@/services/api'
import {
  IconLayoutDashboard, IconShield, IconUsers, IconCalendarEvent,
  IconWallet, IconChartBar, IconLogout, IconUsersGroup, IconCalendar,
  IconGavel, IconBuildingStore, IconClipboardCheck, IconNews, IconBell,
} from '@tabler/icons-vue'

const auth   = useAuthStore()
const router = useRouter()

const inicialNombre = computed(() => auth.nombre?.charAt(0)?.toUpperCase() || '?')

// ── Notificaciones ────────────────────────────────────────────
const notificaciones      = ref([])
const noLeidas            = ref(0)
const mostrarNotificaciones = ref(false)
let intervaloNotif = null

async function cargarNotificaciones() {
  if (!auth.puedeFinanzas && !auth.esAdmin) return
  const [resN, resC] = await Promise.all([
    api.get('/notificaciones'),
    api.get('/notificaciones/no-leidas'),
  ])
  notificaciones.value = resN.data
  noLeidas.value       = resC.data.total
}

function toggleNotificaciones() {
  mostrarNotificaciones.value = !mostrarNotificaciones.value
  if (mostrarNotificaciones.value) cargarNotificaciones()
}

async function marcarLeida(n) {
  if (n.leida) return
  await api.patch(`/notificaciones/${n.id}/leida`).catch(() => {})
  n.leida = true
  noLeidas.value = Math.max(0, noLeidas.value - 1)
}

async function marcarTodasLeidas() {
  await api.patch('/notificaciones/todas-leidas').catch(() => {})
  notificaciones.value.forEach(n => { n.leida = true })
  noLeidas.value = 0
}

function formatFechaNotif(f) {
  if (!f) return ''
  return new Date(f).toLocaleString('es-VE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  cargarNotificaciones()
  // Revisar notificaciones nuevas cada 60 segundos
  intervaloNotif = setInterval(cargarNotificaciones, 60_000)
})
onUnmounted(() => clearInterval(intervaloNotif))

const ETIQUETAS = {
  administrador: 'Administrador',
  dueno:         'Dueño',
  caja:          'Caja',
  anotador:      'Anotador',
  publico:       'Público',
}
const etiquetaRol = computed(() => ETIQUETAS[auth.rol] || auth.rol)

const badgeRol = computed(() => ({
  'bg-blue-lt text-blue':     auth.rol === 'administrador',
  'bg-indigo-lt text-indigo': auth.rol === 'anotador',
  'bg-green-lt text-green':   auth.rol === 'caja',
  'bg-orange-lt text-orange': auth.rol === 'dueno',
  'bg-secondary-lt':          auth.rol === 'publico',
}))

function cerrarSesion() {
  auth.logout()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.notif-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.notif-bell {
  position: relative;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: background 0.15s;
}
.notif-bell:hover { background: rgba(0,0,0,0.06); }
.notif-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 99px;
  line-height: 1.4;
}
.notif-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 340px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  z-index: 1001;
  overflow: hidden;
}
.notif-list {
  max-height: 360px;
  overflow-y: auto;
}
.notif-item {
  border-bottom: 1px solid rgba(0,0,0,0.05);
  cursor: pointer;
  transition: background 0.1s;
}
.notif-item:hover { background: #f8fafc; }
.notif-no-leida   { background: rgba(99,102,241,0.06); }
</style>
