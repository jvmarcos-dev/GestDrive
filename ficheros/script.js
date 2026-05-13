// ============================================================
// VARIABLES GLOBALES
// ============================================================
let tipoUsuario;
let idAlumnoSeleccionadoAdmin;

let timeoutBusqueda;
let datosClasesGlobal = [];
let temporizadorNotificacion;

let reservaActivaParaCancelar = null;
let botonActivoParaCancelar = null;
// ============================================================
// INICIO Y NAVEGACIÓN
// ============================================================

function inicio() {
    $("#lacaja").load("vistas/general.html");
}


// ============================================================
// LOGIN
// ============================================================

function cargarPanel() {
    $.post("php/login/comprobar_sesion.php", function (datos) {
        if (datos == 0) {
            //si no hay sesión, cargamos la vista del formulario de login
            $("#lacaja").load("vistas/login.html");
        } else {
            tipoUsuario = datos.trim();
            //si hay sesión, redirigimos a la vista correspondiente. Datos siempre tiene el tipo de usuario por lo que no hay que especificar
            $("#lacaja").load("vistas/" + datos + "/dashboard.php", function () {
                window["inicio_" + datos]();
            });
        }
    });
}

function envio_datos() {
    //VALIDACION
    // compruebo que las cajas de texto no estén vacías	
    if ((document.getElementById('dni').value == "")) {
        document.getElementById('dni').focus();
        document.getElementById('info').style.visibility = 'visible';
        document.getElementById('info').innerHTML = "Debes introducir el usuario";
    } else if ((document.getElementById('password').value == "")) {
        document.getElementById('password').focus();
        document.getElementById('info').style.visibility = 'visible';
        document.getElementById('info').innerHTML = "Debes introducir la contraseña";
    } else {
        // visualizo estrella
        document.getElementById('boton1').innerHTML = '<img id="estrella" src="imagenes/estrella2.svg" style="display:block; margin: 0 auto; width:45px" />';
        // deshabilito botón
        document.getElementById('boton1').disabled = true;
        // borro mensaje etiqueta
        document.getElementById('info').innerHTML = "";
        document.getElementById('info').style.visibility = 'hidden';

        // estos 2 valores habría que pasarlos por un filtro de seguridad.
        let elusuario = document.getElementById('dni').value;
        let lacontasenia = document.getElementById('password').value;

        // tenemos que comprobar si el check está marcado
        let elcheck = 0;
        if (document.getElementById('recordar').checked) {
            elcheck = 1;
        }

        var url = "php/login/verificacion.php";
        // hago la llamada AJAX
        // utilizamos método "$.post" de jQuery

        $.post(url, {
            eldni: elusuario.trim(),
            tcontrasenia: lacontasenia.trim(),
            marcado: elcheck
        }, llegadaDatos1);
    }
}

// callback llamada
function llegadaDatos1(datos) {
    // oculto estrella
    document.getElementById('boton1').innerHTML = "Iniciar Sesión";
    // habilito botón
    document.getElementById('boton1').disabled = false;

    // trato error de validación.
    //lo que hago es buscar lo que he mandado por php. En este caso lo estoy mandando como un json
    // y tengo que buscar en el json el tipo de usuario. En este json el tipo aparece como
    // usuario_tipo. El json seria algo como { "usuario_tipo": "alumno", "usuario_id": "5" }

    if (datos.usuario_tipo) {

        tipoUsuario = datos.usuario_tipo.trim();
        //cargo la vista correspondiente con su onload correspondiente.
        $("#lacaja").load("vistas/" + datos.usuario_tipo + "/dashboard.php", function () {
            window["inicio_" + datos.usuario_tipo]();
        });
    } else {
        document.getElementById('info').style.visibility = 'visible';
        document.getElementById('info').innerHTML = "Login incorrecto";
    }
}

function cerrarSesion() {
    $.post("php/login/logout.php", function () {
        //redirigo a la vista general
        $("#lacaja").load("vistas/general.html");
        mostrarNotificacionGlobal("Operación exitosa", "Has cerrado sesión correctamente.", "exito");
    });
}


// ============================================================
// PANEL ALUMNO - DASHBOARD
// ============================================================

function inicio_alumno() {
    $("#cargar-dashboard-alumno").load("vistas/alumno/principal.html", function () {
        //borro contenido de las label por si hubiera algo
        document.getElementById('nombre_alumno').innerHTML = "";
        document.getElementById('saldo_alumno').innerHTML = "";
        document.getElementById('teorica_alumno').innerHTML = "";

        let url = "php/alumno/datos_alumno.php";

        $.post(url, {}, datosAlumno);
    });
}

// callback datos del alumno
function datosAlumno(datos) {
    if (datos.nombre) {
        reservaActiva();
        historialClases();
        if (datos.foto != '') {
            //muestro la imagen del alumno
            document.getElementById('foto_alumno').src = datos.foto;
        } else {
            //muestro imagen predeterminada
            document.getElementById('foto_alumno').src = 'imagenes/usuarios/default.png'
        }
        document.getElementById('nombre_alumno').innerHTML = datos.nombre.charAt(0).toUpperCase() + datos.nombre.slice(1) +
            " " + datos.apellidos.charAt(0).toUpperCase() + datos.apellidos.slice(1);
        document.getElementById('saldo_alumno').innerHTML = datos.saldo
        document.getElementById('resultado2').innerHTML = "clases restantes";
        if (datos.teorico == "apto") {
            document.getElementById('teorica_alumno').innerHTML = "<label class='estado-apto'>" + datos.teorico.toUpperCase() + "</label>";
        } else {
            document.getElementById('teorica_alumno').innerHTML = "<label class='estado-pendiente'>" + datos.teorico.toUpperCase() + "</label>";
        }
    } else {
        mostrarNotificacionGlobal("Ha habido un error", "Se ha producido un error al procesar los datos.", "error");
    }
}

