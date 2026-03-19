// ============================================================
// VARIABLES GLOBALES
// ============================================================
let idUsuario;
let tipoUsuario;


// ============================================================
// INICIO Y NAVEGACIÓN
// ============================================================

function inicio() {
    $("#lacaja").load("vistas/login.html");
}


// ============================================================
// LOGIN
// ============================================================

function envio_datos() {
    //VALIDACION
    // compruebo que las cajas de texto no estén vacías	
    if ((document.getElementById('dni').value == "")) {
        document.getElementById('dni').focus();
        document.getElementById('info').innerHTML = "introduce usuario!";
    } else if ((document.getElementById('password').value == "")) {
        document.getElementById('password').focus();
        document.getElementById('info').innerHTML = "introduce contraseña!";
    } else {
        // visualizo estrella
        document.getElementById('estrella').style.visibility = 'visible';
        // deshabilito botón
        document.getElementById('boton1').disabled = true;
        // borro mensaje etiqueta
        document.getElementById('info').innerHTML = "";

        // estos 2 valores habría que pasarlos por un filtro de seguridad.
        var elusuario = document.getElementById('dni').value;
        var lacontasenia = document.getElementById('password').value;

        var url = "php/verificacion.php";
        // hago la llamada AJAX
        // utilizamos método "$.post" de jQuery

        // aL ENVIAR DATOS TIENES QUE PASAR 3 COSAS -> LA url A LA QUE QUIERES PASARLO, LOS PARÁMETROS QUE QUIERES PASAR Y POR ULTIMO EL CALLBACK
        //Un callback es una funcion que atiende la finalización de un script en la función
        //Se devuelve cuando termina de ejecutarse el script
        // solo se puede poner el nombre de la funcion del callback, no los parametros de entrada
        $.post(url, {
            eldni: elusuario.trim(),
            tcontrasenia: lacontasenia.trim()
        }, llegadaDatos1);
    }
}

// callback llamada
function llegadaDatos1(datos) {
    // oculto estrella
    document.getElementById('estrella').style.visibility = 'hidden';
    // habilito botón
    document.getElementById('boton1').disabled = false;

    // trato error de validación.
    //lo que hago es buscar lo que he mandado por php. En este caso lo estoy mandando como un json
    // y tengo que buscar en el json el tipo de usuario. En este json el tipo aparece como
    // usuario_tipo. El json seria algo como { "usuario_tipo": "alumno", "usuario_id": "5" }

    if (datos.usuario_tipo) {
        idUsuario = datos.usuario_id;
        tipoUsuario = datos.usuario_tipo;

        //cargo la vista correspondiente con su onload correspondiente.
        $("#lacaja").load("vistas/" + datos.usuario_tipo + "/dashboard.html", function () {
            window["inicio_" + datos.usuario_tipo]();
        });
    } else {
        document.getElementById('info').innerHTML = "<font color='red'>Login incorrecto</font>";
    }
}


// ============================================================
// PANEL ALUMNO - DASHBOARD
// ============================================================

function inicio_alumno() {
    //borro contenido de las label por si hubiera algo
    document.getElementById('nombre_alumno').innerHTML = "";
    document.getElementById('apellidos_alumno').innerHTML = "";
    document.getElementById('saldo_alumno').innerHTML = "";
    document.getElementById('teorica_alumno').innerHTML = "";

    let url = "php/datos_alumno.php";

    $.post(url, {
        elid: idUsuario
    }, datosAlumno);
}

