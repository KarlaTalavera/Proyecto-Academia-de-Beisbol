<template>
  <div class="iv-page">
    <LandingHeader />

    <section class="iv-section">
      <div class="iv-container">
        <div class="iv-row">
          <div class="iv-text-col">
            <span class="iv-section-num">01.</span>
            <div class="iv-divider" />
            <div class="iv-title-block">
              <h2 class="iv-title-main">INFORMACIÓN</h2>
              <h2 class="iv-title-ghost">GENERAL</h2>
            </div>
            <p class="iv-subtitle">
              Conoce todos los detalles de la Liga Diamante de Béisbol: nuestros torneos,
              equipos participantes, reglamento oficial y toda la información que necesitas
              para seguir de cerca cada temporada.
            </p>
            <router-link to="/informacion" class="iv-btn">LEER MÁS</router-link>
          </div>
          <div class="iv-img-col">
            <div class="iv-img-wrapper">
              <div class="iv-dot-pattern iv-dot-pattern--tl" />
              <img src="/recursos/4.jpg" alt="Información General" class="iv-img" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="iv-section iv-section--alt">
      <div class="iv-container">
        <div class="iv-row iv-row--reversed">
          <div class="iv-img-col">
            <div class="iv-img-wrapper">
              <img src="/recursos/5.jpg" alt="Equipos" class="iv-img" />
            </div>
          </div>
          <div class="iv-text-col">
            <span class="iv-section-num">02.</span>
            <div class="iv-divider" />
            <div class="iv-title-block">
              <h2 class="iv-title-main">EQUIPOS</h2>
              <h2 class="iv-title-ghost">VARIADOS</h2>
            </div>
            <p class="iv-subtitle">
              Descubre los equipos que forman parte de la Liga Diamante. Desde sus uniformes
              y escudos hasta sus plantillas completas y trayectoria histórica en el torneo.
            </p>
             <router-link to="/equipos" class="iv-btn">LEER MÁS</router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="iv-section">
      <div class="iv-container">
        <div class="iv-row iv-row--reversed">
          <div class="iv-img-col">
            <div class="iv-img-wrapper">
              <img src="/recursos/6.jpg" alt="Alineación" class="iv-img" />
            </div>
          </div>
          <div class="iv-text-col">
            <span class="iv-section-num">03.</span>
            <div class="iv-divider" />
            <div class="iv-title-block">
              <h2 class="iv-title-main">ALINEACIÓN</h2>
              <h2 class="iv-title-ghost">LINE-UP</h2>
            </div>
            <p class="iv-subtitle">
              Consulta las alineaciones de cada equipo para los próximos encuentros.
              Conoce quién lanzará, quiénes bateean y cómo se estructura cada novena.
            </p>
            <router-link to="/alineacion" class="iv-btn">LEER MÁS</router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="iv-section iv-section--alt">
      <div class="iv-container">
        <div class="iv-row">
          <div class="iv-text-col">
            <span class="iv-section-num">04.</span>
            <div class="iv-divider" />
            <div class="iv-title-block">
              <h2 class="iv-title-main">JUGADORES</h2>
              <h2 class="iv-title-ghost">DESTACADOS</h2>
            </div>
            <p class="iv-subtitle">
              Sigue el desempeño de los mejores peloteros de la liga. Estadísticas,
              promedios al bate, efectividad en el montículo y mucho más de tus favoritos.
            </p>
            <router-link to="/jugadores" class="iv-btn">LEER MÁS</router-link>
          </div>
          <div class="iv-img-col">
            <div class="iv-img-wrapper">
              <div class="iv-dot-pattern iv-dot-pattern--br" />
              <img src="/recursos/7.jpg" alt="Jugadores" class="iv-img" />
            </div>
          </div>
        </div>
      </div>
    </section>


  </div>
</template>

<script setup>
import LandingHeader from '@/components/landing/LandingHeader.vue'

</script>

<style scoped>
/* ─── Page wrapper ─── */
.iv-page {
  /* Degradado semi-oscuro: mezcla el azul índigo con el azul marino de tu paleta */
  background: linear-gradient(180deg, #3B4269 0%, #1B2431 100%);
  min-height: 100vh;
  font-family: 'Inter', 'Arial', sans-serif;
  color: #E4E3F1; /* Tono lavanda muy claro para buena lectura */
}

/* ─── Container ─── */
.iv-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 1024px) {
  .iv-container {
    padding: 0 48px;
  }
}

/* ─── Section ─── */
.iv-section {
  padding: 80px 0;
}

@media (min-width: 1024px) {
  .iv-section {
    padding: 100px 0;
  }
}

.iv-section--alt {
  /* Fondo alternativo con el azul claro sutil */
  background: rgba(135, 176, 212, 0.05); 
}

/* ─── Row ─── */
.iv-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  align-items: center;
}

@media (min-width: 1024px) {
  .iv-row {
    grid-template-columns: 1fr 1fr;
    gap: 64px;
  }

  .iv-row--reversed .iv-img-col {
    order: -1;
  }
}

