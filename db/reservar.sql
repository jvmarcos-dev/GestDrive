DELIMITER //
CREATE PROCEDURE RESERVAR (IN v_id_alumno INT, IN v_id_clase INT, OUT v_salida INT) 
BEGIN

DECLARE v_saldo INT;
DECLARE v_reservas_activas INT;
DECLARE v_conflicto_horario INT;
DECLARE v_estado_clase VARCHAR(20);

    -- La clase existe y está libre?
    SELECT ESTADO INTO v_estado_clase
    FROM CLASES_PRACTICAS
    WHERE ID = v_id_clase;

    IF (v_estado_clase != 'libre') THEN
        SET v_salida = -4;

    ELSE
        -- El saldo del alumno es > 0?
        SELECT SALDO_CLASES INTO v_saldo
        FROM ALUMNOS
        WHERE ID_USUARIO = v_id_alumno;

        IF (v_saldo <= 0) THEN 
            SET v_salida = -1;

        ELSE
            -- El alumno tiene ya 2 reservas activas?
            SELECT COUNT(ESTADO) INTO v_reservas_activas
            FROM RESERVAS
            WHERE ID_ALUMNO = v_id_alumno AND ESTADO = 'activa';

            IF (v_reservas_activas >= 2) THEN 
                SET v_salida = -2;

            ELSE
                -- El alumno tiene ya una clase en ese horario?
                SELECT COUNT(*) INTO v_conflicto_horario
                FROM RESERVAS
                INNER JOIN CLASES_PRACTICAS ON RESERVAS.ID_CLASE = CLASES_PRACTICAS.ID
                WHERE RESERVAS.ID_ALUMNO = v_id_alumno
                AND RESERVAS.ESTADO = 'activa'
                AND CLASES_PRACTICAS.ID <> v_id_clase
                -- compruebo que las clases tengan al menos una diferencia de 45 minutos
                AND ABS(TIMESTAMPDIFF(MINUTE, CLASES_PRACTICAS.FECHA_HORA,
                    (SELECT FECHA_HORA FROM CLASES_PRACTICAS WHERE ID = v_id_clase))) < 45;

                IF (v_conflicto_horario > 0) THEN
                    SET v_salida = -3;

                ELSE
                    -- Insertar la reserva
                    INSERT INTO RESERVAS (id_clase, id_alumno, estado, notas, created_at)
                    VALUES (v_id_clase, v_id_alumno, 'activa', '', NOW());

                    -- Actualizar el estado de la clase
                    UPDATE CLASES_PRACTICAS
                    SET ESTADO = 'reservada'
                    WHERE ID = v_id_clase;

                    SET v_salida = 1;
                END IF;
            END IF;
        END IF;
    END IF;
END //
DELIMITER ;

/*
call RESERVAR(ID_ALUMNO, ID_CLASE, @SALIDA);
SELECT @SALIDA;
*/