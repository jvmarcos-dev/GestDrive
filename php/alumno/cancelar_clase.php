<?php
require('../../ficheros/conexion.php');

session_start();

$reserva = $_POST['lareserva'];

mysqli_query($conexion, "CALL CANCELAR($reserva, @salida)");

$resultado = mysqli_query($conexion, "SELECT @salida AS salida");
$fila = mysqli_fetch_assoc($resultado);
$salida = $fila['salida'];

echo $salida;

mysqli_close($conexion);
?>