<template>
  <RouterView />
  <AppToast />
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppToast from '@/components/AppToast.vue'
</script>

<style>

html, body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow-x: hidden;
}
</style>