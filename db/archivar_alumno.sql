DELIMITER //
CREATE PROCEDURE archivar_alumno (IN v_id_alumno INT, OUT v_salida INT) 
BEGIN

DECLARE v_usuario INT;
DECLARE v_teorico VARCHAR(20);
DECLARE v_fecha_nacimiento DATE;
DECLARE v_dni VARCHAR(9);
DECLARE v_nombre VARCHAR(60);
DECLARE v_apellidos VARCHAR(100);
DECLARE v_email VARCHAR(100);
DECLARE v_telefono VARCHAR(15);

    -- El alumno existe en la tabla alumnos?
    SELECT COUNT(*) INTO v_usuario
    FROM ALUMNOS
    WHERE id_usuario = v_id_alumno;

        IF v_usuario=0 THEN
            SET v_salida = -1;
        ELSE
            -- Tiene el teorico como apto?
            SELECT estado_teorica INTO v_teorico
            FROM ALUMNOS
            WHERE ID_USUARIO = v_id_alumno;

            IF (v_teorico <> 'apto') THEN 
                SET v_salida = -2;
            ELSE
                -- La edad del alumno es de 18 años o más?
                SELECT fecha_nacimiento INTO v_fecha_nacimiento
                FROM ALUMNOS
                WHERE ID_USUARIO = v_id_alumno;

            -- TIMESTAMPDIFF calcula el tiempo que ha pasado entre la Fecha 1 y la Fecha 2.
            -- Le decimos que nos lo devuelva en años (YEAR) usando CURDATE() que es la fecha de hoy sin horas.
                IF (TIMESTAMPDIFF(YEAR, v_fecha_nacimiento, CURDATE()) < 18) THEN 
                    SET v_salida = -3;
                ELSE
                    SELECT DNI, NOMBRE, APELLIDOS, EMAIL, TELEFONO 
                    INTO v_dni, v_nombre, v_apellidos, v_email, v_telefono
                    FROM USUARIOS 
                    WHERE ID = v_id_alumno;

                    -- Insertar el historico de alumnos
                    INSERT INTO historico_alumnos (id_usuario_orig, dni, nombre, apellidos, email, telefono, fecha_nacimiento, fecha_archivo)
                    VALUES (v_id_alumno, v_dni, v_nombre, v_apellidos, v_email, v_telefono, v_fecha_nacimiento, NOW());

                    -- Marcar como libres clases practicas que el alumno pudiera tener reservadas
                    UPDATE CLASES_PRACTICAS
                    SET ESTADO = 'libre'
                    WHERE ID IN (SELECT id_clase FROM RESERVAS WHERE id_alumno = v_id_alumno AND estado = 'activa');

                    --Elimino el alumno de su tabla original y sus clases reservadas
                    DELETE FROM reservas WHERE id_alumno = v_id_alumno;
                    DELETE FROM usuarios WHERE id = v_id_alumno;

                    SET v_salida = 1;
                END IF;
            END IF;
        END IF;
END //
DELIMITER ;

/*
call archivar_alumno(ID_ALUMNO, @SALIDA);
SELECT @SALIDA;
*/