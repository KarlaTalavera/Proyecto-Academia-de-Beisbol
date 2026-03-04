<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jugadores</title>
    <link rel="icon" type="image/x-icon" href="../Recursos/icono liga.ico">
    <link rel="stylesheet" href="../Estilos/header.css">
    <link rel="stylesheet" href="../Estilos/jugadores.css">

</head>
<body>
    <?php include '../Componentes/header.php'; ?>

   <div class="contenedor-secciones">
       <div class="bloque-grande">
           <h2>Jugadores Destacados</h2>
           <p>Conoce a los jugadores más destacados de la Liga Diamante, sus estadísticas y logros.</p>
            <table>
                <tr>
                    <th>Nombre</th>
                    <th>Equipo</th>
                    <th>Posición</th>
                    <th>categoria</th>
                    <th>Estadísticas</th>
                </tr>
                <tr>
                    <td>Carlos Martínez</td>
                    <td>Águilas de Acero</td>
                    <td>Lanzador</td>
                    <td>sub-13</td>
                    <td>ERA: 2.85, WHIP: 1.10, SO: 150</td>
                </tr>
                <tr>
                    <td>Juan Pérez</td>
                    <td>Tigres de Fuego</td>
                    <td>Receptor</td>
                    <td>sub-13</td>
                    <td>AVG: .320, HR: 25, RBI: 80</td>
                </tr>
                <tr>
                    <td>Luis Gómez</td>
                    <td>Leones de Plata</td>
                    <td>Infielder</td>
                    <td>sub-13</td>
                    <td>AVG: .290, HR: 15, RBI: 60</td>
                </tr>
            </table>
       </div>

   </div>
    
</body>
</html>