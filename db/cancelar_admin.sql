DELIMITER //
CREATE PROCEDURE CANCELAR_ADMIN (IN v_id_reserva INT, IN v_devolver INT, OUT v_salida INT) 
BEGIN

    DECLARE v_id_clase INT;

    -- consulta para saber que clase es la que se está cancelando
    SELECT ID_CLASE INTO v_id_clase FROM RESERVAS WHERE ID = v_id_reserva;

    -- Evaluación de la decisión enviada por js según el confirm (1=devolver, 0=No devolver)
    IF (v_devolver = 1) THEN
        -- la cancelación se realiza a tiempo
        UPDATE RESERVAS SET ESTADO = 'cancelada_tiempo' WHERE ID = v_id_reserva;
        UPDATE CLASES_PRACTICAS SET ESTADO = 'libre' WHERE ID = v_id_clase;
        SET v_salida = 1;
    ELSE
        -- la cancelación será tarde y no se devolverá el saldo
        UPDATE RESERVAS SET ESTADO = 'cancelada_tarde' WHERE ID = v_id_reserva;
        UPDATE CLASES_PRACTICAS SET ESTADO = 'libre' WHERE ID = v_id_clase;
        SET v_salida = 2;
    END IF;

END //
DELIMITER ;

/*
call CANCELAR_ADMIN(ID_RESERVA, VALOR_DEVUELTO, @SALIDA);
SELECT @SALIDA;
*/