<?php
require('../../ficheros/conexion.php');

session_start();

if (isset($_POST['elid']) && !empty($_POST['elid'])) {
    //si llega elid por POST, la petición la hace el Admin. Usamos el ID del alumno seleccionado.
    $id = $_POST['elid'];
} else {
    //si no llega, la petición la hace el propio Alumno. Usamos su ID de la sesión.
    $id = $_SESSION['idusuario'];
}

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