// callback datos del alumno
function datosAlumno(datos) {
    if (datos.nombre) {
        if (datos.foto != '') {
            //muestro la imagen del alumno
            document.getElementById('foto_alumno').src = "imagenes/usuarios/" + datos.foto;
        } else {
            //muestro imagen predeterminada
            document.getElementById('foto_alumno').src = 'imagenes/usuarios/default.png'
        }
        document.getElementById('nombre_alumno').innerHTML = datos.nombre.charAt(0).toUpperCase() + datos.nombre.slice(1);
        document.getElementById('apellidos_alumno').innerHTML = datos.apellidos.charAt(0).toUpperCase() + datos.apellidos.slice(1);
        document.getElementById('saldo_alumno').innerHTML = datos.saldo + " clases restantes";
        document.getElementById('teorica_alumno').innerHTML = datos.teorico.toUpperCase();
    } else {
        document.getElementById('info_alumno').innerHTML = "<font color='red'>Se ha producido un ERROR</font>";
    }
}

function reservaActiva() {
    document.getElementById('fecha').innerHTML = "";
    document.getElementById('profesor').innerHTML = "";

    let url = "php/reserva_activa.php";

    $.post(url, {
        elid: idUsuario
    }, datosReserva);
}

function datosReserva(datos) {
    if (datos.proxima_clase) {

        //Le doy formato a la fecha y la hora
        let fecha = new Date(datos.fecha_hora);

        let diaSemana = fecha.toLocaleDateString('es-ES', {
            weekday: 'long'
        });
        let dia = fecha.getDate();
        let hora = fecha.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });

        let fechaFormateada = diaSemana.toUpperCase() + ' ' + dia + ' a las ' + hora + 'h';
        document.getElementById('fecha').innerHTML = fechaFormateada;
        document.getElementById('profesor').innerHTML = datos.profesor.charAt(0).toUpperCase() + datos.profesor.slice(1);
    } else {
        document.getElementById('info_alumno').innerHTML = "<font color='red'>No hay clases proximas</font>";
    }
}


// ============================================================
// PANEL ALUMNO - CLASES DISPONIBLES
// ============================================================
function clasesDisponibles() {
    let url = "php/clases_disponibles.php";
    $.get(url, datosClases);
}

function datosClases(datos) {
    var table = document.getElementById("tabla_clases");
    table.innerHTML = "";

    if (datos != 0) {
        // cabecera
        var header = table.createTHead();
        var fila = header.insertRow(0);

        var th = document.createElement('th');
        th.innerHTML = "<b>Fecha</b>";
        fila.appendChild(th);

        var th = document.createElement('th');
        th.innerHTML = "<b>Hora</b>";
        fila.appendChild(th);

        var th = document.createElement('th');
        th.innerHTML = "<b>Profesor</b>";
        fila.appendChild(th);

        var th = document.createElement('th');
        th.innerHTML = "<b>Acción</b>";
        fila.appendChild(th);

        // cuerpo
        var body = table.createTBody();
        for (var i = 0; i < datos.length; i++) {
            //Con esto parseo la fecha y hora para que salgan en un buen formato
            let fecha = new Date(datos[i].fecha_hora);

            //Aqui tomo el nombre del dia de la semana correspondiente
            let diaSemana = fecha.toLocaleDateString('es-ES', {
                weekday: 'long'
            });
            let dia = fecha.getDate();
            let hora = fecha.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });

            //Este es el resultado de la conversión
            let fechaFormateada = diaSemana.toUpperCase() + ' ' + dia;
            let horaFormateada = hora + 'h';
            let nombreProfesor = datos[i].nombre_profesor.charAt(0).toUpperCase() + datos[i].nombre_profesor.slice(1);
            let apellidosProfesor = datos[i].apellidos_profesor.charAt(0).toUpperCase() + datos[i].apellidos_profesor.slice(1);
            var fila = body.insertRow(i);
            fila.insertCell(0).innerHTML = fechaFormateada;
            fila.insertCell(1).innerHTML = horaFormateada;
            fila.insertCell(2).innerHTML = nombreProfesor + ' ' + apellidosProfesor;
            fila.insertCell(3).innerHTML = "<button onclick='reservar(" + datos[i].id_clase + ")'>Reservar</button>";
        }
    } else {
        document.getElementById('info_alumno').innerHTML = "No hay clases disponibles";
    }
}