function reservaActiva() {
    document.getElementById('fecha').innerHTML = "";
    document.getElementById('profesor').innerHTML = "";

    let url = "php/alumno/reserva_activa.php";

    $.post(url, {}, datosReserva);
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

        let fechaFormateada = diaSemana.toUpperCase() + ' ' + dia + ', ' + hora + 'h';
        document.getElementById('fecha').innerHTML = fechaFormateada;
        document.getElementById('profesor').innerHTML = datos.profesor.charAt(0).toUpperCase() + datos.profesor.slice(1);
    } else {
        document.getElementById('info_alumno').style.display = "block";
        document.getElementById('info_alumno').innerHTML = "No hay clases proximas";
    }
}


// ============================================================
// PANEL ALUMNO - CLASES DISPONIBLES
// ============================================================
function clasesDisponibles() {
    let url = "php/alumno/clases_disponibles.php";
    $.post(url, datosClases);
}

//genero el select
function datosClases(datos) {
    //añado las clases al array de datosClasesGlobal para así poder trabajar con ello.
    //esto lo hago, ya que luego si el usuario cambia el valor del select, cambiaré lo que es muestra en pantalla
    //y de esta forma ahorro pedir al servidor otra vez todos los datos
    datosClasesGlobal = datos;
    let selectProfesor = document.getElementById("filtro-profesor");

    if (datos != 0) {
        if (selectProfesor) {
            selectProfesor.innerHTML = '<option value="todos">Todos</option>';
            //array para no repetir ids
            let profesoresAñadidos = [];

            for (let i = 0; i < datos.length; i++) {
                let idProfesor = datos[i].id_profesor;
                let nombreP = datos[i].nombre_profesor.charAt(0).toUpperCase() + datos[i].nombre_profesor.slice(1);
                let apellidosP = datos[i].apellidos_profesor.charAt(0).toUpperCase() + datos[i].apellidos_profesor.slice(1);
                let nombreCompleto = nombreP + ' ' + apellidosP;

                //si el ID de este profesor aún no está en el array, se añade al select
                if (!profesoresAñadidos.includes(idProfesor)) {
                    //se añade al array para marcarlo como añadido
                    profesoresAñadidos.push(idProfesor);

                    //creo un elemento option de html
                    let option = document.createElement('option');
                    //pongo como value del option el id del profesor
                    option.value = idProfesor;
                    //pongo como texto que se ve el nombre completo
                    option.textContent = nombreCompleto;
                    //inserto este option justo debajo del ultimo creado
                    selectProfesor.appendChild(option);
                }
            }
        }
        pintoClases('todos');
    } else {
        if (tipoUsuario == "alumno") {
            document.getElementById('info-clases-alumno').innerHTML = "No hay clases disponibles";
        } else {
            document.getElementById('no_clases_proximas').innerHTML = "No hay clases disponibles";
        }

        //si no hay clases, vacio el select dejándolo solo en todos
        if (selectProfesor) selectProfesor.innerHTML = '<option value="todos">Todos</option>';
    }
}

function filtrarPorProfesor() {
    let select = document.getElementById("filtro-profesor");
    pintoClases(select.value);
}

