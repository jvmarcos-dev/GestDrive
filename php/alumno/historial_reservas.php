<?php
require('../../ficheros/conexion.php');

// prueba directa
//$dni="00000000A";
//$lacontrasenia="1234";

// aquí habría que poner los filtros de seguridad
$id = $_POST['elid'];

$consulta = "SELECT FECHA_HORA, NOMBRE, APELLIDOS, RESERVAS.ID AS RESERVA, RESERVAS.ESTADO AS ESTADO
FROM RESERVAS INNER JOIN CLASES_PRACTICAS 
ON RESERVAS.ID_CLASE = CLASES_PRACTICAS.ID
INNER JOIN USUARIOS 
ON CLASES_PRACTICAS.ID_PROFESOR = USUARIOS.ID
WHERE RESERVAS.ID_ALUMNO = $id
AND RESERVAS.ESTADO <> 'cancelada_tiempo'
ORDER BY FECHA_HORA DESC";
$resultado = mysqli_query($conexion, $consulta);

$nregistros = mysqli_num_rows($resultado);

if ($nregistros > 0) {
    $respuesta = array();
    while ($fila = mysqli_fetch_assoc($resultado)) {
        $clase = array();
        $clase['fecha_hora'] = $fila['FECHA_HORA'];
        $clase['nombre_profesor'] = $fila['NOMBRE'];
        $clase['apellidos_profesor'] = $fila['APELLIDOS'];
        $clase['estado'] = $fila['ESTADO'];
        $clase['id_reserva'] = $fila['RESERVA'];
        $respuesta[] = $clase;
    }

    //Esto codifica en json la tabla.
    header("Content-type:application/json; charset=utf-8");
    echo json_encode($respuesta);
}

// cerramos la conexión 
mysqli_close($conexion);
