<?php
require('../../ficheros/conexion.php');

// Date transforma la fecha y hora que están en una unica columna por solo la fecha
// Curdate() devuelve la fecha actual del sistema en que se ejecuta la base de datos. Por tanto, estoy solicitando
// que la clase ocurra hoy

$consulta = "SELECT COUNT(*) AS total
FROM CLASES_PRACTICAS
WHERE ESTADO = 'reservada'
AND DATE(FECHA_HORA) = CURDATE();";

$resultado = mysqli_query($conexion, $consulta);

$nregistros = mysqli_num_rows($resultado);

if ($nregistros == 0) {
	// el usuario se ha logueado MAL
	echo 0;
} else {
	$fila = mysqli_fetch_assoc($resultado);
	$respuesta = array();
	$respuesta['clases_hoy'] = $fila['total'];
	//Esto codifica en json la tabla.
	header("Content-type:application/json; charset=utf-8");
	echo json_encode($respuesta);
}

// cerramos la conexión 
mysqli_close($conexion);