// ============================================================
// PANEL ALUMNO - HISTORIAL
// ============================================================
function historialClases() {
    let url = "php/historial_reservas.php";

    $.post(url, {
        elid: idUsuario
    }, datosHistorial);
}

function datosHistorial(datos) {
    var table = document.getElementById("tabla_historial");
    table.innerHTML = "";

    if (datos != 0) {
        // cabecera
        var header = table.createTHead();
        var fila = header.insertRow(0);

        var th = document.createElement('th');
        th.innerHTML = "<b>Fecha</b>";
        fila.appendChild(th);

        var th = document.createElement('th');
        th.innerHTML = "<b>Hora</b>";
        fila.appendChild(th);

        var th = document.createElement('th');
        th.innerHTML = "<b>Profesor</b>";
        fila.appendChild(th);

        var th = document.createElement('th');
        th.innerHTML = "<b>Estado</b>";
        fila.appendChild(th);

        var th = document.createElement('th');
        th.innerHTML = "<b>Acción</b>";
        fila.appendChild(th);

        // cuerpo
        var body = table.createTBody();
        for (var i = 0; i < datos.length; i++) {
            //Con esto parseo la fecha y hora para que salgan en un buen formato
            let fecha = new Date(datos[i].fecha_hora);

            //Aqui tomo el nombre del dia de la semana correspondiente
            let diaSemana = fecha.toLocaleDateString('es-ES', {
                weekday: 'long'
            });
            let dia = fecha.getDate();
            let hora = fecha.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });

            //Este es el resultado de la conversión
            let fechaFormateada = diaSemana.toUpperCase() + ' ' + dia;
            let horaFormateada = hora + 'h';
            let nombreProfesor = datos[i].nombre_profesor.charAt(0).toUpperCase() + datos[i].nombre_profesor.slice(1);
            let apellidosProfesor = datos[i].apellidos_profesor.charAt(0).toUpperCase() + datos[i].apellidos_profesor.slice(1);
            let estadoFormateado = datos[i].estado.charAt(0).toUpperCase() + datos[i].estado.slice(1);
            var fila = body.insertRow(i);
            fila.insertCell(0).innerHTML = fechaFormateada;
            fila.insertCell(1).innerHTML = horaFormateada;
            fila.insertCell(2).innerHTML = nombreProfesor + ' ' + apellidosProfesor;
            fila.insertCell(3).innerHTML = estadoFormateado;
            fila.insertCell(4).innerHTML = "<button onclick='cancelar(" + datos[i].id_clase + ")'>Cancelar</button>";
        }
    } else {
        document.getElementById('info_alumno').innerHTML = "No hay clases realizadas";
    }
}

// ============================================================
// PANEL ALUMNO - BOTON RESERVAR
// ============================================================

function reservar(idClase) {
    let url = "php/reservar_clase.php";

    $.post(url, {
        elid: idUsuario,
        laclase: idClase
    }, reservarClase);
}

function reservarClase(datos) {
    if (datos == 1) {
        //Aqui cuando haga el sistema de notificacion pondre un mensaje de reserva exitosa
        document.getElementById('info_alumno').innerHTML = "Reserva realizada correctamente";
        clasesDisponibles();
        historialClases();
    } else if (datos == -1) {
        document.getElementById('info_alumno').innerHTML = "No tienes saldo suficiente";
    } else if (datos == -2) {
        document.getElementById('info_alumno').innerHTML = "No puedes tener más de 2 clases reservadas simultáneamente.";
    } else if (datos == -3){
        document.getElementById('info_alumno').innerHTML = "No puedes reservas 2 clases con una diferencia <45 minutos.";
    } else if (datos == -4){
        document.getElementById('info_alumno').innerHTML = "Esta clase ya no está disponible.";
        clasesDisponibles();
    }
}

// ============================================================
// PANEL PROFESOR
// ============================================================