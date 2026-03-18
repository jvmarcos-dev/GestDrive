//variables globales
let idUsuario;
let tipoUsuario;

function inicio() {
    $("#lacaja").load("vistas/login.html");
}

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

function datosAlumno(datos) {
    if (datos.nombre) {
    document.getElementById('nombre_alumno').innerHTML = datos.nombre;
    document.getElementById('apellidos_alumno').innerHTML = datos.apellidos;
    document.getElementById('saldo_alumno').innerHTML = datos.saldo;
    document.getElementById('teorica_alumno').innerHTML = datos.teorico;
    }else{
        document.getElementById('info_alumno').innerHTML = "<font color='red'>Se ha producido un ERROR</font>";
    }
}