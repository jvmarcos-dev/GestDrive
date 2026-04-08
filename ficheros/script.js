// ============================================================
// VARIABLES GLOBALES
// ============================================================
let idUsuario;
let tipoUsuario;
let idAlumnoSeleccionadoAdmin;

let timeoutBusqueda;
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

        var url = "php/login/verificacion.php";
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

    let url = "php/alumno/datos_alumno.php";

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
        document.getElementById('notificacion_global').innerHTML = "<font color='red'>Se ha producido un ERROR</font>";
    }
}

function reservaActiva() {
    document.getElementById('fecha').innerHTML = "";
    document.getElementById('profesor').innerHTML = "";

    let url = "php/alumno/reserva_activa.php";

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
    let url = "php/alumno/clases_disponibles.php";
    $.post(url, datosClases);
}

function datosClases(datos) {
    if (tipoUsuario == "alumno") {
        var table = document.getElementById("tabla_clases");
    } else {
        var table = document.getElementById("proximas_clases_alumno");
    }
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
        if (tipoUsuario == "alumno") {
            document.getElementById('info_alumno').innerHTML = "No hay clases disponibles";
        } else {
            document.getElementById('no_clases_proximas').innerHTML = "No hay clases disponibles";
        }
    }
}

// ============================================================
// PANEL ALUMNO - HISTORIAL
// ============================================================
function historialClases() {
    let url = "php/alumno/historial_reservas.php";

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
            fila.insertCell(4).innerHTML = "<button id='" + i + "' onclick='cancelar(" + datos[i].id_reserva + ", " + i + ")'>Cancelar</button>";
        }
    } else {
        document.getElementById('info_alumno').innerHTML = "No hay clases realizadas";
    }
}

// ============================================================
// PANEL ALUMNO/ADMIN - BOTON RESERVAR
// ============================================================

function reservar(idClase) {
    let url = "php/alumno/reservar_clase.php";

    if (tipoUsuario == "alumno") {
        $.post(url, {
            elid: idUsuario,
            laclase: idClase
        }, reservarClase);
    } else {
        $.post(url, {
            elid: idAlumnoSeleccionadoAdmin,
            laclase: idClase
        }, reservarClase);
    }
}

function reservarClase(datos) {
    if (datos == 1) {
        //Aqui cuando haga el sistema de notificacion pondre un mensaje de reserva exitosa
        document.getElementById('notificacion_global').innerHTML = "Reserva registrada correctamente";
        if (tipoUsuario == "alumno") {
            clasesDisponibles();
            historialClases();
            inicio_alumno();
        } else {
            seleccionarAlumno(idAlumnoSeleccionadoAdmin);
        }
    } else if (datos == -1) {
        document.getElementById('notificacion_global').innerHTML = "Saldo de clases insuficiente";
    } else if (datos == -2) {
        document.getElementById('notificacion_global').innerHTML = "Límite máximo de 2 reservas simultáneas alcanzado.";
    } else if (datos == -3) {
        document.getElementById('notificacion_global').innerHTML = "Debe existir un margen mínimo de 45 minutos entre reservas.";
    } else if (datos == -4) {
        document.getElementById('notificacion_global').innerHTML = "La clase seleccionada ya no se encuentra disponible.";
        clasesDisponibles();
    }
}

// ============================================================
// PANEL ALUMNO - BOTON CANCELAR
// ============================================================

function cancelar(idReserva, idBoton) {
    //Al llamar a esta funcion antes tendré que hacer un botón de confirmar y ya al confirmar entonces se cancele.
    //En este botón tendré que mirar si ha cancelado a tiempo o tarde para variar el texto.
    let url = "php/alumno/cancelar_clase.php";

    $.post(url, {
        lareserva: idReserva
    }, function (datos) {
        // Llamamos manualmente a la función pasando ambos parámetros
        cancelarClase(datos, idBoton);
    });
}

