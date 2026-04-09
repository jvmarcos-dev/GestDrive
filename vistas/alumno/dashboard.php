<div class="contenedor3">
    <div id="logout">
        <?php
        session_start(); //
        echo "(" . $_SESSION['idusuario'] . ") ";
        ?>
        <button onclick="cerrarSesion()">Logout</button>
    </div>
</div>

<div class="contenedor_alumno">
    <div id="consulta_datos">
        <img id="foto_alumno" src="">
        <label id="nombre_alumno"></label>
        <label id="apellidos_alumno"></label>
        <label id="saldo_alumno"></label>
        <label id="teorica_alumno"></label>
        <label id="info_alumno"></label>
    </div>

    <div id="consulta_proxima_practica">
        <button onclick="reservaActiva()">RESERVAS</button>
        <label id="fecha"></label>
        <label id="profesor"></label>
    </div>
    <div id="lasclases">
        <button onclick="clasesDisponibles()">TABLA CLASES</button>
        <table id="tabla_clases"></table>
    </div>

    <div id="historial_clases">
        <button onclick="historialClases()">HISTORIAL CLASES</button>
        <table id="tabla_historial"></table>
    </div>
</div>