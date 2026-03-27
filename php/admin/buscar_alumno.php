<?php
require('../../ficheros/conexion.php');

// prueba directa
//$dni="00000000A";
//$lacontrasenia="1234";

// aquí habría que poner los filtros de seguridad
$busqueda = $_POST['labusqueda'];

$consulta = "SELECT id, nombre, apellidos, foto
FROM usuarios 
WHERE tipo = 'alumno'
AND (nombre LIKE '$busqueda%' OR apellidos LIKE '$busqueda%')";

$resultado = mysqli_query($conexion, $consulta);

$nregistros = mysqli_num_rows($resultado);

if ($nregistros == 0) {
	// el usuario se ha logueado MAL
	echo 0;
} else {
	$respuesta = array();
    while ($fila = mysqli_fetch_assoc($resultado)) {
        $alumnos = array();
        $alumnos['nombre'] = $fila['nombre'];
        $alumnos['apellidos'] = $fila['apellidos'];
        $alumnos['foto'] = $fila['foto'];
        $respuesta[] = $alumnos;
    }

	//Esto codifica en json la tabla.
	header("Content-type:application/json; charset=utf-8");
	echo json_encode($respuesta);
}

// cerramos la conexión 
mysqli_close($conexion);
