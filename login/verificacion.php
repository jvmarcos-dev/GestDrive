<?php

usleep(600000);
require('../ficheros/conexion.php');

// prueba directa
//$dni="00000000A";
//$lacontrasenia="1234";

// aquí habría que poner los filtros de seguridad
$dni = $_POST['eldni'];
$lacontrasenia = $_POST['tcontrasenia'];

$consulta = "SELECT tipo FROM usuarios WHERE dni='$dni' AND PASSWORD='$lacontrasenia'";
$resultado = mysqli_query($conexion, $consulta);

$nregistros = mysqli_num_rows($resultado);

if ($nregistros == 0) {
	// el usuario se ha logueado MAL
	echo 0;
} else {
	$fila = mysqli_fetch_assoc($resultado);
	echo $fila['tipo'];
}

// cerramos la conexión 
mysqli_close($conexion);
