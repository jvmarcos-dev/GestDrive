<?php
require('../../ficheros/conexion.php');

// prueba directa
//$dni="00000000A";
//$lacontrasenia="1234";

// aquí habría que poner los filtros de seguridad

session_start();

$consulta = "SELECT CLASES_PRACTICAS.ID AS id_clase, FECHA_HORA, NOMBRE, APELLIDOS
FROM CLASES_PRACTICAS INNER JOIN USUARIOS
ON CLASES_PRACTICAS.ID_PROFESOR=USUARIOS.ID
WHERE ESTADO='libre'
AND CLASES_PRACTICAS.FECHA_HORA > NOW()
AND CLASES_PRACTICAS.FECHA_HORA < DATE_ADD(NOW(), INTERVAL 1 WEEK)";
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
        $clase['fecha_hora'] = $fila['FECHA_HORA'];
        $clase['nombre_profesor'] = $fila['NOMBRE'];
        $clase['apellidos_profesor'] = $fila['APELLIDOS'];
        $respuesta[] = $clase;
    }
    header("Content-type:application/json; charset=utf-8");
    echo json_encode($respuesta);
}

// cerramos la conexión 
mysqli_close($conexion);
