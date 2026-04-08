<?php 
	session_start();
	
	// esto no hace falta
	// recordar como se borran variables de sesión -> sin cerrar la sesión
	unset($_SESSION['idusuario']);
	unset($_SESSION['usuario_tipo']);
	
	session_destroy();
	
	// esto no hace falta -> por qué? -> porque la cookie se borrará sola cuando se cierre el navegador
	//setcookie('PHPSESSID', $_COOKIE['PHPSESSID'], time()-10);
?>