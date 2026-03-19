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
        document.getElementById('nombre_alumno').innerHTML = datos.nombre;
        document.getElementById('apellidos_alumno').innerHTML = datos.apellidos;
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
        document.getElementById('profesor').innerHTML = datos.profesor;
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
            var fila = body.insertRow(i);
            fila.insertCell(0).innerHTML = fechaFormateada;
            fila.insertCell(1).innerHTML = horaFormateada;
            fila.insertCell(2).innerHTML = datos[i].nombre_profesor + ' ' + datos[i].apellidos_profesor;
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
            var fila = body.insertRow(i);
            fila.insertCell(0).innerHTML = fechaFormateada;
            fila.insertCell(1).innerHTML = horaFormateada;
            fila.insertCell(2).innerHTML = datos[i].nombre_profesor + ' ' + datos[i].apellidos_profesor;
            fila.insertCell(3).innerHTML = datos[i].estado;
            fila.insertCell(4).innerHTML = "<button onclick='cancelar(" + datos[i].id_clase + ")'>Cancelar</button>";
        }
    } else {
        document.getElementById('info_alumno').innerHTML = "No hay clases realizadas";
    }
}

// ============================================================
// PANEL PROFESOR
// ============================================================