function cancelarClase(datos, idBoton) {
    let boton = document.getElementById(idBoton);
    if (datos == 1 || datos == 2) {
        if (datos == 1) {
            //Aqui cuando haga el sistema de notificacion pondre un mensaje de reserva exitosa
            document.getElementById('notificacion_global').innerHTML = "Clase cancelada correctamente";
        } else if (datos == 2) {
            document.getElementById('notificacion_global').innerHTML = "Has cancelado la clase tarde. Tu saldo no será devuelto";
        }
        if (boton) {
            // El botón está en una celda (td). El padre del botón es el td.
            let celdaBoton = boton.parentElement;
            // El hermano anterior de esa celda es la celda de "Estado"
            let celdaEstado = celdaBoton.previousElementSibling;
            celdaEstado.innerHTML = (datos == 1) ? "Cancelada" : "Cancelada Tarde";
            boton.disabled = true;
        }
        clasesDisponibles();
        inicio_alumno();
        reservaActiva();
    } else {
        document.getElementById('notificacion_global').innerHTML = "Error al procesar la cancelación";
    }
}

// ============================================================
// PANEL ADMINISTRADOR - DASHBOARD
// ============================================================

function inicio_admin() {
    //Aqui voy a llamar todas a todas las funciones que aparecen en el dashboard
    alumnosTotales();
    clasesHoy();
    teoricoApto();
    listaClasesHoy();
}


function alumnosTotales() {
    let url = "php/admin/alumnos_activos.php";
    $.get(url, cantidadAlumnos);
}

function cantidadAlumnos(datos) {
    document.getElementById('total_alumnos').innerHTML = datos.cant_alumnos;
}


function clasesHoy() {
    let url = "php/admin/clases_hoy.php";
    $.get(url, cantidadClases);
}

function cantidadClases(datos) {
    document.getElementById('total_clasesHoy').innerHTML = datos.clases_hoy;
}


function teoricoApto() {
    let url = "php/admin/alumnos_teorico_apto.php";
    $.get(url, cantidadTeorico);
}

function cantidadTeorico(datos) {
    document.getElementById('total_teorico').innerHTML = datos.cant_teorico;
}

function listaClasesHoy() {
    let url = "php/admin/lista_clases_hoy.php";

    $.get(url, datosListaClases);
}

function datosListaClases(datos) {
    var table = document.getElementById("latabla_clases_hoy");
    table.innerHTML = "";

    if (datos != 0) {
        // cabecera
        var header = table.createTHead();
        var fila = header.insertRow(0);

        var th = document.createElement('th');
        th.innerHTML = "<b>Hora</b>";
        fila.appendChild(th);

        var th = document.createElement('th');
        th.innerHTML = "<b>Alumno</b>";
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
            let hora = fecha.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });

            //Este es el resultado de la conversión
            let horaFormateada = hora + 'h';
            let nombreAlumno = datos[i].nombre_alumno.charAt(0).toUpperCase() + datos[i].nombre_alumno.slice(1);
            let apellidosAlumno = datos[i].apellidos_alumno.charAt(0).toUpperCase() + datos[i].apellidos_alumno.slice(1);
            let nombreProfesor = datos[i].nombre_profesor.charAt(0).toUpperCase() + datos[i].nombre_profesor.slice(1);
            let apellidosProfesor = datos[i].apellidos_profesor.charAt(0).toUpperCase() + datos[i].apellidos_profesor.slice(1);
            var fila = body.insertRow(i);
            fila.insertCell(0).innerHTML = horaFormateada;
            fila.insertCell(1).innerHTML = nombreAlumno + ' ' + apellidosAlumno;
            fila.insertCell(2).innerHTML = nombreProfesor + ' ' + apellidosProfesor;
            fila.insertCell(3).innerHTML = "<button onclick='seleccionarAlumno(" + datos[i].id_alumno + ")'>Ver Ficha</button>";
        }
    } else {
        document.getElementById('noclases').innerText = "No hay clases hoy";
    }
}

function cargarAlumno() {
    $("#lacaja").load("vistas/admin/alumno.html", function () {
        listado_alumnos_admin();
    });
}

function listado_alumnos_admin() {
    clearTimeout(timeoutBusqueda);
    let busqueda = document.getElementById('buscar_alumno').value;

    //hago un timeout ya que estoy usando un evento oninput. Esto significa que cada vez que introduzco
    //un caracter en la barra de busqueda, va a llamar a esta funcion, y por tanto, si el usuario que teclea
    //escribe rapido la busqueda, estaria haciendo una llamada por cada caracter, cosa que si hay miles de resultados
    //seria muy lento. De esta forma solo aparecerán los resultados cuando pare un momento, tiempo casi imperteptible
    timeoutBusqueda = setTimeout(function () {
        let url = "php/admin/buscar_alumno.php";
        $.post(url, {
            labusqueda: busqueda
        }, busquedaAlumnos);
    }, 250);
}

