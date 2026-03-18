<?php
require('../ficheros/conexion.php');

// prueba directa
//$dni="00000000A";
//$lacontrasenia="1234";

// aquí habría que poner los filtros de seguridad
$id = $_POST['elid'];

$consulta = "SELECT nombre, apellidos, saldo_clases, estado_teorica 
FROM usuarios INNER JOIN alumnos
ON usuarios.id=alumnos.id_usuario
WHERE usuarios.id='$id'";
$resultado = mysqli_query($conexion, $consulta);

$nregistros = mysqli_num_rows($resultado);

if ($nregistros == 0) {
	// el usuario se ha logueado MAL
	echo 0;
} else {
	$fila = mysqli_fetch_assoc($resultado);
	$respuesta = array();
	$respuesta['nombre'] = $fila['nombre'];
    $respuesta['apellidos'] = $fila['apellidos'];
	$respuesta['saldo'] = $fila['saldo_clases'];
	$respuesta['teorico'] = $fila['estado_teorica'];

	//Esto codifica en json la tabla.
	header("Content-type:application/json; charset=utf-8");
	echo json_encode($respuesta);
}

// cerramos la conexión 
mysqli_close($conexion);