function pintoClases(filtroSeleccionado) {
    //para saber que contenedor uso
    let contenedor = (tipoUsuario == "alumno") ? document.getElementById("tabla_clases") : document.getElementById("proximas_clases_alumno");
    //elemento html en el que digo que no hay clases.
    let infoVacio = document.getElementById('info-clases-alumno');

    //limpio el contenedor
    contenedor.innerHTML = "";

    //php si no hay clases devuelve un 0.
    if (datosClasesGlobal == 0) {
        if (infoVacio) infoVacio.innerHTML = "No hay clases disponibles";
        return;
    } else {
        if (infoVacio) infoVacio.innerHTML = "";
    }

    //creo un array con el que trabajar los datos seleccionados
    let clasesAFiltrar = [];

    if (filtroSeleccionado == 'todos') {
        //si en el select elige todos, copio la lista completa de clases
        clasesAFiltrar = datosClasesGlobal;
    } else {
        //si elige un profesor, recorro la lista y selecciono las clases de este profesor
        for (let i = 0; i < datosClasesGlobal.length; i++) {
            //selecciono la clase a analizar
            let claseActual = datosClasesGlobal[i];

            //compruebo si le pertenece al profesor seleccionado en el select
            if (claseActual.id_profesor == filtroSeleccionado) {
                //si coincide, meto esta clase en el array
                clasesAFiltrar.push(claseActual);
            }
        }
    }

    if (clasesAFiltrar.length == 0) {
        contenedor.innerHTML = "<div class='mensaje-vacio-filtro'>Este profesor no tiene clases disponibles.</div>";
        return;
    }

    let diaAnterior = "";
    //variable para guardar el div donde meteremos las horas de ese día
    let divContenedorHoras = null;

    for (let i = 0; i < clasesAFiltrar.length; i++) {
        let clase = clasesAFiltrar[i];
        let fecha = new Date(clase.fecha_hora);
        let diaActual = fecha.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        }).toUpperCase();

        //Compruebo si el dia de esta clase es distinto al dia con el que se estaba trabajando.
        //esto sirve ya que 2 profesores pueden tener clases en el mismo dia, por tanto no tengo que
        //crear un nuevo contenedor para ese dia.

        //por ejemplo si carlos tiene clases el lunes y marta tambien, primero genero las clases de carlos
        //y pongo arriba lunes y después genero las clases de marta. Como el lunes ya está creado, no lo hago de nuevo
        //y por tanto ignoro este if. Cuando llegue al martes, crearé un nuevo div
        if (diaActual != diaAnterior) {
            //guardo el nuevo dia
            diaAnterior = diaActual;

            //div con el nombre del día
            let divBloqueDia = document.createElement('div');
            divBloqueDia.className = 'tarjeta-dia-reserva';

            let divCabeceraDia = document.createElement('div');
            divCabeceraDia.className = 'cabecera-dia';
            divCabeceraDia.textContent = diaActual;
            //lo inserto justo debajo de divBloqueDia
            divBloqueDia.appendChild(divCabeceraDia);

            //Creo el contenedor de las pildoras y lo guardo en la variable para poder seguir
            //metiéndole horas en las siguientes vueltas del bucle
            divContenedorHoras = document.createElement('div');
            divContenedorHoras.className = 'contenedor-pildoras';

            //lo añado a la pantalla
            divBloqueDia.appendChild(divContenedorHoras);
            contenedor.appendChild(divBloqueDia);
        }

        //se dibuja la pildora con las horas.
        //aqui el contenedor del dia concreto ya está creado, por lo que solo tengo que meter dentro las horas

        let horaFormateada = fecha.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        }) + 'h';

        //de forma predeterminada, en cada boton pone debajo reservar,
        //pero si en el select se ponen todos los profesores, se pone el nombre del profesor para diferenciar
        let textoInferior = "Reservar";
        if (filtroSeleccionado == 'todos') {
            textoInferior = clase.nombre_profesor.charAt(0).toUpperCase() + clase.nombre_profesor.slice(1);
        }

        let botonPildora = document.createElement('button');
        botonPildora.className = 'pildora-hora-boton';
        botonPildora.onclick = function () {
            reservar(clase.id_clase, this);
        };

        botonPildora.innerHTML = `
            <label class="pildora-hora-texto">${horaFormateada}</label>
            <label class="pildora-accion-texto">${textoInferior}</label>
        `;

        //Se añade la píldora al contenedor del día actual
        divContenedorHoras.appendChild(botonPildora);
    }
}

// ============================================================
// PANEL ALUMNO - HISTORIAL
// ============================================================
function historialClases() {
    let url = "php/alumno/historial_reservas.php";

    $.post(url, {}, datosHistorial);
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
            if (datos[i].estado == "activa") {
                fila.insertCell(3).innerHTML = "<label class='estado-activa'>" + estadoFormateado + "</label>";
                fila.insertCell(4).innerHTML = "<button class='boton-cancelar' id='" + i + "' onclick='cancelar(" + datos[i].id_reserva + ", " + i + ")'>Cancelar</button>";
            } else if (datos[i].estado == "realizada") {
                fila.insertCell(3).innerHTML = "<label class='estado-realizada'>" + estadoFormateado + "</label>";
                fila.insertCell(4).innerHTML = "<label style=font-weight:700, font-size: 0.7rem;>-</label>";
            } else if (datos[i].estado == "cancelada_tiempo") {
                fila.insertCell(3).innerHTML = "<label class='estado-cancelada-tiempo'>Cancelada</label>";
                fila.insertCell(4).innerHTML = "<label style=font-weight:700, font-size: 0.7rem;>-</label>";
            } else {
                fila.insertCell(3).innerHTML = "<label class='estado-cancelada'>Cancelada (Tarde)</label>";
                fila.insertCell(4).innerHTML = "<label style=font-weight:700, font-size: 0.7rem;>-</label>";
            }
        }
    } else {
        document.getElementById('info-alumno-historial').innerHTML = "Aún no has realizado ninguna práctica con nosotros.";
        document.getElementById('no-clases').innerHTML =
            `
        <button class="boton-principal boton-reservar" onclick="cambiarVentana(this, 'resumen')">
            Reservar mi primera clase
        </button>
        `;

        document.getElementById('info-alumno-historial').style.display = "block"
    }
}

