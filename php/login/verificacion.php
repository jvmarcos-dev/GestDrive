<?php
session_start();
usleep(600000);
require('../../ficheros/conexion.php');

// prueba directa
//$dni="00000000A";
//$lacontrasenia="1234";


function verificar_login($user,$password,&$losdatos)
    {
        // y también aquí
		require('../../ficheros/conexion.php');
		
		// hago la consulta para saber si los datos del usuario son correctos
		// recupero toda la información
		
		// el campo por el que busque tiene que ser clave
		// en este caso se supone que el campo "USUARIO" es clave
		// comprobamos si existe ese usuario
		$sql = "SELECT * FROM usuarios WHERE DNI = '$user'";
				
		$resultado = mysqli_query($conexion,$sql);
        
		// calculo el nº de registros devueltos
		$nregistros=0;
		$nregistros=mysqli_num_rows($resultado);
		
		// registro encontrado
        if($nregistros==1)
        {
			$losdatos = mysqli_fetch_array($resultado);
			// recupero la contraseña encriptada
			$contrasenia_encriptada=$losdatos["password"];
			
			// compruebo si la contraseña es válida
			if (password_verify($password, $contrasenia_encriptada))
				{
				  return 1;
				} 
        }
		// registro no encontrado
        elseif ($nregistros==0)
        {
            return 0;
        }
		# cerramos la conexión 
		mysqli_close($conexion); 	
    }

// quito caracteres peligrosos
$dni = mysqli_real_escape_string($conexion, $_POST['eldni']);
$lacontrasenia = $_POST['tcontrasenia'];
$recordar = $_POST['marcado'];

$losdatos = "";
if(verificar_login($dni, $lacontrasenia, $losdatos)){
	$_SESSION['idusuario'] = $losdatos['id'];
    $_SESSION['usuario_tipo'] = $losdatos['tipo'];

	if ($recordar == 1) {
        setcookie(session_name(), $_COOKIE[session_name()], time() + 2592000, '/');
    }

	$respuesta = array();
	$respuesta['usuario_tipo'] = $losdatos['tipo'];
	$respuesta['usuario_id'] = $losdatos['id'];

	header("Content-type:application/json; charset=utf-8");
	echo json_encode($respuesta);
}else{
	echo 0;
}

// cerramos la conexión 
mysqli_close($conexion);
