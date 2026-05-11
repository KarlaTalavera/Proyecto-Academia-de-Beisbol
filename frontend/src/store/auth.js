import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user:   null,
    token:  localStorage.getItem('token')  || null,
    rol:    localStorage.getItem('rol')?.toLowerCase() || null,
    nombre: localStorage.getItem('nombre') || null,
    id_equipo: localStorage.getItem('id_equipo') || null,
  }),

  getters: {
    esAdmin: s => String(s.rol || '').toLowerCase() === 'administrador',
    esDueno: s => String(s.rol || '').toLowerCase() === 'dueno',
    esCaja: s => String(s.rol || '').toLowerCase() === 'caja',
    esAnotador: s => String(s.rol || '').toLowerCase() === 'anotador',
    puedeFinanzas: s => ['administrador', 'caja'].includes(String(s.rol || '').toLowerCase()),
    puedeVerReportes: s => ['administrador', 'dueno', 'caja'].includes(String(s.rol || '').toLowerCase()),
    // admin y dueno gestionan equipos, jugadores y programan partidos
    puedeEditar: s => ['administrador', 'dueno'].includes(String(s.rol || '').toLowerCase()),
    // admin, dueno y anotador pueden cambiar estado y reprogramar partidos
    puedeGestionarPartido: s => ['administrador', 'dueno', 'anotador'].includes(String(s.rol || '').toLowerCase()),
    // admin y anotador pueden gestionar sanciones
    puedeSancionar: s => ['administrador', 'anotador'].includes(String(s.rol || '').toLowerCase()),
    // admin, dueno y anotador pueden cargar lineup, resultado y estadísticas de un partido
    puedeAnotar: s => ['administrador', 'dueno', 'anotador'].includes(String(s.rol || '').toLowerCase()),
    // caja, admin y dueno pueden ver sanciones (lectura)
    puedeVerSanciones: s => ['administrador', 'dueno', 'anotador', 'caja'].includes(String(s.rol || '').toLowerCase()),
    // solo admin y dueno ven equipos/jugadores en el panel
    puedeVerGestion: s => ['administrador', 'dueno', 'anotador'].includes(String(s.rol || '').toLowerCase()),
    // taquilla: solo admin y caja
    puedeTaquilla: s => ['administrador', 'caja'].includes(String(s.rol || '').toLowerCase()),
  },

  actions: {
    async login(email, password) {
      const { data } = await api.post('/auth/login', { email, password })
      this.token     = data.token
      this.rol       = data.rol?.toLowerCase() || null
      this.nombre    = data.nombre
      this.id_equipo = data.id_equipo // Viene del backend
      
      localStorage.setItem('token',  data.token)
      localStorage.setItem('rol',    this.rol)
      localStorage.setItem('nombre', data.nombre)
      if (data.id_equipo) localStorage.setItem('id_equipo', data.id_equipo)
    },
    logout() {
      this.token = this.rol = this.nombre = null
      localStorage.removeItem('token')
      localStorage.removeItem('rol')
      localStorage.removeItem('nombre')
      localStorage.removeItem('id_equipo')
    },
  },
})