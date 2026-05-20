<?php
require('../../ficheros/conexion.php');

session_start();

// prueba directa
//$dni="00000000A";
//$lacontrasenia="1234";

// aquí habría que poner los filtros de seguridad
$id = $_SESSION['idusuario'];

$consulta = "SELECT clases_practicas.id AS id_clase, fecha_hora, nombre, apellidos
FROM reservas \r
INNER JOIN clases_practicas \r
ON reservas.id_clase = clases_practicas.id\r
INNER JOIN usuarios \r
ON clases_practicas.id_profesor = usuarios.id\r
WHERE reservas.id_alumno = $id \r
AND clases_practicas.estado = 'reservada'\r
AND clases_practicas.fecha_hora > NOW()\r
ORDER BY fecha_hora\r
LIMIT 1";

$resultado = mysqli_query($conexion, $consulta);

$nregistros = mysqli_num_rows($resultado);

if ($nregistros == 0) {
    // no hay clases proximas
    echo 0;
} else {
    $fila = mysqli_fetch_assoc($resultado);
    $respuesta = array();
    $respuesta['proxima_clase'] = $fila['id_clase'];
    $respuesta['fecha_hora'] = $fila['fecha_hora'];
    $respuesta['profesor'] = $fila['nombre'] . ' ' . $fila['apellidos'];
    //Esto codifica en json la tabla.
    header("Content-type:application/json; charset=utf-8");
    echo json_encode($respuesta);
}

// cerramos la conexión 
mysqli_close($conexion);
?>