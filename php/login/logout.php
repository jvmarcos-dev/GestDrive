<?php 
	session_start();
	
	// esto no hace falta
	// recordar como se borran variables de sesión -> sin cerrar la sesión

	//al hacerlo asi la cookie por algun motivo no se borraba si en alguna de las pruebas habia marcado el recordar aunque haya hecho logout mas tarde
	// unset($_SESSION['idusuario']);
	// unset($_SESSION['usuario_tipo']);
	
	// session_destroy();

	$_SESSION = array(); 
    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time() - 3600, '/');
    }
    session_destroy();

	
?>