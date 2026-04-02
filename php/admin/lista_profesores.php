<?php
require('../../ficheros/conexion.php');

// para esta consulta necesito recuperar el nombre y apellidos tanto del profesor como del alumno los cuales se encuentran
// en la misma tabla y solo dependen del tipo. Por ello, tengo que relacionar dos veces la consulta con la tabla usuarios, primero
// para recuperar los del alumno y después para recuperar los del profesor
$consulta = "SELECT FOTO, DNI, NOMBRE, APELLIDOS, EMAIL, TELEFONO, NUM_LICENCIA
FROM USUARIOS INNER JOIN PROFESORES
ON USUARIOS.ID=PROFESORES.ID_USUARIO";
$resultado = mysqli_query($conexion, $consulta);

$nregistros = mysqli_num_rows($resultado);

if ($nregistros > 0) {
    $respuesta = array();
    while ($fila = mysqli_fetch_assoc($resultado)) {
        $profesores = array();
        $profesor['foto'] = $fila['FOTO'];
        $profesor['dni'] = $fila['DNI'];
        $profesor['nombre'] = $fila['NOMBRE'];
        $profesor['apellidos'] = $fila['APELLIDOS'];
        $profesor['email'] = $fila['EMAIL'];
        $profesor['telefono'] = $fila['TELEFONO'];
        $profesor['licencia'] = $fila['NUM_LICENCIA'];
        $respuesta[] = $profesor;
    }

    //Esto codifica en json la tabla.
    header("Content-type:application/json; charset=utf-8");
    echo json_encode($respuesta);
} else {
    echo 0;
}

// cerramos la conexión 
mysqli_close($conexion);