// ============================================================
// PANEL ALUMNO - CAMBIAR CONTRASEÑA
// ============================================================
function cambiarPassword() {
    let actual = document.getElementById('contra_actual');
    let nueva = document.getElementById('contra_nueva');
    let confirmar = document.getElementById('contra_confirmar');
    let divError = document.getElementById('info_password');
    let botonSubmit = document.getElementById('boton_cambio_pass');

    //compruebo si algun campo esta vacio
    if (actual.value == "") {
        divError.style.display = "block"
        divError.innerHTML = "Debes rellenar todos los campos.";
        actual.focus();
        return;
    } else if (nueva.value == "") {
        divError.style.display = "block"
        divError.innerHTML = "Debes rellenar todos los campos.";
        nueva.focus();
        return;
    } else if (confirmar.value == "") {
        divError.style.display = "block";
        divError.innerHTML = "Debes rellenar todos los campos.";
        confirmar.focus();
        return;
    }

    if (nueva.value != confirmar.value) {
        divError.style.display = "block"
        divError.innerHTML = "Las contraseñas no coinciden.";
        return;
    }

    //en caso de estar todo rellenado y que las contraseñas coincidan
    //guardo en el atributo data-html-original lo que ponia en el boton
    botonSubmit.setAttribute('data-html-original', botonSubmit.innerHTML);
    //deshabilito el boton
    botonSubmit.disabled = true;
    //le pongo al boton la estrella
    botonSubmit.innerHTML = `<img id="estrella" src="imagenes/estrella2.svg" style="display:block; margin: 0 auto; width:45px" />`;

    let url = "php/alumno/cambiar_password.php";

    $.post(url, {
        pass_actual: actual.value,
        pass_nueva: nueva.value
    }, function (datos) {
        //se devuelve el boton a la normalidad
        botonSubmit.disabled = false;
        botonSubmit.innerHTML = botonSubmit.getAttribute('data-html-original');

        let respuesta = datos.trim();

        if (respuesta == 1) {
            mostrarNotificacionGlobal("Operación exitosa", "Tu contraseña ha sido actualizada correctamente.", "exito");
            document.getElementById('info_password').style.display = "none"
            document.getElementById('contra_actual').focus();
            //limpiao las cajas
            document.getElementById('contra_actual').value = "";
            document.getElementById('contra_nueva').value = "";
            document.getElementById('contra_confirmar').value = "";
        } else if (respuesta == 2) {
            document.getElementById('info_password').style.display = "block"
            document.getElementById('info_password').innerHTML = "La contraseña actual es incorrecta.";
        } else {
            mostrarNotificacionGlobal("Ha habido un error", "Se ha producido un error al actualizar la contraseña.", "error");
        }
    });
}

// ============================================================
// PANEL ALUMNO/ADMIN - BOTON RESERVAR
// ============================================================

function reservar(idClase, elBoton) {
    let url = "php/alumno/reservar_clase.php";

    elBoton.disabled = true;

    //Desde HTML5, se pueden crear atributos personalizados que empiecen por data-*
    //En este caso le he puesto data-html-original, pero lo de después del guion no importa.
    //Esto sirve para guardar dentro del botón su contenido original (las <label> con la hora y "Reservar")
    //sin que el usuario lo vea. Así, antes de borrar el texto para poner el icono de carga girando,
    //guardo una copia de seguridad en este atributo invisible.

    //Si luego hay un error (por ejemplo saldo insuficiente), será mucho más fácil restaurar el botón
    //porque solo tengo que buscar lo que guardé en su atributo 'data-html-original' y volver a meterlo dentro.

    //POR EJEMPLO:

    //Sin el data-html-original, si el servidor da error tras mostrar la estrella, el botón se quedaría así:

    /*
    <button class="pildora-hora-boton" disabled>
        <img src="imagenes/estrella2.svg">
    </button>
    */
    //Se habría perdido la información de qué hora ponía originalmente y no se podría restaurar.

    //Ahora, al añadir este atributo antes de poner el cargando, se vería así:

    /*
    <button class="pildora-hora-boton" data-html-original=
    "<label class='pildora-hora-texto'>10:00h</label>
    <label class='pildora-accion-texto'>Reservar</label>" disabled>
        <img src="imagenes/estrella2.svg">
    </button>
    */

    //De esta forma, en el 'else' del error, solo tengo que coger el valor del data-html-original
    //y volver a pintar las <label> de las 10:00h para que el botón vuelva a la normalidad.

    elBoton.setAttribute('data-html-original', elBoton.innerHTML);

    elBoton.innerHTML = `<img id="estrella" class="estrella-oscura" src="imagenes/estrella2.svg" style="display:block; margin: 0 auto; width:45px" />`;

    if (tipoUsuario == "alumno") {
        $.post(url, {
            laclase: idClase
        }, function (datos) {
            reservarClase(datos, elBoton);
        });
    } else {
        $.post(url, {
            elid: idAlumnoSeleccionadoAdmin,
            laclase: idClase
        }, function (datos) {
            reservarClase(datos, elBoton);
        });
    }
}

function reservarClase(datos, elBoton) {
    let respuesta = datos.trim();
    
    if (respuesta == 1) {
        mostrarNotificacionGlobal("Operación exitosa", "Reserva registrada correctamente.", "exito");
        
        elBoton.classList.add('pildora-reservada-exito');
        elBoton.innerHTML = `<label>Reservada</label>`;
        elBoton.disabled = true;

        if (tipoUsuario == "alumno") {
            let labelSaldo = document.getElementById('saldo_alumno');
            if (labelSaldo) labelSaldo.innerText = parseInt(labelSaldo.innerText) - 1;
        } else {
            let labelSaldo = document.getElementById('saldo_alumno_admin');
            if (labelSaldo) {
                let textoSeparado = labelSaldo.innerText.split(" ");
                labelSaldo.innerText = "Saldo: " + (parseInt(textoSeparado[1]) - 1);
            }
        }

        if (tipoUsuario == "alumno") {
            historialClases();
            reservaActiva();
        } else {
            $.post("php/alumno/historial_reservas.php", {
                elid: idAlumnoSeleccionadoAdmin
            }, historialAlumnoAdmin);
        }

    } else {
        //en caso de error, restauramos el botón original
        elBoton.disabled = false;
        elBoton.innerHTML = elBoton.getAttribute('data-html-original');

        if (respuesta == -1) {
            mostrarNotificacionGlobal("Saldo agotado", "No tienes saldo suficiente para realizar esta reserva.", "info");
        } else if (respuesta == -2) {
            mostrarNotificacionGlobal("Límite alcanzado", "Ya tienes 2 reservas activas. No puedes reservar más hasta que completes o canceles alguna.", "info");
        } else if (respuesta == -3) {
            mostrarNotificacionGlobal("Margen insuficiente", "Debes dejar al menos 45 minutos libres entre dos clases distintas.", "info");
        } else if (respuesta == -4) {
            mostrarNotificacionGlobal("Clase no disponible", "Lo sentimos, otro alumno acaba de reservar esta clase hace unos instantes.", "error");
            //aquí sí recargo las clases porque otra persona se ha adelantado
            clasesDisponibles(); 
        }
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
            mostrarNotificacionGlobal("Operación exitosa", "La clase ha sido cancelada correctamente.", "exito");
        } else if (datos == 2) {
            mostrarNotificacionGlobal("Cancelación tardía", "La clase ha sido cancelada, pero al realizarse fuera del plazo permitido, tu saldo no será devuelto.", "info");
        }
        if (boton) {
            // El botón está en una celda (td). El padre del botón es el td.
            let celdaBoton = boton.parentElement;
            // El hermano anterior de esa celda es la celda de "Estado"
            let celdaEstado = celdaBoton.previousElementSibling;
            celdaEstado.classList.add("estado-cancelada-tiempo")
            boton.disabled = true;
        }
        inicio_alumno();
        reservaActiva();
    } else {
        mostrarNotificacionGlobal("Se ha producido un error", "Error al procesar la cancelación.", "error");
    }
}

