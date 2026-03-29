<?php
require('../../ficheros/conexion.php');

$id = $_POST['elid'];
$saldo_nuevo = $_POST['saldo_nuevo'];
$operacion = $_POST['laoperacion'];

if ($operacion == 1) {
    $consulta = "UPDATE ALUMNOS 
    SET saldo_clases = saldo_clases + $saldo_nuevo
    WHERE id_usuario = '$id'";
} else {

    // Antes de restar, comprobamos si tiene saldo suficiente
    $comprobacion_saldo = "SELECT saldo_clases FROM ALUMNOS WHERE id_usuario = '$id'";
    $resultado_comprobacion = mysqli_query($conexion, $comprobacion_saldo);
    $fila_comprobacion = mysqli_fetch_assoc($resultado_comprobacion);

    //si al restar el nuevo saldo fuese negativo, mostramos mensaje de error
    if ($fila_comprobacion['saldo_clases'] - $saldo_nuevo < 0) {
        echo -1;

        //y salimos del archivo php ya que no hay que hacer nada mas
        mysqli_close($conexion);
        exit;
    }

    // Si tiene suficiente saldo, hacemos la resta
    $consulta = "UPDATE ALUMNOS 
    SET saldo_clases = saldo_clases - $saldo_nuevo
    WHERE id_usuario = '$id'";
}

$resultado = mysqli_query($conexion, $consulta);

if ($resultado) {
    //hago una consulta para saber cual es el saldo nuevo
    $consulta_select = "SELECT saldo_clases FROM ALUMNOS WHERE id_usuario = '$id'";
    $resultado_select = mysqli_query($conexion, $consulta_select);

    $fila = mysqli_fetch_assoc($resultado_select);
    $respuesta = array();
    $respuesta['elsaldo'] = $fila['saldo_clases'];
    //Esto codifica en json la tabla.
    header("Content-type:application/json; charset=utf-8");
    echo json_encode($respuesta);
} else {
    // se ha producido un error
    echo 0;
}

// cerramos la conexión 
mysqli_close($conexion);
