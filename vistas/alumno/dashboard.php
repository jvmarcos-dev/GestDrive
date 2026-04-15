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
    </div>
</header>

<label>Resumen</label>

<div class="contenedor_alumno">
    <div id="consulta_datos">
        <label id="info_alumno"></label>
    </div>

    <div id="estado-teorico">
        <i class="fas fa-book"></i>
        <label>Teórico</label>
        <label id="teorica_alumno"></label>
    </div>

    <div id="practicas-restantes">
        <svg class="icono-volante" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5ZM440-164v-120q-60-12-102-54t-54-102H164q12 109 89.5 185T440-164Zm80 0q109-12 186.5-89.5T796-440H676q-12 60-54 102t-102 54v120ZM164-520h116l120-120h160l120 120h116q-15-121-105-200.5T480-800q-121 0-211 79.5T164-520Z"/></svg>
        <label>Saldo de prácticas</label>
        <label id="saldo_alumno"></label>
    </div>

    <div id="proxima-practica">
    </div>

    <div id="consulta_proxima_practica">
        <svg class="icono-calendario" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-640h560v-80H200v80Zm0 0v-80 80Zm0 560q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v227q-19-9-39-15t-41-9v-43H200v400h252q7 22 16.5 42T491-80H200Zm378.5-18.5Q520-157 520-240t58.5-141.5Q637-440 720-440t141.5 58.5Q920-323 920-240T861.5-98.5Q803-40 720-40T578.5-98.5ZM787-145l28-28-75-75v-112h-40v128l87 87Z"/></svg>
        <label>Siguiente práctica</label>
        <label id="fecha"></label>
        <label id="profesor"></label>
    </div>
    <div id="lasclases">
        <table id="tabla_clases"></table>
    </div>

    <div id="historial_clases">
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