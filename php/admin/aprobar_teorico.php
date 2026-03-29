<?php
require('../../ficheros/conexion.php');

$id = $_POST['elid'];

$consulta = "UPDATE ALUMNOS 
SET estado_teorica = 'apto' 
WHERE id_usuario = '$id'";

$resultado = mysqli_query($conexion, $consulta);

if ($resultado) {
    echo 1;
} else {
    // se ha producido un error
    echo 0;
}

// cerramos la conexión 
mysqli_close($conexion);
