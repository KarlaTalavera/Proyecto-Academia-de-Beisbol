<?php

require_once '../BD/Conexion.php';

// Verificar si el ID existe en la URL
if (isset($_GET['id'])) {
    $id = $_GET['id'];

    try {
        
        $sql = "DELETE FROM `jugador` WHERE `Id-jugador` = ?";
        $stmt = $pdo->prepare($sql);
        
            if ($stmt->execute([$id])) {
            
            header("Location: ../Vistas/Registrar_jugador.php?msj=eliminado");
            exit();
        }
    } catch (PDOException $e) {
        echo "Error al eliminar: " . $e->getMessage();
    }
} else {
    echo "ID no proporcionado.";
}
?>