function busquedaAlumnos(datos) {
    let contenedor = document.getElementById('resultados_busqueda');
    contenedor.innerHTML = "";

    if (datos != 0 && datos.length > 0) {
        for (let i = 0; i < datos.length; i++) {
            let nombre = datos[i].nombre.charAt(0).toUpperCase() + datos[i].nombre.slice(1);
            let apellidos = datos[i].apellidos.charAt(0).toUpperCase() + datos[i].apellidos.slice(1);
            let imagen = datos[i].foto;
            // con esto cada alumno que aparezca en la lista será un div nuevo
            // al hacer click en el, iremos a la funcion seleccionarAlumno de este alumno que estamos llamando
            // y obtendremos todos sus datos en una nueva pantalla.
            contenedor.innerHTML += "<div style='cursor:pointer; padding:5px; border-bottom:1px solid #ccc;' onclick='seleccionarAlumno(" + datos[i].id + ")'>" +
                "<img src='"+imagen + "'>" + " " + nombre + " " + apellidos + "</div>";
        }
    } else {
        contenedor.innerHTML = "<div style='padding:5px;'>No se han encontrado alumnos.</div>";
    }
}

function seleccionarAlumno(idAlumno) {
    idAlumnoSeleccionadoAdmin = idAlumno;
    let url = "php/alumno/datos_alumno.php";

    $.post(url, {
        elid: idAlumno
    }, function (datos) {
        //comprobamos si el alumno existe
        if (!datos.nombre) {
            document.getElementById('notificacion_global').innerText = "Este alumno ya no existe en el sistema.";

            //recargamos la busqueda para que el alumno deje de aparecer
            listado_alumnos_admin();
            return;
        }

        //si existe, cargamos la vista del alumno
        $("#lacaja").load("vistas/admin/datosAlumno.html", function () {
            datosAlumnoAdmin(datos);

            //cargamos el historial
            $.post("php/alumno/historial_reservas.php", {
                elid: idAlumno
            }, historialAlumnoAdmin);

            //cargamos las clases disponibles
            clasesDisponibles();
        });

    });
}

function datosAlumnoAdmin(datos) {
    //div datos_alumno_admin
    document.getElementById('foto_alumno_admin').src = datos.foto;
    document.getElementById('nombre_alumno_admin').innerText = datos.nombre + " " + datos.apellidos;
    document.getElementById('dni_alumno_admin').innerText = datos.dni;
    document.getElementById('email_alumno_admin').innerText = datos.email;
    document.getElementById('telefono_alumno_admin').innerText = datos.telefono;

    //div estado_academico
    document.getElementById('saldo_alumno_admin').innerText = "Saldo: " + datos.saldo;

    //div estado_teorico_admin
    document.getElementById('teoria_admin').innerText = datos.teorico;
}

function historialAlumnoAdmin(datos) {
    var table = document.getElementById("el_historial_alumno");
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
            fila.insertCell(4).innerHTML = "<button onclick='cancelarClaseAdmin(" + datos[i].id_reserva + ", this)'>Cancelar</button>";
        }
    } else {
        document.getElementById('info_alumno_admin').innerText = "No hay clases realizadas";
    }
}

function cancelarClaseAdmin(idReserva, boton) {
    //Luego en vez de este confirm lo que haré es un menú que aparezca encima de la pantalla
    //Y puedas pulsar uno de los dos botones y en funcion de cual pulses se haga una cosa u otra
    let decision = confirm("¿Quieres devolver el saldo de esta clase al alumno?\n\n- Si.\n- No.");

    //convertimos el true/false en 1/0 para enviarlo a PHP
    let valorDevolver = decision ? 1 : 0;

    let url = "php/admin/cancelar_clase_admin.php";

    $.post(url, {
        lareserva: idReserva,
        devolver_saldo: valorDevolver
    }, function (datos) {
        // Llamamos manualmente a la función pasando ambos parámetros
        cancelarClaseAdminCallback(datos, boton);
    });
}

