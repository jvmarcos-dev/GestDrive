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
    <div id="cantidad_alumnos">
        <label id="texto_alumnosActivos">Alumnos Activos</label>
        <label id="total_alumnos"></label>
    </div>

    <div id="cantidad_clases_hoy">
        <label id="texto_clasesHoy">Clases hoy</label>
        <label id="total_clasesHoy"></label>
    </div>

    <div id="cantidad_teorico">
        <label id="texto_teoricoAprobado">Teorico aprobado</label>
        <label id="total_teorico"></label>
    </div>

    <div id="gestionar_alumno">
        <button onclick="cargarAlumno()">PANEL DE CONTROL ALUMNO</button>
    </div>

    <div id="gestionar_profesor">
        <button onclick="cargarProfesores()">PROFESORES</button>
    </div>

    <div id="generar_calendario">
        <button onclick="cargarCalendario()">CLASES</button>
    </div>

    <div id="registrar_alumno">
        <button onclick="nuevoAlumno()">NUEVO ALUMNO</button>
    </div>

    <div id="registrar_profesor">
        <button onclick="nuevoProfesor()">NUEVO PROFESOR</button>
    </div>

    <div id="tabla_clases">
        <table id="latabla_clases_hoy"></table>
        <label id="noclases"></label>
    </div>
</div>