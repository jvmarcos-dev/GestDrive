<?php
require('../../ficheros/conexion.php');

$dni=strtoupper($_POST['dni']);
$nombre=ucwords(strtolower($_POST['nombre']));
$apellidos=ucwords(strtolower($_POST['apellidos']));
$email=strtolower($_POST['email']);
$telefono=$_POST['telefono'];
$nacimiento=$_POST['fecha_nac'];
$saldo=$_POST['saldo_inicial'];
$teorico=strtolower($_POST['estado_teorico']);

$consulta_usuario="INSERT INTO usuarios (dni, nombre, apellidos, email, password, telefono, tipo)
VALUES ('$dni','$nombre','$apellidos','$email','$dni','$telefono','alumno')";
$resultado_usuario = mysqli_query($conexion, $consulta_usuario);

//si en la primera consulta no hubo ningun error
if($resultado_usuario){
    //con esto recupero el id que acaba de crear en la tabla usuarios, ya que es la clave primaria de la tabla alumnos
    $id_recien_creado = mysqli_insert_id($conexion);

    $consulta_alumno="INSERT INTO alumnos (id_usuario, fecha_nacimiento, saldo_clases, estado_teorica)
    VALUES ($id_recien_creado, '$nacimiento', $saldo, '$teorico')";
    $resultado_alumno = mysqli_query($conexion, $consulta_alumno);
}

if ($resultado_alumno) {
    echo 1;
} else {
    // se ha producido un error
    $numerror=mysqli_errno($conexion); 
	//$descrerror=mysqli_error($conexion); 
	echo $numerror;
}

// cerramos la conexión 
mysqli_close($conexion);