function cancelarClaseAdminCallback(datos, boton) {
    if (datos.trim() == 1 || datos.trim() == 2) {
        if (datos.trim() == 1) {
            //Aqui cuando haga el sistema de notificacion pondre un mensaje de reserva exitosa
            document.getElementById('notificacion_global').innerHTML = "Clase cancelada correctamente";
            let labelSaldo = document.getElementById('saldo_alumno_admin');
            if (labelSaldo) {

                //ahora mismo está como un texto completo y necesito extraer cual es el numero del saldo. Por ejemplo Saldo: 5
                //para ello separo el texto con el espacio que hay de por medio, así esto devuelve un array. [Saldo:, 5]
                let textoSeparado = labelSaldo.innerText.split(" ");
                //cogemos la posición 1 del array (el número) y lo pasamos a entero
                let saldoActual = parseInt(textoSeparado[1]);
                //sumamos 1 y reescribimos
                labelSaldo.innerText = "Saldo: " + (saldoActual + 1);
            }
        } else if (datos.trim() == 2) {
            document.getElementById('notificacion_global').innerHTML = "Al alumno le quedaban -48 horas, su saldo no será devuelto";
        }

        if (boton) {
            let celdaBoton = boton.parentElement;
            let fila = celdaBoton.parentElement;

            // Cambiamos el texto de la celda de Estado a "Cancelada"
            if (datos.trim() == 1) {
                fila.cells[3].innerHTML = "Cancelada";
            } else {
                fila.cells[3].innerHTML = "Cancelada Tarde";
            }
            boton.disabled = true;
        }
        clasesDisponibles();
    } else {
        document.getElementById('notificacion_global').innerHTML = "Error al procesar la cancelación";
    }
}

function volverAdmin() {
    $("#lacaja").load("vistas/admin/dashboard.html", function () {
        inicio_admin();
    });
}

function aprobarTeorico() {
    let url = "php/admin/aprobar_teorico.php";
    $.post(url, {
        elid: idAlumnoSeleccionadoAdmin
    }, datosTeorico);
}

function datosTeorico(datos) {
    //aqui luego haré un boton de confirmar cambios que saldrá antes de esto.
    if (datos == 1) {
        document.getElementById('teoria_admin').innerText = "apto";
    } else {
        document.getElementById('notificacion_global').innerText = "Se ha producido un error.";
    }
}

function actualizarSaldo(operacion) {
    let inputSaldo = document.getElementById('recargar_saldo');
    let sumaSaldo = inputSaldo.value;

    //compruebo que introduce un numero al pulsar un boton y en caso de introducirlo que no sea negativo
    if (sumaSaldo == "" || sumaSaldo <= 0) {
        document.getElementById('notificacion_global').innerText = "Introduce una cantidad válida.";
        inputSaldo.focus();
        return;
    }

    let url = "php/admin/modificar_saldo.php";
    $.post(url, {
        elid: idAlumnoSeleccionadoAdmin,
        saldo_nuevo: sumaSaldo,
        laoperacion: operacion
    }, datosSaldo);
}

function datosSaldo(datos) {
    //aqui luego haré un boton de confirmar cambios que saldrá antes de esto.
    if (datos == 0) {
        document.getElementById('notificacion_global').innerText = "Se ha producido un error.";
    } else if (datos == -1) {
        document.getElementById('notificacion_global').innerText = "No puedes restar esa cantidad de saldo.";
    } else {
        document.getElementById('saldo_alumno_admin').innerText = "Saldo: " + datos.elsaldo;
    }

    document.getElementById('recargar_saldo').value = "";
    document.getElementById('recargar_saldo').focus();
}

function archivarAlumno() {
    let url = "php/admin/archivar_alumno.php";

    $.post(url, {
        elid: idAlumnoSeleccionadoAdmin,
    }, datosArchivo);
}

function datosArchivo(datos) {
    let respuesta = datos.trim();
    if (respuesta == -1) {
        document.getElementById('notificacion_global').innerText = "El alumno seleccionado ya ha sido archivado o no existe"
        volverAdmin();
    } else if (respuesta == -2) {
        document.getElementById('notificacion_global').innerHTML = "El alumno debe tener el teorico apto";
    } else if (respuesta == -3) {
        document.getElementById('notificacion_global').innerHTML = "El alumno debe tener 18 años o más.";
    } else if (respuesta == 1) {
        document.getElementById('notificacion_global').innerHTML = "El alumno ha sido archivado.";
        volverAdmin();
    } else {
        document.getElementById('notificacion_global').innerHTML = "Se ha producido un error.";
    }
}

