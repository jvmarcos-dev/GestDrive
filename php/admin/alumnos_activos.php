<?php
require('../../ficheros/conexion.php');

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
