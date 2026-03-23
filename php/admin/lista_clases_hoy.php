<?php
require('../../ficheros/conexion.php');

// para esta consulta necesito recuperar el nombre y apellidos tanto del profesor como del alumno los cuales se encuentran
// en la misma tabla y solo dependen del tipo. Por ello, tengo que relacionar dos veces la consulta con la tabla usuarios, primero
// para recuperar los del alumno y después para recuperar los del profesor
$consulta = "SELECT 
CLASES_PRACTICAS.FECHA_HORA AS FECHA_HORA,
USUARIOS_ALUMNO.NOMBRE AS NOMBRE_ALUMNO,
USUARIOS_ALUMNO.APELLIDOS AS APELLIDOS_ALUMNO,
USUARIOS_PROFESOR.NOMBRE AS NOMBRE_PROFESOR,
USUARIOS_PROFESOR.APELLIDOS AS APELLIDOS_PROFESOR
FROM RESERVAS INNER JOIN CLASES_PRACTICAS 
ON RESERVAS.ID_CLASE = CLASES_PRACTICAS.ID
INNER JOIN USUARIOS AS USUARIOS_ALUMNO 
ON RESERVAS.ID_ALUMNO = USUARIOS_ALUMNO.ID
INNER JOIN USUARIOS AS USUARIOS_PROFESOR 
ON CLASES_PRACTICAS.ID_PROFESOR = USUARIOS_PROFESOR.ID
WHERE DATE(CLASES_PRACTICAS.FECHA_HORA) = CURDATE()
AND RESERVAS.ESTADO = 'activa';";
$resultado = mysqli_query($conexion, $consulta);

$nregistros = mysqli_num_rows($resultado);

if ($nregistros > 0) {
    $respuesta = array();
    while ($fila = mysqli_fetch_assoc($resultado)) {
        $clase = array();
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
