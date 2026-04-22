<template>
  <!-- Toasts -->
  <teleport to="body">
    <div class="toast-container">
      <transition-group name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="toast-item d-flex align-items-start gap-2"
          :class="`toast-${t.tipo}`"
        >
          <span class="toast-icon">
            <IconCircleCheck v-if="t.tipo === 'success'" :size="20" />
            <IconAlertCircle  v-else-if="t.tipo === 'error'" :size="20" />
            <IconInfoCircle   v-else-if="t.tipo === 'info'"  :size="20" />
            <IconAlertTriangle v-else :size="20" />
          </span>
          <span class="toast-msg">{{ t.mensaje }}</span>
        </div>
      </transition-group>
    </div>

    <!-- Confirm dialog -->
    <div v-if="confirm.visible" class="modal modal-blur show d-block" tabindex="-1" style="z-index:9999;">
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center py-4">
            <div class="mb-3">
              <span :class="`text-${confirm.variante}`">
                <IconAlertTriangle v-if="confirm.variante === 'danger'" :size="42" stroke-width="1.4" />
                <IconInfoCircle v-else :size="42" stroke-width="1.4" />
              </span>
            </div>
            <h5 class="modal-title mb-2">{{ confirm.titulo }}</h5>
            <p class="text-muted mb-0" style="font-size:0.88rem;">{{ confirm.mensaje }}</p>
          </div>
          <div class="modal-footer justify-content-center border-0 pt-0 pb-4 gap-2">
            <button class="btn btn-ghost-secondary" @click="responder(false)">Cancelar</button>
            <button class="btn" :class="`btn-${confirm.variante}`" @click="responder(true)">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="confirm.visible" class="modal-backdrop show" style="z-index:9998;"></div>
  </teleport>
</template>

<script setup>
import { useToast }         from '@/composables/useToast'
import { useConfirmState }  from '@/composables/useConfirm'
import {
  IconCircleCheck, IconAlertCircle, IconInfoCircle, IconAlertTriangle,
} from '@tabler/icons-vue'

const { toasts }  = useToast()
const confirm     = useConfirmState()

function responder(ok) {
  confirm.visible = false
  confirm.resolve?.(ok)
  confirm.resolve = null
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast-item {
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 260px;
  max-width: 360px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  pointer-events: all;
  line-height: 1.4;
}

.toast-success { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.toast-error   { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.toast-info    { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.toast-warn    { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }

.toast-icon { flex-shrink: 0; margin-top: 1px; }
.toast-msg  { flex: 1; }

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(30px); }
.toast-leave-to   { opacity: 0; transform: translateX(30px); }
</style>
