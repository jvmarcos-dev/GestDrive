<header>
    <div id="imagen-header">
        <img id="logo-header" src="imagenes/logo.png">
    </div>

    <div class="separador"></div>

    <div id="contenedor-texto-header">
        <label id="texto-header-alumno">Panel de Control del Alumno</label>
    </div>

    <div id="datos-alumno-header">
        <img id="foto_alumno" src="">
        <label onclick="cargarDesplegableAlumno(event)" id="nombre_alumno"></label>


        <div class="desplegable-header-alumno">
            <div class="item-desplegable">
                <i class="fas fa-cog"></i>
                <button class="boton-desplegable">Cambiar contraseña</button>
            </div>
            <!-- Este hr es un separador horizontal-->
            <hr>
            <div id="logout" class="item-desplegable">
                <i class="fas fa-sign-out-alt"></i>
                <button class="boton-desplegable" onclick="cerrarSesion()">Logout</button>
            </div>
        </div>
</header>

<div class="contenedor_alumno">
    <div id="consulta_datos">
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

    <div id="caja_cambio_password">
        <label>Cambiar Contraseña</label>
        <input type="password" id="contra_actual" placeholder="Contraseña actual"><br><br>
        <input type="password" id="contra_nueva" placeholder="Nueva contraseña"><br><br>
        <input type="password" id="contra_confirmar" placeholder="Repite la nueva"><br><br>
        <button onclick="cambiarPassword()">Actualizar Contraseña</button>
    </div>
</div>