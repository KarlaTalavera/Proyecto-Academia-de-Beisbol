const JugadorModel = require('../models/jugador.model')

function validarCedula(cedula) {
  if (!cedula) return null
  const c = cedula.toUpperCase()
  if (!/^[VE]-\d{1,8}$/.test(c)) return 'Formato de cédula inválido. Use V-00000000 o E-00000000'
  const num = parseInt(c.split('-')[1], 10)
  if (num < 1 || num > 34000000) return 'El número de cédula debe estar entre 1 y 34.000.000'
  return null
}

const JugadorController = {
  async listar(req, res) {
    const { rol, id_equipo } = req.usuario;

    if (rol === 'dueno') {
      // Un dueño solo puede listar jugadores de su propio equipo
      const jugadores = await JugadorModel.findByEquipo(id_equipo);
      return res.json(jugadores);
    }
    
    const jugadores = await JugadorModel.findAll()
    res.json(jugadores)
  },

  async obtener(req, res) {
    const { rol, id_equipo } = req.usuario;
    const jugador = await JugadorModel.findById(req.params.id)
    
    if (!jugador) return res.status(404).json({ error: 'Jugador no encontrado' })
    res.json(jugador)
  },

  async crear(req, res) {
    let { id_equipo, nombre, apellido, fecha_nacimiento, rol, posicion } = req.body
    if (!nombre || !apellido || !fecha_nacimiento || !posicion) {
      return res.status(400).json({ error: 'nombre, apellido, fecha_nacimiento y posicion son requeridos' })
    }
    // Si es dueno, forzar su id_equipo
    if (req.usuario.rol === 'dueno') {
      id_equipo = req.usuario.id_equipo
    } else if (!id_equipo) {
      return res.status(400).json({ error: 'id_equipo es requerido' })
    }

    const err = validarCedula(req.body.cedula)
    if (err) return res.status(400).json({ error: err })
    const id = await JugadorModel.create({ ...req.body, id_equipo })
    res.status(201).json({ id_jugador: id })
  },

  async actualizar(req, res) {
    const { rol, id_equipo } = req.usuario;
    const { id } = req.params;

    try {
      // Buscamos el jugador actual para verificar pertenencia
      const jugadorActual = await JugadorModel.findById(id);
      if (!jugadorActual) return res.status(404).json({ error: 'Jugador no encontrado' });

      if (rol === 'dueno' && jugadorActual.id_equipo !== id_equipo) {
        return res.status(403).json({ error: 'No puedes editar jugadores de otros equipos' });
      }

      const err = validarCedula(req.body.cedula)
      if (err) return res.status(400).json({ error: err })

      const affected = await JugadorModel.update(id, req.body)
      res.json({ ok: true })
    } catch (e) {
      console.log('Error actualizando jugador:', e)
      res.status(500).json({ error: 'Error interno' })
    }
  },

  async eliminar(req, res) {
    const { rol, id_equipo } = req.usuario;
    const { id } = req.params;

    const jugador = await JugadorModel.findById(id);
    if (!jugador) return res.status(404).json({ error: 'Jugador no encontrado' });

    if (rol === 'dueno' && jugador.id_equipo !== id_equipo) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este jugador' });
    }

    await JugadorModel.delete(id)
    res.json({ ok: true })
  },
}

module.exports = JugadorController