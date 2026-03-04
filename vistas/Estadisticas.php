<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estadistica</title>
    <link rel="icon" type="image/x-icon" href="../Recursos/icono liga.ico">
    <link rel="stylesheet" href="../Estilos/header.css">
    <link rel="stylesheet" href="../Estilos/estadisticas.css">
</head>
<body>
    <?php include '../Componentes/header.php'; ?>
    <div class="titulo-seccion">
        <p class="titulo-seccion" id="tabla-bateo" >
            Bateo
        </p>
        <p class="titulo-seccion" id="tabla-picheo">
            Picheo
        </p>  
    </div>
    
    <div id="tabla-estadisticas-bateo">
        <table>
            <tr>
                <th class="th-bateo">jugador</th>
                <th class="th-bateo">equipo</th>
                <th class="th-bateo">J</th>    
                <th class="th-bateo">TB</th>
                <th class="th-bateo">c</th>
                <th class="th-bateo">H</th>
                <th class="th-bateo">2B</th>
                <th class="th-bateo">3B</th>
                <th class="th-bateo">HR</th>
                <th class="th-bateo">CI</th>
                <th class="th-bateo">BB</th>
                <th class="th-bateo">P</th>
                <th class="th-bateo">BR</th>
                <th class="th-bateo">AR</th>
                <th class="th-bateo">PRO</th>
                <th class="th-bateo">OBP</th>
                <th class="th-bateo">SLG</th>
                <th class="th-bateo">OPS</th>
            </tr>
            <tr>
                
            </tr>
        </table>
    </div>
    
    <div id="tabla-estadisticas-picheo" style="display: none;">
        <table>
            <tr>
                <th class="th-picheo">jugador</th>
                <th class="th-picheo">equipo</th>
                <th class="th-picheo">JG</th>    
                <th class="th-picheo">JP</th>
                <th class="th-picheo">EFE</th>
                <th class="th-picheo">J</th>
                <th class="th-picheo">A</th>
                <th class="th-picheo">JC</th>
                <th class="th-picheo">SHO</th>
                <th class="th-picheo">JS</th>
                <th class="th-picheo">OS</th>
                <th class="th-picheo">IL</th>
                <th class="th-picheo">H</th>
                <th class="th-picheo">C</th>
                <th class="th-picheo">CL</th>
                <th class="th-picheo">HR</th>
                <th class="th-picheo">GP</th>
                <th class="th-picheo">BB</th>
                <th class="th-picheo">P</th>
                <th class="th-picheo">WHIP</th>
                <th class="th-picheo">PRO</th>
            </tr>
            <tr>
                
            </tr>
        </table>

    </div>
    <script src="../Scritpt/estadisticas-desplegables.js"></script>
</body>
</html>