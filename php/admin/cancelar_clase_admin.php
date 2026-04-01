<?php
require('../../ficheros/conexion.php');

$reserva = $_POST['lareserva'];
$devolver = $_POST['devolver_saldo']; // Recibirá un 1 o un 0 desde javascript

mysqli_query($conexion, "CALL CANCELAR_ADMIN($reserva, $devolver, @salida)");

$resultado = mysqli_query($conexion, "SELECT @salida AS salida");
$fila = mysqli_fetch_assoc($resultado);
$salida = $fila['salida'];

echo $salida;

mysqli_close($conexion);