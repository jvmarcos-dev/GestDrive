<?php
require('../../ficheros/conexion.php');

session_start();
//esto es una comprobacion de seguridad para saber que quien ejecuta esto es un administrador real.
//si no, se podria desde la propia consola ejecutar la funcion js que llama a este script php pasando cualquier id como parametro
if (!isset($_SESSION['usuario_tipo']) || $_SESSION['usuario_tipo'] != 'admin') {
    die();
}

mysqli_report(MYSQLI_REPORT_ERROR|MYSQLI_REPORT_OFF);

$dni=strtoupper($_POST['dni']);
$nombre=ucwords(strtolower($_POST['nombre']));
$apellidos=ucwords(strtolower($_POST['apellidos']));
$email=strtolower($_POST['email']);
$telefono=$_POST['telefono'];
$licencia=strtoupper($_POST['licencia']);

//A modo de contraseña inicial usaré el DNI.
$contrasenia_segura=password_hash($dni, PASSWORD_BCRYPT);

//imagen predeterminada
$foto = 'imagenes/usuarios/default.png';
//esta variable la utilizaré para comprobar si se ha asignado una foto a guardar.
//de esta forma en caso de que se produzca un error, la imagen no se guardará en la carpeta correspondiente sin guardarse en la bbdd y así evito
//que se utilice espacio de forma innecesaria y una incosistencia de datos, ya que tendría una imagen con ese mismo nombre ya guardada.
$hay_foto=false;

//compruebo que existe la imagen. Con $_FILES['imagen']['error'] == 0 lo que hago es ver si se produce algun error:
//0 significa que no ha habido ningun error. Es importante ponerlo porque la imagen no es obligatoria y se podría mantener la predeterminada
//en caso de mantener esta, daría un error de tipo 4 (no se cumple la condicion y por tanto no entra en el if) el cual significa que no se ha seleccionado archivo

if (isset($_FILES['imagen2']) && $_FILES['imagen2']['error'] == 0) {
    //extraemos la extension de la imagen
    $extension = pathinfo($_FILES['imagen2']['name'], PATHINFO_EXTENSION);
    //renombramos la imagen nueva
    $nombre_archivo = $dni . '.' . $extension;
    //asignamos la ruta en la que se guardará la imagen
    $ruta_destino = '../../imagenes/usuarios/' . $nombre_archivo;
    //si no se da ningun fallo, cambiamos la imagen por defecto a la real
    $foto = 'imagenes/usuarios/'.$nombre_archivo;
    $hay_foto=true;
}

$consulta_usuario="INSERT INTO usuarios (dni, nombre, apellidos, email, password, telefono, tipo, foto)
VALUES ('$dni','$nombre','$apellidos','$email','$contrasenia_segura','$telefono','profesor', '$foto')";
$resultado_usuario = @mysqli_query($conexion, $consulta_usuario);

//si en la primera consulta no hubo ningun error
if($resultado_usuario){
    //con esto recupero el id que acaba de crear en la tabla profesores, ya que es la clave primaria de la tabla profesores
    $id_recien_creado = mysqli_insert_id($conexion);

    $consulta_profesor="INSERT INTO profesores (id_usuario, num_licencia)
    VALUES ($id_recien_creado, '$licencia')";
    $resultado_profesor = @mysqli_query($conexion, $consulta_profesor);
}

if (mysqli_errno($conexion)==0) {
    if ($hay_foto) {
        //muevo la imagen a la carpeta correspondiente solo en caso de no producirse ningun error
        //php por defecto antes de guardar el archivo, lo ha movido a una carpeta temporal.
        //por tanto, con tmp_name recuperamos donde está guardado el archivo en esa carpeta temporal
        //y lo movemos a la carpeta correspondiente.
        //de esta forma esta linea se podria traducir como mover el archivo 'imagen' desde 'la carpeta temporal (tmp_name)
        //hacia la ruta de destino.
        move_uploaded_file($_FILES['imagen2']['tmp_name'], $ruta_destino);
    }
    echo 1;
} else {
    // se ha producido un error
    $numerror=mysqli_errno($conexion); 
    //$descrerror=mysqli_error($conexion); 
    echo $numerror;
}

// cerramos la conexión 
mysqli_close($conexion);