<template>
  <div class="jd-page">
    <LandingHeader />

    <section class="jd-hero">
      <div class="jd-hero__noise" />
      <div class="jd-hero__lines" />
      <div class="jd-hero__content">
        <p class="jd-hero__kicker">LIGA DIAMANTE · TEMPORADA 2026</p>
        <h1 class="jd-hero__title">
          ROSTERS<br /><span class="jd-hero__accent">OFICIALES</span>
        </h1>
        <p class="jd-hero__sub">Explora los equipos y conoce a los jugadores inscritos en la liga.</p>
      </div>
      <div class="jd-hero__diamond">◆</div>
    </section>

    <section class="jd-section">
      <div class="jd-container">
        
        <transition name="jd-fade" mode="out-in">
          <div v-if="!equipoSeleccionado" key="equipos">
            <div class="jd-eyebrow-row">
              <span class="jd-eyebrow">PASO 1 · SELECCIONA UNA NOVENA</span>
              <div class="jd-eyebrow-line" />
            </div>
            <h2 class="jd-title">Equipos <em>Inscritos</em></h2>
            <p class="jd-subtitle">Haz clic en un equipo para ver los datos de sus jugadores.</p>

            <div v-if="cargandoEquipos" class="jd-loading">
              <div class="jd-spinner"></div>
              <p>Cargando equipos desde el servidor...</p>
            </div>

            <div v-else class="jd-grid-equipos">
              <article
                v-for="equipo in equipos"
                :key="equipo.id_equipo"
                class="jd-card-equipo"
                @click="seleccionarEquipo(equipo)"
              >
                <div class="jd-card-equipo__logo">
                  <img v-if="equipo.logo_url" :src="apiBase + equipo.logo_url" :alt="equipo.nombre_equipo" @error="equipo.logo_url = null" />
                  <span v-else>⚾</span>
                </div>
                <div class="jd-card-equipo__info">
                  <h3>{{ equipo.nombre_equipo }}</h3>
                  <p>DT: {{ equipo.entrenador || 'Por definir' }}</p>
                </div>
                <div class="jd-card-equipo__arrow">→</div>
              </article>
            </div>
          </div>

          <div v-else key="jugadores">
            <button class="jd-btn-volver" @click="volver">
              <span>←</span> Volver a los equipos
            </button>

            <div class="jd-eyebrow-row mt-4">
              <span class="jd-eyebrow">PLANTILLA OFICIAL</span>
              <div class="jd-eyebrow-line" />
            </div>
            <h2 class="jd-title">Roster de <em>{{ equipoSeleccionado.nombre_equipo }}</em></h2>
            <p class="jd-subtitle">Datos de inscripción de los jugadores activos.</p>

            <div v-if="cargandoJugadores" class="jd-loading">
              <div class="jd-spinner"></div>
              <p>Cargando jugadores...</p>
            </div>

            <div v-else-if="!jugadores.length" class="jd-empty">
              <span class="jd-empty-icon">📂</span>
              <p>Este equipo aún no ha registrado jugadores en su roster.</p>
            </div>

            <div v-else class="jd-grid-jugadores">
              <div v-for="jugador in jugadores" :key="jugador.id_jugador" class="jd-player-card">
                
                <div class="jd-player-header">
                  <div class="jd-player-foto">
                    <img v-if="jugador.foto_url" :src="apiBase + jugador.foto_url" :alt="jugador.nombre" @error="jugador.foto_url = null" />
                    <span v-else>{{ iniciales(jugador.nombre, jugador.apellido) }}</span>
                  </div>
                  <div class="jd-player-namebox">
                    <span class="jd-player-pos">{{ jugador.posicion }}</span>
                    <h3 class="jd-player-name">{{ jugador.nombre }} {{ jugador.apellido }}</h3>
                  </div>
                </div>

                <div class="jd-player-data">
                  <div class="jd-data-row">
                    <span class="jd-data-lbl">Edad:</span>
                    <span class="jd-data-val jd-highlight">{{ calcularEdad(jugador.fecha_nacimiento) }}</span>
                  </div>
                  <div class="jd-data-row">
                    <span class="jd-data-lbl">Rol:</span>
                    <span class="jd-data-val" style="text-transform: capitalize;">{{ jugador.rol }}</span>
                  </div>
                  <div class="jd-data-row" v-if="jugador.brazo_dominante">
                    <span class="jd-data-lbl">Brazo:</span>
                    <span class="jd-data-val">{{ jugador.brazo_dominante }}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </transition>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LandingHeader from '@/components/landing/LandingHeader.vue'
import api from '@/services/api'

const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'

