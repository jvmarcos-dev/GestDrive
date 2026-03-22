DELIMITER //
CREATE TRIGGER SUMAR_SALDO
AFTER
UPDATE ON reservas
FOR EACH ROW
BEGIN
    IF OLD.ESTADO='activa' AND NEW.ESTADO='cancelada_tiempo' THEN
        UPDATE ALUMNOS
        SET saldo_clases=saldo_clases+1
        WHERE id_usuario=NEW.id_alumno;
    END IF;
END //
DELIMITER ;
