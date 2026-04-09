<?php
require('../../ficheros/conexion.php');

session_start();

//esto es una comprobacion de seguridad para saber que quien ejecuta esto es un administrador real.
//si no, se podria desde la propia consola ejecutar la funcion js que llama a este script php pasando cualquier id como parametro
if (!isset($_SESSION['usuario_tipo']) || $_SESSION['usuario_tipo'] != 'admin') {
    die();
}

// Llamamos al procedimiento con una variable de sesión MySQL para la salida
mysqli_query($conexion, "CALL generar_clases(@salida)");

// Leemos el valor de salida
$resultado = mysqli_query($conexion, "SELECT @salida AS salida");
$fila = mysqli_fetch_assoc($resultado);
$salida = $fila['salida'];

// Devolvemos el resultado a JavaScript
echo $salida;

mysqli_close($conexion);
?>