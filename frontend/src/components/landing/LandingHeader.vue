<template>
  <header class="ld-hero">
    <div class="ld-hero-bg">
      <img
        v-for="(img, i) in heroImages"
        :key="i"
        :src="img"
        :class="['ld-hero-slide', { 'ld-hero-slide--active': currentSlide === i }]"
        alt=""
      />
      <div class="ld-hero-gradient" />
    </div>

    <nav class="ld-nav">
      <RouterLink :to="{ name: 'LandingInicio' }" class="ld-nav-logo">LIGA DIAMANTE</RouterLink>

      <div class="ld-nav-links">
        <RouterLink :to="{ name: 'LandingInicio' }" :class="['ld-nav-link', { 'ld-nav-link--active': route.name === 'LandingInicio' }]">Inicio</RouterLink>
        <RouterLink :to="{ name: 'LandingResultados' }" :class="['ld-nav-link', { 'ld-nav-link--active': route.name === 'LandingResultados' }]">Resultados</RouterLink>
        <RouterLink :to="{ name: 'LandingNoticias' }" :class="['ld-nav-link', { 'ld-nav-link--active': route.name === 'LandingNoticias' }]">Noticias</RouterLink>
        <RouterLink :to="{ name: 'LandingStanding' }" :class="['ld-nav-link', { 'ld-nav-link--active': route.name === 'LandingStanding' }]">Standing</RouterLink>
        <RouterLink :to="{ name: 'LandingCalendario' }" :class="['ld-nav-link', { 'ld-nav-link--active': route.name === 'LandingCalendario' }]">Calendario</RouterLink>
        <RouterLink :to="{ name: 'LandingEquipos' }" :class="['ld-nav-link', { 'ld-nav-link--active': route.name === 'LandingEquipos' }]">Equipos</RouterLink>
        <RouterLink :to="{ name: 'LandingLigaJugadores' }" :class="['ld-nav-link', { 'ld-nav-link--active': route.name === 'LandingLigaJugadores' }]">Jugadores</RouterLink>
        <RouterLink :to="{ name: 'Login' }" class="ld-nav-btn">INICIAR SESIÓN</RouterLink>
      </div>

      <button class="ld-hamburger" @click="mobileOpen = true" aria-label="Abrir menú">
        <span /><span /><span />
      </button>
    </nav>

    <div class="ld-hero-title">
      <div class="ld-hero-title-bar" />
      <p class="ld-hero-title-top">DONDE NACEN</p>
      <p class="ld-hero-title-bottom">LAS LEYENDAS</p>
    </div>

    <Teleport to="body">
      <transition name="ld-overlay-fade">
        <div v-if="mobileOpen" class="ld-mobile-overlay" @click.self="mobileOpen = false">
          <div class="ld-mobile-panel">
            <button class="ld-mobile-close" @click="mobileOpen = false">✕</button>
            <div class="ld-mobile-links">
              <RouterLink :to="{ name: 'LandingInicio' }" class="ld-mobile-link" @click="mobileOpen = false">Inicio</RouterLink>
              <RouterLink :to="{ name: 'LandingResultados' }" class="ld-mobile-link" @click="mobileOpen = false">Resultados</RouterLink>
              <RouterLink :to="{ name: 'LandingNoticias' }" class="ld-mobile-link" @click="mobileOpen = false">Noticias</RouterLink>
              <RouterLink :to="{ name: 'LandingStanding' }" class="ld-mobile-link" @click="mobileOpen = false">Standing</RouterLink>
              <RouterLink :to="{ name: 'LandingCalendario' }" class="ld-mobile-link" @click="mobileOpen = false">Calendario</RouterLink>
              <RouterLink :to="{ name: 'LandingEquipos' }" class="ld-mobile-link" @click="mobileOpen = false">Equipos</RouterLink>
              <RouterLink :to="{ name: 'LandingLigaJugadores' }" class="ld-mobile-link" @click="mobileOpen = false">Jugadores</RouterLink>
              <RouterLink :to="{ name: 'Login' }" class="ld-mobile-btn" @click="mobileOpen = false">INICIAR SESIÓN</RouterLink>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
const currentSlide = ref(0)
const estadOpen = ref(false)
const mobileOpen = ref(false)

const heroImages = [
  '/recursos/31231.jpg_1239977223.webp',
  '/recursos/1.jpg',
  '/recursos/2.jpg',
  '/recursos/3.jpeg',
]
let slideTimer = null

onMounted(() => {
  slideTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % heroImages.length
  }, 3000)
})

onUnmounted(() => {
  clearInterval(slideTimer)
})
</script>

<style scoped>

.ld-hero {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: 'Arial Black', Arial, sans-serif;
}

@media (min-width: 768px) {
  .ld-hero {
    height: 550px;
  }
}

@media (max-width: 480px) {
  .ld-hero {
    height: 350px;
  }
}


.ld-hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.ld-hero-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.65) contrast(1.1); 
  opacity: 0;
  transition: opacity 1.2s ease-in-out, transform 5s ease-out;
  transform: scale(1);
}

.ld-hero-slide--active {
  opacity: 1;
  transform: scale(1.05); 
}

.ld-hero-slide::before {
  content: "⚾";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  color: rgba(255, 255, 255, 0.3);
  display: none;
}

