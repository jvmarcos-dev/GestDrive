<header>
    <div id="imagen-header">
        <img id="logo-header" src="imagenes/logo.png">
    </div>

    <div class="separador"></div>

    <div id="contenedor-texto-header">
        <label id="texto-header-alumno">Panel de Control del Alumno</label>
    </div>

    <div id="menu-central">
        <label class="cambiar-ventana activo">Resumen</label>
        <a class="cambiar-ventana">Reservar clases</a>
    </div>

    <div id="datos-alumno-header" onclick="cargarDesplegableAlumno(event)" >
        <img id="foto_alumno" src="">
        <label id="nombre_alumno"></label>
        <i class="fas fa-chevron-down flecha-perfil"></i>
        <div class="desplegable-header-alumno">
            <div class="item-desplegable">
                <i class="fas fa-cog"></i>
                <button class="boton-desplegable">Cambiar contraseña</button>
            </div>
            <hr>
            <div id="logout" class="item-desplegable" onclick="cerrarSesion()">
                <i class="fas fa-sign-out-alt"></i>
                <button class="boton-desplegable">Logout</button>
            </div>
        </div>
    </div>
</header>

<div id="cargar-dashboard-alumno">
    
</div>

<footer>
    <label>&copy; 2026 GestDrive Autoescuelas. Todos los derechos reservados.</label>
    <label class="enlace-footer">Soporte</label>
    <label class="enlace-footer">Privacidad</label>
</footer>