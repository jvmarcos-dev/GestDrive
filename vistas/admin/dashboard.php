<div id="vista-admin">
    <aside id="admin-sidebar">
        <div id="imagen-header">
            <img id="logo-header" src="imagenes/logo.png">
        </div>

        <div class="sidebar-nav">
            <div class="item-sidebar activo" onclick="activarMenu(this, 'dashboard')">
                <i class="fas fa-chart-pie"></i>
                <label class="texto-menu">Dashboard</label>
            </div>

            <div class="item-sidebar" onclick="activarMenu(this, 'alumnos')">
                <i class="fas fa-user-graduate"></i>
                <label class="texto-menu">Alumnos Activos</label>
            </div>

            <div class="item-sidebar" onclick="activarMenu(this, 'profesores')">
                <i class="fas fa-chalkboard-teacher"></i>
                <label class="texto-menu">Profesores</label>
            </div>

            <div class="item-sidebar" onclick="activarMenu(this, 'calendario')">
                <i class="fas fa-calendar-alt"></i>
                <label class="texto-menu">Gestión de Clases</label>
            </div>

            <div class="item-sidebar" onclick="activarMenu(this, 'registroAlumno')">
                <i class="fas fa-graduation-cap"></i>
                <label class="texto-menu">Nuevo alumno</label>
            </div>

             <div class="item-sidebar" onclick="activarMenu(this, 'registroProfesor')">
                <i class="fas fa-user-plus"></i>
                <label class="texto-menu">Nuevo profesor</label>
            </div>
        </div>

        <div class="sidebar-footer">
            <div class="item-sidebar item-logout" onclick="cerrarSesion()">
                <i class="fas fa-sign-out-alt"></i>
                <label class="texto-menu">Cerrar Sesión</label>
            </div>
        </div>
    </aside>

    <div id="overlay-sidebar" onclick="alternarSidebar()"></div>

    <div id="admin-main-content">
        <div class="admin-topbar-mobile">
            <i class="fas fa-bars" id="btn-mobile-sidebar" onclick="alternarSidebar()"></i>
            <label class="texto-header-mobile">GestDrive Admin</label>
        </div>

        <div id="cargar-dashboard-admin">
        </div>
    </div>
</div>