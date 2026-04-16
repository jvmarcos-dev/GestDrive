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
            <hr>
            <div id="logout" class="item-desplegable">
                <i onclick="cerrarSesion()" class="fas fa-sign-out-alt"></i>
                <button class="boton-desplegable" onclick="cerrarSesion()">Logout</button>
            </div>
        </div>
    </div>
</header>

<div id="cargar-dashboard-alumno">
    
</div>