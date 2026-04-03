<?php
    // Calculamos qué día fue hace exactamente 16 años para saber si su fecha de nacimiento es valida.
    $fecha_maxima = date('Y-m-d', strtotime('-16 years'));
?>

<form id="formulario1" name="formulario1" ENCTYPE="multipart/form-data"
					ACTION="PHP_Alta_Usuario.php" METHOD="POST" TARGET="mensaje" autocomplete="off"
					onsubmit="registroAlumno(event); return false;">
					<p class="leyenda">REGISTRAR ALUMNO</p><br>
					<div class="form-group">
						<label class="titulo" for="dni">DNI / NIE:</label>
						<input class="elinput" id="dni" name="dni" type="text" pattern="([0-9]{8}[A-Za-z])|([XYZxyz][0-9]{7}[A-Za-z])"
                            title="Introduce 8 números y 1 letra (DNI) o Letra X,Y,Z, 7 números y 1 letra (NIE)"
							minlength="9" maxlength="9"
							style="text-transform: uppercase;" required autofocus
							placeholder="Ej: 11267905K">
					</div>

					<div class="form-group">
						<label class="titulo" for="nombre">Nombre:</label>
						<input class="elinput" id="nombre" name="nombre" type="text" minlength="1" maxlength="60"
						style="text-transform: capitalize;" required
						placeholder="Ej: Juan Valentín">
					</div>

                    <div class="form-group">
						<label class="titulo" for="apellidos">Apellidos:</label>
						<input class="elinput" id="apellidos" name="apellidos" type="text" minlength="1" maxlength="100"
						style="text-transform: capitalize;" required
						placeholder="Ej: Marcos Argandoña">
					</div>

                    <div class="form-group">
						<label class="titulo" for="email">Email:</label>
						<input class="elinput" id="email" name="email" type="email" minlength="1" maxlength="100" required
							placeholder="Ej: jm7023333@gmail.com">
					</div>

                    <div class="form-group">
						<label class="titulo" for="telefono">Telefono:</label>
						<input class="elinput" id="telefono" name="telefono" type="tel" minlength="1" maxlength="15" pattern="[0-9]{9,15}"
                        title="Introduce entre 9 y 15 números" required
						placeholder="Ej: 691087441">
					</div>

                    <div class="form-group">
						<label class="titulo" for="fecha_nac">Fecha de Nacimiento:</label>
						<input class="elinput" id="fecha_nac" name="fecha_nac" type="date" max="<?php echo $fecha_maxima; ?>" required>
					</div>

					<div class="form-group">
						<label class="titulo" for="saldo_inicial">Saldo de clases inicial:</label>
						<input class="elinput" id="saldo_inicial" name="saldo_inicial" type="number" value="0" min="0" required>
					</div>
					
					<div class="form-group">
						<p class="titulo">Estado del Teórico:</p>
						<div id="lasopciones">
							<label for="pendiente" class="elradio">
								<input id="pendiente" name="estado_teorico" type="radio" value="pendiente" checked>
								Pendiente
							</label>
							<label for="apto" class="elradio">
								<input id="apto" name="estado_teorico" type="radio" value="apto">
								Apto
							</label>
						</div>
					</div>

					<div id="boton_confirmar">
						<button id="elboton" form="formulario1" type="submit">Realizar Alta</button>
					</div>
</form>