.ld-hero-slide[src=""],
.ld-hero-slide:error {
  background: linear-gradient(135deg, #3B4269, #1B2431);
  display: flex;
  align-items: center;
  justify-content: center;
}


.ld-hero-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(
    to top,
    rgba(59, 66, 105, 1) 0%,
    rgba(59, 66, 105, 0.8) 30%,
    rgba(59, 66, 105, 0.3) 60%,
    rgba(59, 66, 105, 0) 100%
  );
  z-index: 1;
  pointer-events: none;
}

/* Gradiente superior */
.ld-hero-gradient-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(
    to bottom,
    rgba(27, 36, 49, 0.6) 0%,
    rgba(27, 36, 49, 0) 100%
  );
  z-index: 1;
  pointer-events: none;
}

/* ─── Navbar ─── */
.ld-nav {
  position: relative;
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
}

@media (min-width: 1024px) {
  .ld-nav {
    padding: 20px 48px;
  }
}

.ld-nav-logo {
  font-size: 20px;
  font-weight: 900;
  font-style: italic;
  text-transform: uppercase;
  color: #E4E3F1;
  text-decoration: none;
  letter-spacing: 2px;
  line-height: 1;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

@media (min-width: 1024px) {
  .ld-nav-logo {
    font-size: 24px;
  }
}

/* ─── Desktop nav links ─── */
.ld-nav-links {
  display: none;
  align-items: center;
  gap: 4px;
  background: rgba(27, 36, 49, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 999px;
  padding: 8px 16px;
  border: 1px solid rgba(135, 176, 212, 0.2);
}

@media (min-width: 1024px) {
  .ld-nav-links {
    display: flex;
  }
}

.ld-nav-link {
  color: #E4E3F1;
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 999px;
  transition: all 0.2s;
  white-space: nowrap;
  cursor: pointer;
}

.ld-nav-link:hover {
  color: #FFFFFF;
  background: rgba(135, 176, 212, 0.2); /* Fondo azul cielo suave al hover */
}

.ld-nav-link--active {
  color: #FFFFFF !important;
  background: #C874C4; /* Orquídea para el enlace activo */
}

.ld-nav-btn {
  color: #FFFFFF;
  background: #C874C4; /* Orquídea */
  text-decoration: none;
  font-size: 12px;
  font-weight: 900;
  padding: 7px 16px;
  border-radius: 999px;
  margin-left: 8px;
  transition: all 0.2s;
  white-space: nowrap;
  letter-spacing: 0.5px;
}

.ld-nav-btn:hover {
  background: #a858a4; /* Orquídea más oscuro al hover */
  transform: translateY(-1px);
}

/* ─── Hamburger ─── */
.ld-hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 15;
  position: relative;
}

@media (min-width: 1024px) {
  .ld-hamburger {
    display: none;
  }
}

.ld-hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: #E4E3F1;
  border-radius: 2px;
}

/* ─── Hero title ─── */
.ld-hero-title {
  position: relative;
  z-index: 15;
  padding: 0 24px 28px;
}

@media (min-width: 1024px) {
  .ld-hero-title {
    padding: 0 48px 40px;
  }
}

.ld-hero-title-bar {
  width: 50px;
  height: 4px;
  background: #87B0D4; /* Línea azul cielo */
  margin-bottom: 16px;
  border-radius: 2px;
}

.ld-hero-title-top {
  color: #FFFFFF;
  font-size: 28px;
  font-weight: 900;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 1;
  margin: 0;
  padding: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.ld-hero-title-bottom {
  color: #87B0D4; /* Azul cielo para el texto secundario */
  font-size: 36px;
  font-weight: 900;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 1.1;
  margin: 0;
  padding: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

@media (min-width: 768px) {
  .ld-hero-title-top {
    font-size: 42px;
  }
  .ld-hero-title-bottom {
    font-size: 56px;
  }
}

@media (max-width: 480px) {
  .ld-hero-title-top {
    font-size: 22px;
  }
  .ld-hero-title-bottom {
    font-size: 28px;
  }
}

/* ─── Mobile overlay ─── */
.ld-mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(27, 36, 49, 0.9); /* Azul marino transparente */
  backdrop-filter: blur(8px);
  z-index: 99999;
  display: flex;
  justify-content: flex-end;
}

.ld-mobile-panel {
  width: 280px;
  max-width: 85vw;
  height: 100%;
  background: #1B2431; /* Fondo azul marino del panel */
  border-left: 1px solid rgba(135, 176, 212, 0.2);
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  overflow-y: auto;
}

.ld-mobile-close {
  align-self: flex-end;
  margin-right: 20px;
  margin-bottom: 20px;
  background: none;
  border: 1px solid rgba(135, 176, 212, 0.4);
  color: #87B0D4;
  font-size: 18px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ld-mobile-links {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  gap: 4px;
}

.ld-mobile-link {
  color: #E4E3F1; /* Texto lavanda */
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  padding: 12px 16px;
  border-radius: 10px;
  transition: all 0.2s;
}

.ld-mobile-link:hover {
  color: #FFFFFF;
  background: rgba(200, 116, 196, 0.15); /* Fondo rosado suave al hover */
}

.ld-mobile-btn {
  display: block;
  text-align: center;
  color: #FFFFFF;
  background: #C874C4;
  text-decoration: none;
  font-size: 13px;
  font-weight: 900;
  padding: 12px 16px;
  border-radius: 10px;
  margin-top: 12px;
  letter-spacing: 1px;
}


.ld-overlay-fade-enter-active,
.ld-overlay-fade-leave-active {
  transition: opacity 0.25s ease;
}
.ld-overlay-fade-enter-from,
.ld-overlay-fade-leave-to {
  opacity: 0;
}
</style>