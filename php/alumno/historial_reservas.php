<?php
require('../../ficheros/conexion.php');

session_start();

// prueba directa
//$dni="00000000A";
//$lacontrasenia="1234";

//Como este archivo luego lo utiliza el administrador para entrar en la ficha del alumno, tengo que hacer este if
$tipo = $_SESSION['usuario_tipo'];


if ($tipo == 'admin') {
    //si es admin, cogemos el ID por POST
    $id = $_POST['elid'];
} else {
    //si es alumno, usamos el id de session
    $id = $_SESSION['idusuario'];
}

$consulta = "SELECT fecha_hora, nombre, apellidos, reservas.id AS reserva, reservas.estado AS estado
FROM reservas INNER JOIN clases_practicas 
ON reservas.id_clase = clases_practicas.id
INNER JOIN usuarios 
ON clases_practicas.id_profesor = usuarios.id
WHERE reservas.id_alumno = $id
ORDER BY fecha_hora DESC";
$resultado = mysqli_query($conexion, $consulta);

$nregistros = mysqli_num_rows($resultado);

if ($nregistros > 0) {
    $respuesta = array();
    while ($fila = mysqli_fetch_assoc($resultado)) {
        $clase = array();
        $clase['fecha_hora'] = $fila['fecha_hora'];
        $clase['nombre_profesor'] = $fila['nombre'];
        $clase['apellidos_profesor'] = $fila['apellidos'];
        $clase['estado'] = $fila['estado'];
        $clase['id_reserva'] = $fila['reserva'];
        $respuesta[] = $clase;
    }

    //Esto codifica en json la tabla.
    header("Content-type:application/json; charset=utf-8");
    echo json_encode($respuesta);
}

// cerramos la conexión 
mysqli_close($conexion);
?>