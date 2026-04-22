import { reactive } from 'vue'

const state = reactive({ toasts: [], _id: 0 })

function push(tipo, mensaje, duracion = 4000) {
  const id = ++state._id
  state.toasts.push({ id, tipo, mensaje })
  setTimeout(() => {
    const i = state.toasts.findIndex(t => t.id === id)
    if (i >= 0) state.toasts.splice(i, 1)
  }, duracion)
}

export function useToast() {
  return {
    success: msg => push('success', msg),
    error:   msg => push('error',   msg),
    info:    msg => push('info',    msg),
    warn:    msg => push('warn',    msg),
    toasts:  state.toasts,
  }
}
