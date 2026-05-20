<?php
require('../../ficheros/conexion.php');

//esto se pone para evitar que desde la barra de navegacion puedan acceder a los datos sin
//pasar por el login
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

//esto es una comprobacion de seguridad para saber que quien ejecuta esto es un administrador real.
//si no, se podria desde la propia consola ejecutar la funcion js que llama a este script php pasando cualquier id como parametro
if (!isset($_SESSION['usuario_tipo']) || $_SESSION['usuario_tipo'] != 'admin') {
    http_response_code(403);
    echo "Acceso restringido. No tienes permisos para ver este recurso.";
    exit();
}

$consulta = "SELECT COUNT(*) AS CANTIDAD_ALUMNOS FROM ALUMNOS";

$resultado = mysqli_query($conexion, $consulta);

$nregistros = mysqli_num_rows($resultado);

if ($nregistros == 0) {
	// el usuario se ha logueado MAL
	echo 0;
} else {
	$fila = mysqli_fetch_assoc($resultado);
	$respuesta = array();
	$respuesta['cant_alumnos'] = $fila['CANTIDAD_ALUMNOS'];
	//Esto codifica en json la tabla.
	header("Content-type:application/json; charset=utf-8");
	echo json_encode($respuesta);
}

// cerramos la conexión 
mysqli_close($conexion);
