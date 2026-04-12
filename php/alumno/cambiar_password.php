<?php
session_start();
require('../../ficheros/conexion.php');

$id = $_SESSION['idusuario'];
$pass_actual = $_POST['pass_actual'];
$pass_nueva = $_POST['pass_nueva'];

$consulta = "SELECT password FROM usuarios WHERE id = '$id'";
$resultado = mysqli_query($conexion, $consulta);

if (mysqli_num_rows($resultado) == 1) {
    $fila = mysqli_fetch_assoc($resultado);
    $cifrado_actual = $fila['password'];

    //compruebo si la contraseña actual que ha escrito es correcta
    if (password_verify($pass_actual, $cifrado_actual)) {

        //si es correcta, cifro la nueva contraseña
        $nueva_cifrada = password_hash($pass_nueva, PASSWORD_BCRYPT);

        $consultaFinal = "UPDATE usuarios SET password = '$nueva_cifrada' WHERE id = '$id'";

        if (mysqli_query($conexion, $consultaFinal)) {
            echo 1; //Se ha realizado correctamente
        } else {
            echo -1; //Error de base de datos
        }
    } else {
        echo 2; //La contraseña actual escrita no coincide
    }
} else {
    echo 0; //Usuario no encontrado
}

mysqli_close($conexion);