// ── Estado Reactivo ──
const equipos = ref([])
const equipoSeleccionado = ref(null)
const jugadores = ref([])
const cargandoEquipos = ref(true)
const cargandoJugadores = ref(false)

// ── Cargar equipos al iniciar ──
onMounted(async () => {
  try {
    const { data } = await api.get('/pub/equipos')
    equipos.value = data
  } catch (error) {
    console.error("Error cargando equipos", error)
  } finally {
    cargandoEquipos.value = false
  }
})

// ── Seleccionar un equipo y traer sus jugadores ──
async function seleccionarEquipo(equipo) {
  equipoSeleccionado.value = equipo
  cargandoJugadores.value = true
  jugadores.value = []
  
  try {
    // Usamos el endpoint que filtra los jugadores por el ID del equipo
    const { data } = await api.get('/pub/jugadores-liga', { 
      params: { equipo: equipo.id_equipo } 
    })
    jugadores.value = data
  } catch (error) {
    console.error("Error cargando jugadores", error)
  } finally {
    cargandoJugadores.value = false
  }
}

// ── Volver a la lista de equipos ──
function volver() {
  equipoSeleccionado.value = null
  jugadores.value = []
}

// ── Utilidades ──
function iniciales(nombre = '', apellido = '') {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase() || '?'
}

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return 'N/D'
  
  const hoy = new Date()
  const fechaNac = new Date(fechaNacimiento)
  let edad = hoy.getFullYear() - fechaNac.getFullYear()
  const diferenciaMeses = hoy.getMonth() - fechaNac.getMonth()
  
  // Si el mes actual es menor al mes de nacimiento, o si estamos en el mismo mes pero el día no ha llegado
  if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--
  }
  
  return `${edad} años`
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;700&family=Barlow:wght@400;500&display=swap');

.jd-page {
  /* Paleta semi-oscura índigo/orquídea */
  --gold:    #C874C4; 
  --red:     #87B0D4; 
  --bg:      #1B2431; 
  --bg-dark: #131a24;
  --bg-card: #212c3d;
  --border:  rgba(135,176,212,0.15);
  --txt:     #E4E3F1;
  --txt-dim: rgba(228,227,241,0.5);
  
  background: var(--bg); color: white;
  font-family: 'Barlow', sans-serif;
  min-height: 100vh; overflow-x: hidden;
}

/* ── Hero ── */
.jd-hero {
  position: relative; min-height: 400px;
  display: flex; align-items: flex-end;
  padding: 140px 60px 72px; overflow: hidden;
  background: radial-gradient(ellipse 60% 70% at 80% 40%, rgba(135,176,212,0.15) 0%, transparent 60%), var(--bg-dark);
  border-bottom: 1px solid var(--border);
}
.jd-hero__noise {
  position: absolute; inset: 0; pointer-events: none; opacity: 0.35;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
}
.jd-hero__lines {
  position: absolute; inset: 0; pointer-events: none;
  background: repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(200,116,196,0.02) 40px, rgba(200,116,196,0.02) 41px);
}
.jd-hero__content { position: relative; z-index: 2; }
.jd-hero__kicker {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px; font-weight: 700; letter-spacing: 5px;
  color: var(--gold); text-transform: uppercase; margin: 0 0 14px;
}
.jd-hero__title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(60px, 10vw, 116px); line-height: 0.88; margin: 0; letter-spacing: 2px;
}
.jd-hero__accent { color: var(--gold); }
.jd-hero__sub {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 15px; color: var(--txt); margin: 18px 0 0; letter-spacing: 1px;
}
.jd-hero__diamond {
  position: absolute; right: 7%; bottom: -50px;
  font-size: clamp(180px, 28vw, 360px);
  color: rgba(200,116,196,0.03);
  user-select: none; pointer-events: none;
  animation: spin 90s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Generales de la sección ── */
.jd-section { padding: 80px 0; }
.jd-container { max-width: 1100px; margin: 0 auto; padding: 0 32px; }
.jd-eyebrow-row { display: flex; align-items: center; gap: 16px; margin-bottom: 14px; }
.jd-eyebrow {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px; font-weight: 700; letter-spacing: 4px;
  color: var(--gold); text-transform: uppercase; white-space: nowrap;
}
.jd-eyebrow-line { flex: 1; height: 1px; background: var(--border); }
.jd-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(38px, 6vw, 68px); line-height: 1; margin: 0 0 10px;
}
.jd-title em { color: var(--gold); font-style: normal; }
.jd-subtitle {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 14px; color: var(--txt-dim); margin: 0 0 44px;
}
.mt-4 { margin-top: 30px; }