function cargarProfesores(){
    $("#lacaja").load("vistas/admin/profesor.html", function () {
        listadoProfesores();
    });
}

function listadoProfesores() {
    let url = "php/admin/lista_profesores.php";

    $.get(url, listadoProfesoresCallback);
}

function listadoProfesoresCallback(datos) {
    var table = document.getElementById("datos_profesores");
    table.innerHTML = "";

    if (datos != 0) {
        // cabecera
        var header = table.createTHead();
        var fila = header.insertRow(0);

        var th = document.createElement('th');
        th.innerHTML = "<b>Foto</b>";
        fila.appendChild(th);

        var th = document.createElement('th');
        th.innerHTML = "<b>DNI</b>";
        fila.appendChild(th);

        var th = document.createElement('th');
        th.innerHTML = "<b>Nombre</b>";
        fila.appendChild(th);

        var th = document.createElement('th');
        th.innerHTML = "<b>Apellidos</b>";
        fila.appendChild(th);

        var th = document.createElement('th');
        th.innerHTML = "<b>Email</b>";
        fila.appendChild(th);

        var th = document.createElement('th');
        th.innerHTML = "<b>Telefono</b>";
        fila.appendChild(th);

        var th = document.createElement('th');
        th.innerHTML = "<b>Num licencia</b>";
        fila.appendChild(th);

        // cuerpo
        var body = table.createTBody();
        for (var i = 0; i < datos.length; i++) {
            //con esto convierto la primera letra en mayuscula y dejo todo lo demas igual 
            // (slice coge desde el caracter 1 hasta el final para concatenar sin repetir la primera letra)
            let nombreProfesor = datos[i].nombre.charAt(0).toUpperCase() + datos[i].nombre.slice(1);
            let apellidosProfesor = datos[i].apellidos.charAt(0).toUpperCase() + datos[i].apellidos.slice(1);
            var fila = body.insertRow(i);
            fila.insertCell(0).innerHTML = datos[i].foto;
            fila.insertCell(1).innerHTML = datos[i].dni;
            fila.insertCell(2).innerHTML = nombreProfesor;
            fila.insertCell(3).innerHTML = apellidosProfesor;
            fila.insertCell(4).innerHTML = datos[i].email;
            fila.insertCell(5).innerHTML = datos[i].telefono;
            fila.insertCell(6).innerHTML = datos[i].licencia;
        }
    } else {
        document.getElementById('no_profesores').innerText = "No hay profesores registrados.";
    }
}

function cargarCalendario(){
    $("#lacaja").load("vistas/admin/generar_calendario.html");
}

function generoClases() {
    let url = "php/admin/generar_clases.php";

    $.post(url, {
    }, generoClasesCallback);
}

function generoClasesCallback(datos) {
    let respuesta = datos.trim();
    if (respuesta == 1) {
        document.getElementById('notificacion_global').innerText = "Las clases han sido creadas correctamente"
    } else {
        document.getElementById('notificacion_global').innerText = "Las clases ya estaban generadas"
    }
}

function nuevoAlumno(){
    $("#lacaja").load("vistas/admin/registroAlumno.php");
}

function registroAlumno(){
		// borro div mensaje
		document.getElementById('notificacion_global').innerHTML = ""
		// visualizo la estrellita
		document.getElementById('estrella').style.visibility = 'visible';
		// inhabilito botón de realizar alta
		document.getElementById('elboton').disabled = true;

		//RECUPERO -> los datos del formulario
		let los_datos_f = new FormData(document.getElementById("formulario1"));

		//llamada AJAX
		$.ajax({
			url: "php/admin/registrar_alumno.php", //script php que quiero ejecutar
			type: "POST", //forma en la que voy a pasar la información al formulario -> Metodo de envio de informacion, en este caso es POST
			dataType: "HTML", //el formato de los datos que envía el servidor (siempre JSON, esta es una excepcion)
			data: los_datos_f, //Datos que le paso al script
			cache: false,
			contentType: false,
			processData: false
		}).done(function(datos)
			// esta función es el callback()
			// y en el parámetro "datos" tendré toda la información que me devuelva el script php (si devolviese ALGO...)
			// es obligatorio definir un callback en una funcion asincrona utilizando ajax
			{
				$("#estrella").css("visibility", "hidden");
				// // document.getElementById('estrella').style.visibility='hidden';
				// trato mensaje devuelto por el servidor
                let respuesta = datos.trim();
				if (respuesta == 1) {
					document.getElementById('notificacion_global').innerHTML = "<b><font face='Calibri' color='green' size='4'>EXITO!! en el ALTA</font></b>";
					// limpio cajas formulario
					document.formulario1.reset();
					limpio_pantalla(0, 'formulario1');
				} else {
					//aqui podemos tratar todos los tipos de error que se produzcan
					document.getElementById('notificacion_global').innerHTML = "<b><font face='Calibri' color='red' size='4'>ERROR ALTA usuario ("+datos+")</font></b>";
					limpio_pantalla(1, 'formulario1');
				}
				// Habilito botón de realizar alta
				document.getElementById('elboton').disabled = false;
			});
	}