/* ─── Text column ─── */
.iv-text-col {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.iv-section-num {
  color: #C874C4; /* Orquídea/Rosado vibrante */
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 3px;
  margin-bottom: 8px;
  display: block;
}

.iv-divider {
  width: 56px;
  height: 4px;
  background: #87B0D4; /* Azul cielo suave */
  margin-bottom: 20px;
  border-radius: 2px;
}

.iv-title-block {
  margin-bottom: 20px;
  line-height: 1;
}

.iv-title-main {
  color: #FFFFFF; /* Blanco para máximo contraste en el título */
  font-size: 40px;
  font-weight: 900;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  padding: 0;
  line-height: 1;
}

.iv-title-ghost {
  color: #87B0D4; /* Azul cielo */
  opacity: 0.15; /* Lo hacemos sutil de fondo */
  font-size: 52px;
  font-weight: 900;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 0;
  line-height: 1;
  user-select: none;
}

@media (min-width: 768px) {
  .iv-title-main {
    font-size: 52px;
  }
  .iv-title-ghost {
    font-size: 68px;
  }
}

.iv-subtitle {
  color: #E4E3F1; /* Lavanda claro */
  opacity: 0.9;
  font-size: 16px;
  line-height: 1.75;
  margin: 0 0 28px 0;
  padding: 0;
  max-width: 480px;
}

/* ─── Botones ─── */
.iv-btn {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  color: #C874C4; /* Orquídea/Rosado */
  border: 2px solid #C874C4;
  text-decoration: none;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 2px;
  padding: 12px 28px;
  border-radius: 40px;
  transition: all 0.3s ease;
  background: transparent;
  cursor: pointer;
}

.iv-btn:hover {
  background: #C874C4;
  border-color: #C874C4;
  color: #1B2431; /* Azul marino oscuro para el texto al hacer hover */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 116, 196, 0.4); /* Sombra rosada */
}

/* ─── Image column ─── */
.iv-img-col {
  position: relative;
}

.iv-img-wrapper {
  position: relative;
}

.iv-img {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 32px;
  display: block;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3); /* Sombra más oscura para fondo semi-oscuro */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(135, 176, 212, 0.2); /* Borde sutil azul claro */
}

.iv-img:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

@media (min-width: 1024px) {
  .iv-img {
    height: 420px;
    border-radius: 48px;
  }
}

/* Fallback para imágenes que no cargan */
.iv-img:not([src]),
.iv-img[src=""],
.iv-img[src="#"] {
  background: linear-gradient(135deg, #676C9F, #1B2431);
  position: relative;
}

.iv-img:not([src])::after,
.iv-img[src=""]::after,
.iv-img[src="#"]::after {
  content: "⚾";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  color: rgba(255, 255, 255, 0.2);
}

/* ─── Dot pattern decoration ─── */
.iv-dot-pattern {
  position: absolute;
  width: 140px;
  height: 140px;
  /* Puntos azul cielo */
  background-image: radial-gradient(circle, rgba(135, 176, 212, 0.5) 2px, transparent 2px);
  background-size: 16px 16px;
  z-index: 0;
  pointer-events: none;
}

.iv-dot-pattern--tl {
  top: -24px;
  left: -24px;
}

.iv-dot-pattern--br {
  bottom: -24px;
  right: -24px;
}

.iv-img-wrapper .iv-img {
  position: relative;
  z-index: 1;
}

/* ===== RESPONSIVE (vista celular) ===== */
@media (max-width: 768px) {
  .iv-section {
    padding: 48px 0;
  }
  
  .iv-title-main {
    font-size: 32px;
  }
  
  .iv-title-ghost {
    font-size: 44px;
  }
  
  .iv-subtitle {
    font-size: 14px;
  }
  
  .iv-img {
    height: 220px !important;
    border-radius: 24px !important;
  }
  
  .iv-row {
    gap: 32px;
  }
  
  .iv-btn {
    padding: 10px 24px;
    font-size: 12px;
  }
  
  .iv-container {
    padding: 0 20px;
  }
  
  .iv-divider {
    width: 40px;
  }
  
  .iv-section-num {
    font-size: 12px;
  }
  
  .iv-dot-pattern {
    width: 80px;
    height: 80px;
    background-size: 12px 12px;
  }
  
  .iv-dot-pattern--tl {
    top: -12px;
    left: -12px;
  }
  
  .iv-dot-pattern--br {
    bottom: -12px;
    right: -12px;
  }
}

@media (max-width: 480px) {
  .iv-section {
    padding: 32px 0;
  }
  
  .iv-title-main {
    font-size: 28px;
  }
  
  .iv-title-ghost {
    font-size: 36px;
  }
  
  .iv-img {
    height: 180px !important;
    border-radius: 20px !important;
  }
  
  .iv-subtitle {
    font-size: 13px;
  }
  
  .iv-btn {
    padding: 8px 20px;
    font-size: 11px;
  }
}
</style>