<?php
require '../BD/conexion.php'; // Ajusta la ruta según tu carpeta

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recibir datos del formulario
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $edad = $_POST['edad'];
    $rol = $_POST['rol'];
    $posicion = $_POST['posicion'];
    $brazo = $_POST['brazo_dominante'];
    
    // ID temporal de equipo (Asegúrate que este ID exista en la tabla 'equipo')
    $id_equipo = 1; 

    try {
        // Los nombres de columnas llevan guiones en tu SQL, usa comillas invertidas
        $sql = "INSERT INTO `jugador` (`Id-Equipo`, `Nombre`, `Apellido`, `Fecha_nacimiento`, `Rol`, `Pocision`, `Brazo-dominante`) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id_equipo, $nombre, $apellido, $edad, $rol, $posicion, $brazo]);

        header("Location: ../Vistas/Registrar_jugador.php?success=1");
        exit();
    } catch (Exception $e) {
        echo "Error al registrar: " . $e->getMessage();
    }
}
?>