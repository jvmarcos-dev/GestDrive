<?php
require('../../ficheros/conexion.php');

session_start();

//esto es una comprobacion de seguridad para saber que quien ejecuta esto es un administrador real.
//si no, se podria desde la propia consola ejecutar la funcion js que llama a este script php pasando cualquier id como parametro
if (!isset($_SESSION['usuario_tipo']) || $_SESSION['usuario_tipo'] != 'admin') {
    die();
}

$reserva = $_POST['lareserva'];
$devolver = $_POST['devolver_saldo']; // Recibirá un 1 o un 0 desde javascript

mysqli_query($conexion, "CALL CANCELAR_ADMIN($reserva, $devolver, @salida)");

$resultado = mysqli_query($conexion, "SELECT @salida AS salida");
$fila = mysqli_fetch_assoc($resultado);
$salida = $fila['salida'];

echo $salida;

mysqli_close($conexion);