<?php
require('../../ficheros/conexion.php');

// prueba directa
//$dni="00000000A";
//$lacontrasenia="1234";

// aquí habría que poner los filtros de seguridad

session_start();

$consulta = "SELECT clases_practicas.id AS id_clase, fecha_hora, nombre, apellidos, usuarios.id AS id_profesor
FROM clases_practicas INNER JOIN usuarios
ON clases_practicas.id_profesor=usuarios.id
WHERE estado='libre'
AND clases_practicas.fecha_hora > NOW()
AND clases_practicas.fecha_hora < DATE_ADD(NOW(), INTERVAL 2 WEEK)
ORDER BY fecha_hora ASC";
$resultado = mysqli_query($conexion, $consulta);

$nregistros = mysqli_num_rows($resultado);

if ($nregistros == 0) {
    // el usuario se ha logueado MAL
    echo 0;
} else {
    $respuesta = array();
    while ($fila = mysqli_fetch_assoc($resultado)) {
        $clase = array();
        $clase['id_clase'] = $fila['id_clase'];
        $clase['fecha_hora'] = $fila['fecha_hora'];
        $clase['nombre_profesor'] = $fila['nombre'];
        $clase['apellidos_profesor'] = $fila['apellidos'];
        $clase['id_profesor'] = $fila['id_profesor'];
        $respuesta[] = $clase;
    }

    //Esto codifica en json la tabla.
    header("Content-type:application/json; charset=utf-8");
    echo json_encode($respuesta);
}

// cerramos la conexión 
mysqli_close($conexion);
?>