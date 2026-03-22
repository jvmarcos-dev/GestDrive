DELIMITER //
CREATE PROCEDURE CANCELAR (IN v_id_reserva INT, OUT v_salida INT) 
BEGIN

DECLARE v_horas_restantes INT;
DECLARE v_id_clase INT;

    -- Cuanto falta para que se haga la clase?
    SELECT TIMESTAMPDIFF(HOUR, NOW(), clases_practicas.fecha_hora), RESERVAS.ID_CLASE
    INTO v_horas_restantes, v_id_clase
    FROM RESERVAS INNER JOIN CLASES_PRACTICAS 
    ON RESERVAS.ID_CLASE = CLASES_PRACTICAS.ID
    WHERE RESERVAS.ID = v_id_reserva;

    -- Si faltan más de 48 horas la clase está cancelada a tiempo
    IF (v_horas_restantes > 48) THEN
        UPDATE RESERVAS
        SET ESTADO = 'cancelada_tiempo'
        WHERE ID = v_id_reserva;

        UPDATE CLASES_PRACTICAS
        SET ESTADO = 'libre'
        WHERE ID = v_id_clase;

        SET v_salida = 1;

    ELSE
        UPDATE RESERVAS
        SET ESTADO = 'cancelada_tarde'
        WHERE ID = v_id_reserva;

        UPDATE CLASES_PRACTICAS
        SET ESTADO = 'libre'
        WHERE ID = v_id_clase;

        SET v_salida = 2;


    END IF;
END //
DELIMITER ;

/*
call CANCELAR(ID_RESERVA, @SALIDA);
SELECT @SALIDA;
*/