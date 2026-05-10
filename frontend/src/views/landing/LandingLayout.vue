<template>
  <div>
    <RouterView />
    <LandingFooter />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import LandingFooter from '@/components/landing/LandingFooter.vue'

onMounted(() => {
  /* Aplicamos el fondo azul marino oscuro a todo el documento */
  document.documentElement.style.setProperty('background', '#1B2431', 'important')
  document.body.style.setProperty('background', '#1B2431', 'important')
})

onUnmounted(() => {
  document.documentElement.style.removeProperty('background')
  document.body.style.removeProperty('background')
})
</script>