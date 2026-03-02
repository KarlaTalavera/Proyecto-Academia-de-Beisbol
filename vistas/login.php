<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Liga Diamante</title>
        <link rel="icon" type="image/x-icon" href="../Recursos/icono liga.ico">
   <link rel="stylesheet" href="../Estilos/login.css">
</head>
<body>

    <div class="login-container">
        <div class="header-logo">
            <h1>Sistema de Gestión de Liga</h1>
            <small>Liga Diamante</small>
        </div>

        <form action="/dashboard" method="POST">
            <div class="form-group">
                <label for="usuario">Usuario / Correo</label>
                <input type="text" id="usuario" name="usuario" required placeholder="Ej: Goku_10">
            </div>

            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" required>
            </div>

            <div class="form-group">
                <label for="rol">Rol de Acceso</label>
                <select id="rol" name="rol" required>
                    <option value="administrador">Adminjtsdor</option>
                    <option value="dueno">Dueño de Liga</option>
                </select>
            </div>

            <button type="submit">Iniciar Sesión</button>
        </form>

        <div class="info">
    <p>¿Eres jugador o público? <br> 
    <a href="Inicio.php">Ver pagina sin loguearte</a></p>
</div>
    </div>

</body>
</html>