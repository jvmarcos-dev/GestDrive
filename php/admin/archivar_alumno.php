<?php
require('../../ficheros/conexion.php');

//esto se pone para evitar que desde la barra de navegacion puedan acceder a los datos sin
//pasar por el login
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

//esto es una comprobacion de seguridad para saber que quien ejecuta esto es un administrador real.
//si no, se podria desde la propia consola ejecutar la funcion js que llama a este script php pasando cualquier id como parametro
if (!isset($_SESSION['usuario_tipo']) || $_SESSION['usuario_tipo'] != 'admin') {
    http_response_code(403);
    echo "Acceso restringido. No tienes permisos para ver este recurso.";
    exit();
}

$id = $_POST['elid'];

// Llamamos al procedimiento con una variable de sesión MySQL para la salida
mysqli_query($conexion, "CALL archivar_alumno($id, @salida)");

// Leemos el valor de salida
$resultado = mysqli_query($conexion, "SELECT @salida AS salida");
$fila = mysqli_fetch_assoc($resultado);
$salida = $fila['salida'];

// Devolvemos el resultado a JavaScript
echo $salida;

mysqli_close($conexion);
?>