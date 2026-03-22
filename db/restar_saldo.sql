DELIMITER //
CREATE TRIGGER RESTAR_SALDO
AFTER
INSERT ON reservas
FOR EACH ROW
BEGIN
    IF NEW.ESTADO='activa' THEN
        UPDATE ALUMNOS
        SET saldo_clases=saldo_clases-1
        WHERE id_usuario=NEW.id_alumno;
    END IF;
END //
DELIMITER ;
