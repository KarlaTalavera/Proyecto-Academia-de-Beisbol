<?php
// 1. Conexión y consulta
require_once '../BD/Conexion.php';

try {
    $consulta = $pdo->query("SELECT * FROM `jugador` ORDER BY `Id-Jugador` DESC");
    $jugadores = $consulta->fetchAll();
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrar jugador</title>
    <link rel="stylesheet" href="../Estilos/Registrar_jugador.css">
    <link rel="stylesheet" href="../Estilos/header.css">
    <link rel="icon" type="image/x-icon" href="../Recursos/icono liga.ico">
</head>
<body>
    <?php include '../Componentes/header.php'; ?>

    <button type="button" id="boton-registrar-jugador-desplegar" class="boton-registrar-jugador-oculto" >
                Añadir nuevo jugador
    </button>
    <div id="Nuevo-jugador" class="contenedor-secciones" style="display: none;">
        <div class="bloque-grande"> 
            <h2>Registrar nuevo jugador</h2>
            <p>Llena el formulario para agregar un nuevo jugador</p>
            <form action="../controladores/registro-jugador.php" method="POST" class="formulario-registro">
                <div>
                    <input type="text" name="nombre" placeholder="Nombre" required>
                </div>
                <div>
                    <input type="text" name="apellido" placeholder="Apellido" required>
                </div>
                <div>
                    <input type="date" name="edad" placeholder="Edad" required>
                </div>
                <div>
                    <select name="rol" required>
                        <option value="">Selecciona un rol</option>
                        <option value="lanzador">Lanzador</option>
                        <option value="receptor">Receptor</option>
                        <option value="infielder">Infielder</option>
                        <option value="outfielder">Outfielder</option>
                    </select>
                </div>
                <div>
                    <input type="text" name="posicion" placeholder="Posición específica (ej. primera base)" required>
                </div>
                <div>
                    <select name="brazo_dominante" required>
                        <option value="derecho">Derecho</option>
                        <option value="izquierdo">Izquierdo</option>
                        <option value="Ambos">Ambos</option>
                    </select>
                </div>
                <button type="submit">Registrar jugador</button>
            </form>
        </div>

    </div>

    <div class="contenedor-secciones">
    <div class="bloque-grande"> 
        <div class="tabla-responsiva">
            <table class="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Edad</th>
                        <th>Rol</th>
                        <th>Posición</th>
                        <th>Brazo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($jugadores as $jugador): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($jugador['Nombre']); ?></td>
                        <td><?php echo htmlspecialchars($jugador['Apellido']); ?></td>
                        <td><?php echo htmlspecialchars($jugador['Fecha_nacimiento']); ?></td>
                        <td><?php echo htmlspecialchars($jugador['Rol']); ?></td>
                        <td><?php echo htmlspecialchars($jugador['Pocision']); ?></td>
                        <td><?php echo htmlspecialchars($jugador['Brazo-dominante']); ?></td>
                        <td>
                            <a href="Editar_jugador.php?id=<?php echo $jugador['Id-jugador']; ?>" class="btn-accion editar">✏️</a>
                            <a href="../Controladores/Eliminar-jugador.php?id=<?php echo $jugador['Id-jugador']; ?>" class="btn-accion eliminar" onclick="return confirm('¿Eliminar?')">🗑️</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
    <script src="../Scritpt/Nuevo-jugador-desplegable.js"></script>
</body>
</html>