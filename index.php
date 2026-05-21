<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GestDrive - Dev</title>
    <link href="ficheros/login.css" rel="stylesheet">
    <link href="ficheros/alumno.css" rel="stylesheet">
    <link href="ficheros/admin.css" rel="stylesheet">
    <link href="ficheros/general.css" rel="stylesheet">
    <link href="ficheros/principal.css" rel="stylesheet">
    <link href="ficheros/all.css" rel="stylesheet">
    <script type="text/javascript" src="ficheros/jquery.js"></script>
    <script type="text/javascript" src="ficheros/script.js"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</head>
<body onload="inicio();">
    <div id="lacaja" class="contenedor2">
    </div>
    <div id="notificacion_global" class="notificacion-oculta">
        <div id="notificacion_icono" class="notificacion-icono-contenedor"></div>
        <div class="notificacion-contenido">
            <div id="notificacion_titulo" class="notificacion-titulo"></div>
            <div id="notificacion_mensaje" class="notificacion-mensaje"></div>
        </div>
        <button id="notificacion_cerrar" class="notificacion-cerrar" onclick="ocultarNotificacion()">
            <i class="fas fa-times"></i>
        </button>
        <div id="notificacion_progreso" class="notificacion-progreso"></div>
    </div>
</body>
</html>