function limpio_pantalla(estado, id_formulario) {
		// oculto estrella
		document.getElementById('estrella').style.visibility = 'hidden';
		// habilito botones
		document.getElementById('elboton').disabled = false;

        let form=document.getElementById(id_formulario);

		// no hay error
		// dejo todo en situación inicial
		if (estado == 0) {
			// limpio cajas
			form.reset();
			form.dni.select();
		}
		// hay error	
		else {
			// selecciono el contenido de la caja de texto codc
			form.dni.select();
		}
	}

function visualizo(id_input, id_imagen) {
    let input = document.getElementById(id_input);
    let imagen_preview = document.getElementById(id_imagen);

    // compruebo si hay un archivo seleccionado. Esto lo hago con la primera condicion del if que devolverá true.
    // la segunda condicion es porque html trata el tipo file como un array, ya que existe la posibilidad de añadir muchas imagenes.
    // por tanto tengo que comprobar que en la primera posicion (y en este caso unica) hay algo.

    if (input.files && input.files[0]) {
        //creo una url temporal que muestro en el formulario con la imagen nueva, es decir, muestro la imagen nueva.
        imagen_preview.src = URL.createObjectURL(input.files[0]);
    }
}

function nuevoProfesor(){
    $("#lacaja").load("vistas/admin/registroProfesor.html");
}

function registroProfesor(){
		// borro div mensaje
		document.getElementById('notificacion_global').innerHTML = ""
		// visualizo la estrellita
		document.getElementById('estrella').style.visibility = 'visible';
		// inhabilito botón de realizar alta
		document.getElementById('elboton').disabled = true;

		//RECUPERO -> los datos del formulario
		let los_datos_f = new FormData(document.getElementById("formulario2"));

		//llamada AJAX
		$.ajax({
			url: "php/admin/registrar_profesor.php", //script php que quiero ejecutar
			type: "POST", //forma en la que voy a pasar la información al formulario -> Metodo de envio de informacion, en este caso es POST
			dataType: "HTML", //el formato de los datos que envía el servidor (siempre JSON, esta es una excepcion)
			data: los_datos_f, //Datos que le paso al script
			cache: false,
			contentType: false,
			processData: false
		}).done(function(datos)
			// esta función es el callback()
			// y en el parámetro "datos" tendré toda la información que me devuelva el script php (si devolviese ALGO...)
			// es obligatorio definir un callback en una funcion asincrona utilizando ajax
			{
				$("#estrella").css("visibility", "hidden");
				// // document.getElementById('estrella').style.visibility='hidden';
				// trato mensaje devuelto por el servidor
                let respuesta = datos.trim();
				if (respuesta == 1) {
					document.getElementById('notificacion_global').innerHTML = "<b><font face='Calibri' color='green' size='4'>EXITO!! en el ALTA</font></b>";
					// limpio cajas formulario
					document.formulario2.reset();
					limpio_pantalla(0, 'formulario2');
				} else {
					//aqui podemos tratar todos los tipos de error que se produzcan
					document.getElementById('notificacion_global').innerHTML = "<b><font face='Calibri' color='red' size='4'>ERROR ALTA usuario ("+datos+")</font></b>";
					limpio_pantalla(1, 'formulario2');
				}
				// Habilito botón de realizar alta
				document.getElementById('elboton').disabled = false;
			});
	}