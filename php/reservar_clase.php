<?php
require('../ficheros/conexion.php');

$id = $_POST['elid'];
$clase = $_POST['laclase'];

// Llamamos al procedimiento con una variable de sesión MySQL para la salida
mysqli_query($conexion, "CALL RESERVAR($id, $clase, @salida)");

// Leemos el valor de salida
$resultado = mysqli_query($conexion, "SELECT @salida AS salida");
$fila = mysqli_fetch_assoc($resultado);
$salida = $fila['salida'];

// Devolvemos el resultado a JavaScript
echo $salida;

mysqli_close($conexion);
?>