import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user:   null,
    token:  localStorage.getItem('token')  || null,
    rol:    localStorage.getItem('rol')    || null,
    nombre: localStorage.getItem('nombre') || null,
    id_equipo: localStorage.getItem('id_equipo') || null,
  }),

  getters: {
    esAdmin:       s => s.rol === 'administrador',
    esDueno:       s => s.rol === 'dueno',
    esCaja:        s => s.rol === 'caja',
    esAnotador:    s => s.rol === 'anotador',
    puedeFinanzas: s => ['administrador', 'caja'].includes(s.rol),
    puedeVerReportes: s => ['administrador', 'dueno', 'caja'].includes(s.rol),
    // admin y dueno gestionan equipos, jugadores y programan partidos
    puedeEditar:   s => ['administrador', 'dueno'].includes(s.rol),
    // admin, dueno y anotador pueden cambiar estado y reprogramar partidos
    puedeGestionarPartido: s => ['administrador', 'dueno', 'anotador'].includes(s.rol),
    // admin y anotador pueden gestionar sanciones
    puedeSancionar: s => ['administrador', 'anotador'].includes(s.rol),
    // admin, dueno y anotador pueden cargar lineup, resultado y estadísticas de un partido
    puedeAnotar:   s => ['administrador', 'dueno', 'anotador'].includes(s.rol),
    // caja, admin y dueno pueden ver sanciones (lectura)
    puedeVerSanciones: s => ['administrador', 'dueno', 'anotador', 'caja'].includes(s.rol),
    // solo admin y dueno ven equipos/jugadores en el panel
    puedeVerGestion: s => ['administrador', 'dueno', 'anotador'].includes(s.rol),
    // taquilla: solo admin y caja
    puedeTaquilla: s => ['administrador', 'caja'].includes(s.rol),
  },

  actions: {
    async login(email, password) {
      const { data } = await api.post('/auth/login', { email, password })
      this.token     = data.token
      this.rol       = data.rol
      this.nombre    = data.nombre
      this.id_equipo = data.id_equipo // Viene del backend
      
      localStorage.setItem('token',  data.token)
      localStorage.setItem('rol',    data.rol)
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