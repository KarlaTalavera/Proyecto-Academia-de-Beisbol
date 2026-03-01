<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Egresos</title>
    <link rel="stylesheet" href="../Estilos/Egresos.css">
    <link rel="stylesheet" href="../Estilos/header.css">
    <link rel="icon" type="image/x-icon" href="../Recursos/icono liga.ico">
</head>
<body>
    <?php include '../Componentes/header.php'; ?>

    <div class="contenedor-grid">
        <aside class="columna-izquierda">
            <h3>Egresos liga</h3>
            <p>Historial de Egresos</p>
        </aside>

        <section class="columna-derecha">
            <h2>Registro de egreso</h2>

            
                <form action="">
                    <div class="columna-derecha-egreso">
                        <label for="fecha">Fecha del Servicio:</label>
                        <input type="date" id="fecha" name="fecha">
                    </div>
                    
                    <div class="columna-derecha-egreso">
                        <label for="monto">Monto del Servicio:</label>
                        <input type="number" id="monto" name="monto" placeholder="$0.00">
                    </div>

                    <div class="columna-derecha-egreso">
                        <label for="Nota-gasto">Nota del gasto:</label>
                        <input type="text" id="Nota-gasto" name="Nota-gasto" placeholder="Descripción del gasto">
                    </div>

                     <div class="columna-derecha-egreso">
                        <select name="" id="">
                            <option value="">Provedor</option>
                        </select>
                    </div>
                    <button type="submit">Registrar Egreso</button>
                </form>
            
            
           
        </section>
    </div> 


</body>
</html>