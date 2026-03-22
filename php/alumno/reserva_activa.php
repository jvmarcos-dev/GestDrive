<?php
require('../../ficheros/conexion.php');

// prueba directa
//$dni="00000000A";
//$lacontrasenia="1234";

// aquí habría que poner los filtros de seguridad
$id = $_POST['elid'];

$consulta = "SELECT CLASES_PRACTICAS.ID AS id_clase, FECHA_HORA, NOMBRE, APELLIDOS
FROM RESERVAS 
INNER JOIN CLASES_PRACTICAS 
ON RESERVAS.ID_CLASE = CLASES_PRACTICAS.ID
INNER JOIN USUARIOS 
ON CLASES_PRACTICAS.ID_PROFESOR = USUARIOS.ID
WHERE RESERVAS.ID_ALUMNO = $id 
AND CLASES_PRACTICAS.ESTADO = 'reservada'
AND CLASES_PRACTICAS.FECHA_HORA > NOW()
ORDER BY FECHA_HORA
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
    $respuesta['fecha_hora'] = $fila['FECHA_HORA'];
    $respuesta['profesor'] = $fila['NOMBRE'] . ' ' . $fila['APELLIDOS'];
    //Esto codifica en json la tabla.
    header("Content-type:application/json; charset=utf-8");
    echo json_encode($respuesta);
}

// cerramos la conexión 
mysqli_close($conexion);
