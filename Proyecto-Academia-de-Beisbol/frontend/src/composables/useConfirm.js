import { reactive } from 'vue'

const state = reactive({
  visible:  false,
  mensaje:  '',
  titulo:   '',
  variante: 'danger',
  resolve:  null,
})

export function useConfirmState() {
  return state
}

export function useConfirm() {
  return {
    pedir(mensaje, { titulo = '¿Estás segura?', variante = 'danger' } = {}) {
      return new Promise(resolve => {
        state.mensaje  = mensaje
        state.titulo   = titulo
        state.variante = variante
        state.visible  = true
        state.resolve  = resolve
      })
    },
  }
}
