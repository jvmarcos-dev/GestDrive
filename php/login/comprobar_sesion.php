<?php
session_start();

if (isset($_SESSION['idusuario']) && isset($_SESSION['usuario_tipo'])) {
    //si existe la sesión devolvemos el tipo para saber que dashboard cargar.
    echo $_SESSION['usuario_tipo'];
} else {
    echo 0;
}
?>