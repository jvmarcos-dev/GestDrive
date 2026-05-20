<?php
require('../../ficheros/conexion.php');

session_start();

if (!isset($_SESSION['usuario_tipo']) || $_SESSION['usuario_tipo'] != 'admin') {
    die();
}

// para esta consulta necesito recuperar el nombre y apellidos tanto del profesor como del alumno los cuales se encuentran
// en la misma tabla y solo dependen del tipo. Por ello, tengo que relacionar dos veces la consulta con la tabla usuarios, primero
// para recuperar los del alumno y después para recuperar los del profesor
$consulta = "SELECT 
usuarios_alumno.id AS ID_ALUMNO,
reservas.id AS ID_RESERVA,
clases_practicas.fecha_hora AS FECHA_HORA,
usuarios_alumno.nombre AS NOMBRE_ALUMNO,
usuarios_alumno.apellidos AS APELLIDOS_ALUMNO,
usuarios_profesor.nombre AS NOMBRE_PROFESOR,
usuarios_profesor.apellidos AS APELLIDOS_PROFESOR
FROM reservas INNER JOIN clases_practicas 
ON reservas.id_clase = clases_practicas.id
INNER JOIN usuarios AS usuarios_alumno 
ON reservas.id_alumno = usuarios_alumno.id
INNER JOIN usuarios AS usuarios_profesor 
ON clases_practicas.id_profesor = usuarios_profesor.id
WHERE DATE(clases_practicas.fecha_hora) = CURDATE()
AND reservas.estado = 'activa';";
$resultado = mysqli_query($conexion, $consulta);

$nregistros = mysqli_num_rows($resultado);

if ($nregistros > 0) {
    $respuesta = array();
    while ($fila = mysqli_fetch_assoc($resultado)) {
        $clase = array();
        $clase['id_alumno'] = $fila['ID_ALUMNO'];
        $clase['id_reserva'] = $fila['ID_RESERVA'];
        $clase['fecha_hora'] = $fila['FECHA_HORA'];
        $clase['nombre_alumno'] = $fila['NOMBRE_ALUMNO'];
        $clase['apellidos_alumno'] = $fila['APELLIDOS_ALUMNO'];
        $clase['nombre_profesor'] = $fila['NOMBRE_PROFESOR'];
        $clase['apellidos_profesor'] = $fila['APELLIDOS_PROFESOR'];
        $respuesta[] = $clase;
    }

    //Esto codifica en json la tabla.
    header("Content-type:application/json; charset=utf-8");
    echo json_encode($respuesta);
} else {
    echo 0;
}

// cerramos la conexión 
mysqli_close($conexion);
