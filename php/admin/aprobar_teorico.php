<?php
require('../../ficheros/conexion.php');

session_start();

//esto es una comprobacion de seguridad para saber que quien ejecuta esto es un administrador real.
//si no, se podria desde la propia consola ejecutar la funcion js que llama a este script php pasando cualquier id como parametro
if (!isset($_SESSION['usuario_tipo']) || $_SESSION['usuario_tipo'] != 'admin') {
    die();
}

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