// ============================================================
// PANEL ADMINISTRADOR - DASHBOARD
// ============================================================



function inicio_admin() {
    $("#cargar-dashboard-admin").load("vistas/admin/principal.html", function () {
        //Aqui voy a llamar todas a todas las funciones que aparecen en el dashboard
        alumnosTotales();
        clasesHoy();
        teoricoApto();
        listaClasesHoy();
    });
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
            fila.insertCell(3).innerHTML = "<button class='boton-accion-tabla' onclick='seleccionarAlumno(" + datos[i].id_alumno + ")'>Ver Ficha</button>";
        }
    } else {
        document.getElementById('contenedor-vacio-admin').style.display = "flex";
        document.getElementById('noclases').innerText = "No hay clases programadas para hoy.";
    }
}

function cargarAlumno() {
    $("#cargar-dashboard-admin").load("vistas/admin/alumno.html", function () {
        //al cargar la vista, envio la búsqueda vacía para que PHP devuelva los 20 últimos
        $.post("php/admin/buscar_alumno.php", {
            labusqueda: ""
        }, pintoTablaPrincipal);
    });
}

function pintoTablaPrincipal(datos) {
    var table = document.getElementById("tabla_alumnos_defecto");
    table.innerHTML = "";

    if (datos != 0 && datos.length > 0) {
        var header = table.createTHead();
        var filaH = header.insertRow(0);
        filaH.innerHTML = "<th><b>Foto</b></th><th><b>DNI</b></th><th><b>Alumno</b></th><th style='text-align: center;'><b>Acción</b></th>";

        var body = table.createTBody();
        for (let i = 0; i < datos.length; i++) {
            let nombre = datos[i].nombre.charAt(0).toUpperCase() + datos[i].nombre.slice(1);
            let apellidos = datos[i].apellidos.charAt(0).toUpperCase() + datos[i].apellidos.slice(1);

            var fila = body.insertRow(i);
            fila.insertCell(0).innerHTML = "<img class='avatar-tabla' src='" + datos[i].foto + "'>";
            fila.insertCell(1).innerHTML = datos[i].dni;
            fila.insertCell(2).innerHTML = nombre + " " + apellidos;
            fila.insertCell(3).innerHTML = "<button class='boton-accion-tabla' onclick='seleccionarAlumno(" + datos[i].id + ")'>Ver Ficha</button>";
        }
    } else {
        table.innerHTML = "<tr><td colspan='4' style='text-align: center; color: #64748b; font-style: italic; padding: 20px;'>No hay alumnos registrados.</td></tr>";
    }
}

function listado_alumnos_admin() {
    clearTimeout(timeoutBusqueda);
    let busqueda = document.getElementById('buscar_alumno').value;
    let contenedor = document.getElementById('resultados_busqueda');

    //si el input está vacío, vacio la caja flotante y abortamos la petición
    if (busqueda.trim() == "") {
        contenedor.innerHTML = "";
        return;
    }

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
            contenedor.innerHTML += "<div class='item-resultado-busqueda' onclick='seleccionarAlumno(" + datos[i].id + ")'>" +
                "<img class='img-resultado-busqueda' src='" + imagen + "'>" +
                "<span class='texto-resultado-busqueda'>" + nombre + " " + apellidos + "</span>" +
                "</div>";
        }
    } else {
        contenedor.innerHTML = "<div class='item-resultado-vacio'>No se han encontrado alumnos.</div>";
    }
}

