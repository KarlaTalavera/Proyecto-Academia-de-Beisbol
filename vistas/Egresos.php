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
                        <label for="Tipo_de_pago">Tipo de pago:</label>
                        <select name="" id="" placeholder="Seleccione el tipo de pago">
                            <option value="">Efectivo</option>
                            <option value="">Transferencia</option>
                            <option value="">Credito</option>
                        </select>
                    </div>

                    <div class="columna-derecha-egreso">
                        <label for="Nota-gasto">Nota del gasto:</label>
                        <input type="text" id="Nota-gasto" name="Nota-gasto" placeholder="Descripción del gasto">
                    </div>

                    <div class="columna-derecha-egreso">
                        <label for="Provedor">provedor del servicio</label>
                        <select name="" id="" placeholder="Seleccione el provedor del servicio">
                            <option value="">Albitro</option>
                            <option value="">Jardineria</option>
                            <option value="">mantenimiento</option>
                        </select>
                    </div>
                    <div class="columna-derecha-egreso">
                        <button type="submit">Guardar Egreso</button>
                    </div>
                </form>
            
            <button type="button" id="boton-registrar-desplegar" class="boton-registrar-oculto" >
                Añadir nuevo provedor
            </button>

            <div id="formulario-Provedor" style="display: none;">
                <form action="">
                    <div class="columna-derecha-egreso">
                        <label for="nombre-provedor">Nombre del Provedor:</label>
                        <input type="text" id="nombre-provedor" name="nombre-provedor" placeholder="Nombre del provedor">
                    </div>
                    
                     <div class="columna-derecha-egreso">
                        <label for="R.I.F-provedor">R.I.F del Provedor:</label>
                        <input type="text" id="R.I.F-provedor" name="R.I.F-provedor" placeholder="R.I.F del provedor">
                    </div>

                    <div class="columna-derecha-egreso">
                        <label for="servicio-provedor">Servicio que ofrece:</label>
                        <input type="text" id="servicio-provedor" name="servicio-provedor" placeholder="Descripción del servicio">
                    </div>

                    <div class="columna-derecha-egreso">
                        <button type="submit">Guardar Provedor</button>
                    </div>
                </form>
            </div>
            
           
        </section>
    </div> 
    <script src="../Scritpt/Menu-provedor-desplegable.js"></script>


</body>
</html>