/* ── Spinner / Estados Vacíos ── */
.jd-loading { text-align: center; padding: 80px 0; color: var(--txt-dim); }
.jd-spinner {
  width: 40px; height: 40px; border: 3px solid rgba(200,116,196,0.2);
  border-top-color: var(--gold); border-radius: 50%;
  animation: rotate 1s linear infinite; margin: 0 auto 16px;
}
@keyframes rotate { to { transform: rotate(360deg); } }
.jd-empty { text-align: center; padding: 80px 0; color: var(--txt-dim); }
.jd-empty-icon { font-size: 48px; display: block; margin-bottom: 16px; opacity: 0.5; }

/* ── Botón Volver ── */
.jd-btn-volver {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; border: 1px solid var(--border);
  color: var(--txt); padding: 8px 16px; border-radius: 8px;
  font-family: 'Barlow Condensed', sans-serif; font-size: 13px;
  font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  cursor: pointer; transition: all 0.2s;
}
.jd-btn-volver:hover {
  background: rgba(255,255,255,0.05); border-color: var(--gold); color: var(--gold);
}

/* ── Grid Equipos ── */
.jd-grid-equipos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.jd-card-equipo {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px;
  padding: 20px; cursor: pointer; display: flex; align-items: center; gap: 16px;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.jd-card-equipo:hover {
  transform: translateY(-4px); border-color: var(--gold);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}
.jd-card-equipo__logo {
  width: 60px; height: 60px; border-radius: 50%;
  background: linear-gradient(135deg, rgba(200,116,196,0.1), rgba(135,176,212,0.1));
  border: 2px solid rgba(200,116,196,0.2);
  display: flex; align-items: center; justify-content: center; font-size: 24px;
}
.jd-card-equipo__logo img { width: 100%; height: 100%; object-fit: contain; padding: 8px; }
.jd-card-equipo__info { flex: 1; }
.jd-card-equipo__info h3 { font-family: 'Bebas Neue', sans-serif; font-size: 22px; margin: 0 0 4px; letter-spacing: 1px; }
.jd-card-equipo__info p { font-family: 'Barlow Condensed', sans-serif; font-size: 13px; color: var(--txt-dim); margin: 0; text-transform: uppercase; letter-spacing: 1px;}
.jd-card-equipo__arrow { font-size: 20px; color: var(--gold); opacity: 0; transform: translateX(-10px); transition: all 0.3s; }
.jd-card-equipo:hover .jd-card-equipo__arrow { opacity: 1; transform: translateX(0); }

/* ── Grid Jugadores (Datos de Inscripción) ── */
.jd-grid-jugadores {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.jd-player-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  transition: background 0.2s;
}
.jd-player-card:hover { background: rgba(255,255,255,0.05); }

.jd-player-header {
  display: flex; align-items: center; gap: 12px;
  padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05);
  background: rgba(0,0,0,0.15);
}
.jd-player-foto {
  width: 50px; height: 50px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
  background: rgba(200,116,196,0.1); border: 2px solid rgba(200,116,196,0.3);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: var(--gold);
}
.jd-player-foto img { width: 100%; height: 100%; object-fit: cover; }
.jd-player-namebox { flex: 1; min-width: 0; }
.jd-player-pos {
  font-family: 'Barlow Condensed', sans-serif; font-size: 10px;
  font-weight: 700; letter-spacing: 2px; color: var(--gold);
  text-transform: uppercase; display: block; margin-bottom: 2px;
}
.jd-player-name {
  font-family: 'Bebas Neue', sans-serif; font-size: 18px; margin: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: white; letter-spacing: 1px;
}

.jd-player-data { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.jd-data-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed rgba(255,255,255,0.05); padding-bottom: 4px; }
.jd-data-row:last-child { border-bottom: none; padding-bottom: 0; }
.jd-data-lbl { font-size: 13px; color: var(--txt-dim); }
.jd-data-val { font-size: 13px; font-weight: 600; color: var(--txt); }
.jd-highlight { color: #fff; background: rgba(135,176,212,0.15); padding: 2px 8px; border-radius: 4px; font-family: 'Bebas Neue', sans-serif; font-size: 15px; letter-spacing: 1px;}

/* ── Transiciones ── */
.jd-fade-enter-active, .jd-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.jd-fade-enter-from { opacity: 0; transform: translateY(10px); }
.jd-fade-leave-to { opacity: 0; transform: translateY(-10px); }

@media (max-width: 600px) {
  .jd-hero { padding: 110px 20px 56px; }
  .jd-container { padding: 0 16px; }
}
</style>