function seleccionarAlumno(idAlumno) {
    let items = document.querySelectorAll('.item-sidebar');

    //el índice 1 corresponde a la opción buscar alumno
    //si no está activo, quito la clase a todos y se la pongo a este
    if (items[1] && !items[1].classList.contains('activo')) {
        items.forEach(item => item.classList.remove('activo'));
        items[1].classList.add('activo');
    }

    idAlumnoSeleccionadoAdmin = idAlumno;
    let url = "php/alumno/datos_alumno.php";

    $.post(url, {
        elid: idAlumno
    }, function (datos) {
        //comprobamos si el alumno existe
        if (!datos.nombre) {
            mostrarNotificacionGlobal("Alumno no encontrado", "Este alumno ya no existe en el sistema.", "info");

            //recargamos la busqueda para que el alumno deje de aparecer
            listado_alumnos_admin();
            return;
        }

        //si existe, cargamos la vista del alumno
        $("#cargar-dashboard-admin").load("vistas/admin/datosAlumno.html", function () {
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
    if(datos.teorico=='apto'){
        document.getElementById('boton_aprobado').disabled = true;
    }
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
            if (datos[i].estado == "activa") {
                fila.insertCell(3).innerHTML = "<label class='estado-activa'>" + estadoFormateado + "</label>";
                fila.insertCell(4).innerHTML = "<button class='boton-cancelar' onclick='cancelarClaseAdmin(" + datos[i].id_reserva + ", this)'>Cancelar</button>";
            } else if (datos[i].estado == "realizada") {
                fila.insertCell(3).innerHTML = "<label class='estado-realizada'>" + estadoFormateado + "</label>";
                fila.insertCell(4).innerHTML = "<label style='font-weight:700; font-size: 0.7rem;'>-</label>";
            } else if (datos[i].estado == "cancelada_tiempo") {
                fila.insertCell(3).innerHTML = "<label class='estado-cancelada-tiempo'>Cancelada</label>";
                fila.insertCell(4).innerHTML = "<label style='font-weight:700; font-size: 0.7rem;'>-</label>";
            } else {
                fila.insertCell(3).innerHTML = "<label class='estado-cancelada'>Cancelada (Tarde)</label>";
                fila.insertCell(4).innerHTML = "<label style='font-weight:700; font-size: 0.7rem;'>-</label>";
            }
        }
    } else {
        document.getElementById('info_alumno_admin').innerText = "No hay clases realizadas";
    }
}

function cancelarClaseAdmin(idReserva, boton) {
    reservaActivaParaCancelar = idReserva;
    botonActivoParaCancelar = boton;

    //Se muestra el modal
    document.getElementById('modal-cancelar-clase').style.display = 'flex';
}

function cerrarModalCancelar() {
    //si el usuario se arrepiente, ocultamos el modal y vaciamos las variables
    document.getElementById('modal-cancelar-clase').style.display = 'none';
    reservaActivaParaCancelar = null;
    botonActivoParaCancelar = null;
}

function ejecutarCancelacionAdmin(devolverSaldo) {
    document.getElementById('modal-cancelar-clase').style.display = 'none';

    let url = "php/admin/cancelar_clase_admin.php";

    botonActivoParaCancelar.disabled = true;
    botonActivoParaCancelar.style.display = "none";

    $.post(url, {
        lareserva: reservaActivaParaCancelar,
        devolver_saldo: devolverSaldo
    }, function (datos) {
        cancelarClaseAdminCallback(datos, botonActivoParaCancelar);

        reservaActivaParaCancelar = null;
        botonActivoParaCancelar = null;
    });
}

function cancelarClaseAdminCallback(datos, boton) {
    if (datos.trim() == 1 || datos.trim() == 2) {
        if (datos.trim() == 1) {
            mostrarNotificacionGlobal("Cancelación exitosa", "La clase ha sido cancelada correctamente.", "exito");
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
            mostrarNotificacionGlobal("Cancelación tardía", "Al alumno le quedaban menos de 48 horas, su saldo no será devuelto.", "info");
        }

        if (boton) {
            let celdaBoton = boton.parentElement;
            let fila = celdaBoton.parentElement;

            // Cambiamos el texto de la celda de Estado a "Cancelada"
            if (datos.trim() == 1) {
                fila.cells[3].innerHTML = "<label class='estado-cancelada-tiempo'>Cancelada</label>";
            } else {
                fila.cells[3].innerHTML = "<label class='estado-cancelada'>Cancelada (Tarde)</label>";
            }
            
            fila.cells[4].innerHTML = "<label style='font-weight:700; font-size: 0.7rem;'>-</label>";
        }
        clasesDisponibles();
    } else {
        mostrarNotificacionGlobal("Error de cancelación", "No se ha podido procesar la cancelación.", "error");
    }
}

function volverAdmin() {
    $("#lacaja").load("vistas/admin/dashboard.php", function () {
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
        document.getElementById('boton_aprobado').disabled = true;
    } else {
        mostrarNotificacionGlobal("Error al actualizar", "No se ha podido marcar al alumno como apto en el examen teórico.", "error");
    }
}

function actualizarSaldo(operacion) {
    let inputSaldo = document.getElementById('recargar_saldo');
    let sumaSaldo = inputSaldo.value;

    //compruebo que introduce un numero al pulsar un boton y en caso de introducirlo que no sea negativo
    if (sumaSaldo == "" || sumaSaldo <= 0) {
        mostrarNotificacionGlobal("Cantidad inválida", "Por favor, introduce una cantidad numérica válida.", "info");
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
        mostrarNotificacionGlobal("Error de operación", "No se ha podido actualizar el saldo del alumno.", "error");
    } else if (datos == -1) {
        mostrarNotificacionGlobal("Operación denegada", "No puedes restar esta cantidad porque el alumno se quedaría con saldo negativo.", "info");
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
        mostrarNotificacionGlobal("Acción no disponible", "El alumno seleccionado ya ha sido archivado o ha sido eliminado del sistema.", "error");
        volverAdmin();
    } else if (respuesta == -2) {
        mostrarNotificacionGlobal("Requisito pendiente", "Para poder archivar a un alumno, primero debe tener el examen teórico apto.", "info");
    } else if (respuesta == -3) {
        mostrarNotificacionGlobal("Requisito de edad", "El alumno debe ser mayor de edad.", "info");
    } else if (respuesta == 1) {
        mostrarNotificacionGlobal("Alumno archivado", "El expediente del alumno se ha guardado en el archivo correctamente.", "exito");
        volverAdmin();
    } else {
        mostrarNotificacionGlobal("Error técnico", "Se ha producido un error al intentar archivar al alumno.", "error");
    }
}

function cargarProfesores() {
    $("#cargar-dashboard-admin").load("vistas/admin/profesor.html", function () {
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
        document.getElementById('no_profesores').innerText = "";
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
            fila.insertCell(0).innerHTML = "<img class='avatar-tabla' src='" + datos[i].foto + "'>";
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

function cargarCalendario() {
    $("#cargar-dashboard-admin").load("vistas/admin/generar_calendario.html");
}

function generoClases() {
    let url = "php/admin/generar_clases.php";

    $.post(url, {}, generoClasesCallback);
}

function generoClasesCallback(datos) {
    let respuesta = datos.trim();
    if (respuesta == 1) {
        mostrarNotificacionGlobal("Calendario generado", "Las clases han sido generadas y ya están disponibles para los alumnos.", "exito");
    } else {
        mostrarNotificacionGlobal("Calendario existente", "No se han creado clases nuevas porque ya estaban generadas para este periodo.", "info");
    }
}

function nuevoAlumno() {
    $("#cargar-dashboard-admin").load("vistas/admin/registroAlumno.php", function () {
        let items = document.querySelectorAll('.item-sidebar');

        //el índice 1 corresponde a la opción buscar alumno
        //si no está activo, quito la clase a todos y se la pongo a este
        if (items[4] && !items[4].classList.contains('activo')) {
            items.forEach(item => item.classList.remove('activo'));
            items[4].classList.add('activo');
        }
    });
}

function registroAlumno() {
    // borro div mensaje
    document.getElementById('notificacion_global').innerHTML = ""
    // visualizo la estrellita
    document.getElementById('elboton').innerHTML = '<img id="estrella" src="imagenes/estrella2.svg" style="display:block; margin: 0 auto; width:45px" />';
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
    }).done(function (datos)
        // esta función es el callback()
        // y en el parámetro "datos" tendré toda la información que me devuelva el script php (si devolviese ALGO...)
        // es obligatorio definir un callback en una funcion asincrona utilizando ajax
        {
            $("#estrella").css("visibility", "hidden");
            // // document.getElementById('estrella').style.visibility='hidden';
            // trato mensaje devuelto por el servidor
            let respuesta = datos.trim();
            if (respuesta == 1) {
                mostrarNotificacionGlobal("Alta completada", "El nuevo alumno ha sido registrado con éxito en el sistema.", "exito");
                // limpio cajas formulario
                document.formulario1.reset();
                limpio_pantalla(0, 'formulario1');
            } else {
                //aqui podemos tratar todos los tipos de error que se produzcan
                mostrarNotificacionGlobal("Error en el registro", "No se ha podido dar de alta al alumno. Código de error: " + datos, "error");
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

    let form = document.getElementById(id_formulario);

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

function nuevoProfesor() {
    $("#cargar-dashboard-admin").load("vistas/admin/registroProfesor.html");
}

function registroProfesor() {
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
    }).done(function (datos)
        // esta función es el callback()
        // y en el parámetro "datos" tendré toda la información que me devuelva el script php (si devolviese ALGO...)
        // es obligatorio definir un callback en una funcion asincrona utilizando ajax
        {
            $("#estrella").css("visibility", "hidden");
            // // document.getElementById('estrella').style.visibility='hidden';
            // trato mensaje devuelto por el servidor
            let respuesta = datos.trim();
            if (respuesta == 1) {
                mostrarNotificacionGlobal("Alta completada", "El nuevo profesor ha sido registrado con éxito en el sistema.", "exito");
                // limpio cajas formulario
                document.formulario2.reset();
                limpio_pantalla(0, 'formulario2');
            } else {
                //aqui podemos tratar todos los tipos de error que se produzcan
                mostrarNotificacionGlobal("Error en el registro", "No se ha podido dar de alta al profesor. Código de error: " + datos, "error");
                limpio_pantalla(1, 'formulario2');
            }
            // Habilito botón de realizar alta
            document.getElementById('elboton').disabled = false;
        });
}

// ============================================================
// PANEL ALUMNO - CAMBIAR CONTRASEÑA
// ============================================================



// ============================================================
// ESTILOS - PANEL ALUMNO
// ============================================================

//Mostrar menu del header al pulsar sobre el nombre
function cargarDesplegableAlumno(event) {
    //sin esta linea, al hacer click en el propio nombre, como estoy "escuchando clicks", se cerraria el propio menu, es decir,
    //no se llegaría a abrir
    event.stopPropagation();

    document.querySelector(".desplegable-header-alumno").classList.toggle("mostrar-desplegable");
}

//miro cuando ha hecho click el usuario
document.addEventListener('click', function (event) {
    let menu = document.querySelector(".desplegable-header-alumno");
    if (menu) {
        //en caso de que el menu esté abierto tiene asignada esta clase, por tanto en este caso:
        if (menu.classList.contains('mostrar-desplegable')) {

            //compruebo si donde ha hecho click no es dentro del menu
            if (!menu.contains(event.target)) {

                //si el click fue fuera se elimina la clase.
                menu.classList.remove('mostrar-desplegable');
            }
        }
    }
});

// ============================================================
// ESTILOS - HEADER ALUMNO
// ============================================================

function cambiarVentana(ventanaPulsada, ventanaSeleccionada) {
    //elimino la clase activo a todas
    let lavista = document.querySelectorAll(".cambiar-ventana");
    lavista.forEach(function (objeto) {
        objeto.classList.remove('activo');
    });

    //le añado la clase a la ventana pulsada. Pongo lo de null ya que el de cambiar contraseña
    //no quiero que se le añada porque no va a tener la linea azul
    if (ventanaPulsada != null) {
        ventanaPulsada.classList.add('activo');
    }

    //cargo la vista
    switch (ventanaSeleccionada) {
        case 'resumen':
            inicio_alumno();
            break;

        case 'reservar':
            $("#cargar-dashboard-alumno").load("vistas/alumno/reservar.html", function () {
                clasesDisponibles();
            });
            break;

        case 'password':
            $("#cargar-dashboard-alumno").load("vistas/alumno/cambiarContrasenya.html", function () {});
            break;
    }
}

// ============================================================
// SISTEMA DE NOTIFICACIONES GLOBALES
// ============================================================

function mostrarNotificacionGlobal(titulo, mensaje, tipo) {
    let notificacion = document.getElementById("notificacion_global");
    let divTitulo = document.getElementById("notificacion_titulo");
    let divMensaje = document.getElementById("notificacion_mensaje");
    let icono = document.getElementById("notificacion_icono");

    let barra = document.getElementById("notificacion_progreso");

    //limpio el estado anterior
    notificacion.className = "";
    barra.className = "notificacion-progreso";
    clearTimeout(temporizadorNotificacion);

    //inserto los datos
    divTitulo.innerHTML = titulo;
    divMensaje.innerHTML = mensaje;

    //asigno los iconos y sus colores segun el tipo de notificacion
    if (tipo === "exito") {
        icono.innerHTML = `<i class="fas fa-check-circle icono-exito"></i>`;
        barra.classList.add("barra-exito");
    } else if (tipo === "error") {
        icono.innerHTML = `<i class="fas fa-times-circle icono-error"></i>`;
        barra.classList.add("barra-error");
    } else if (tipo === "info") {
        icono.innerHTML = `<i class="fas fa-info-circle icono-info"></i>`;
        barra.classList.add("barra-info");
    }

    //con esto lo que hago es preguntarle al navegador cuanto mide la barra.
    //se le pone void ya que el numero no importa.
    //asi se obliga a recalcular las dimensiones y por tanto volver a añadirle la clase
    //ya que si no, cuanto se pulsa 2 veces rapidas algo que salta una notificacion,
    //la barra no se reiniciaria
    void barra.offsetWidth;
    barra.classList.add("animar-barra");

    //muestro la animacion
    setTimeout(function () {
        notificacion.classList.add("mostrar-notificacion");
    }, 10);

    //se oculta automaticamente
    temporizadorNotificacion = setTimeout(function () {
        ocultarNotificacion();
    }, 4500);
}

//al pulsar sobre la x se oculta la notificacion
function ocultarNotificacion() {
    let notificacion = document.getElementById("notificacion_global");
    if (notificacion) {
        notificacion.classList.remove("mostrar-notificacion");
    }
}

function alternarSidebar() {
    let sidebar = document.getElementById('admin-sidebar');
    let overlay = document.getElementById('overlay-sidebar');

    // Mostramos/Ocultamos la barra
    sidebar.classList.toggle('mostrar-sidebar-movil');
    // Mostramos/Ocultamos el fondo oscuro
    overlay.classList.toggle('mostrar-overlay');
}

function activarMenu(elemento, vista) {
    let items = document.querySelectorAll('.item-sidebar');
    items.forEach(item => item.classList.remove('activo'));

    elemento.classList.add('activo');

    //cierra el menú en móviles tras pulsar una opción
    if (window.innerWidth <= 900) {
        document.getElementById('admin-sidebar').classList.remove('mostrar-sidebar-movil');
        document.getElementById('overlay-sidebar').classList.remove('mostrar-overlay');
    }

    //cargo la vista correspondiente
    switch (vista) {
        case 'dashboard':
            inicio_admin();
            break;

        case 'alumnos':
            cargarAlumno();
            break;

        case 'profesores':
            cargarProfesores();
            break;

        case 'calendario':
            cargarCalendario();
            break;

        case 'registroAlumno':
            nuevoAlumno();
            break;

        case 'registroProfesor':
            nuevoProfesor();
            break;
    }
}

// ============================================================
// PANEL ADMINISTRADOR - PESTAÑAS (TABS)
// ============================================================
function cambiarTabAdmin(tabSeleccionada) {
    //Oculto ambas tablas
    document.getElementById('historial_reservas_admin').style.display = 'none';
    document.getElementById('proximas_clases_admin').style.display = 'none';
    
    //Quito la clase activa de botones
    document.getElementById('btn-tab-historial').classList.remove('activa');
    document.getElementById('btn-tab-disponibles').classList.remove('activa');

    if (tabSeleccionada == 'historial') {
        document.getElementById('historial_reservas_admin').style.display = 'block';
        document.getElementById('btn-tab-historial').classList.add('activa');
    } else {
        document.getElementById('proximas_clases_admin').style.display = 'block';
        document.getElementById('btn-tab-disponibles').classList.add('activa');
    }
}