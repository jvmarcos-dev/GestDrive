DROP DATABASE IF EXISTS gestdrive;
CREATE DATABASE gestdrive CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE gestdrive;

-- ============================================================
--  TABLA 1: usuarios
-- ============================================================
CREATE TABLE usuarios (
    id          INT             AUTO_INCREMENT PRIMARY KEY,
    dni         VARCHAR(9)      NOT NULL UNIQUE,
    nombre      VARCHAR(60)     NOT NULL,
    apellidos   VARCHAR(100)    NOT NULL,
    email       VARCHAR(100)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    telefono    VARCHAR(15)     NOT NULL DEFAULT '',
    tipo        ENUM('alumno','profesor','admin') NOT NULL,
    foto        VARCHAR(255)    NOT NULL DEFAULT ''
);

-- ============================================================
--  TABLA 2: alumnos
-- ============================================================
CREATE TABLE alumnos (
    id_usuario       INT     PRIMARY KEY,
    fecha_nacimiento DATE    NOT NULL,
    saldo_clases     INT     NOT NULL DEFAULT 0,
    estado_teorica   ENUM('pendiente','apto') NOT NULL DEFAULT 'pendiente',
    CONSTRAINT fk_alumno_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- ============================================================
--  TABLA 3: profesores
-- ============================================================
CREATE TABLE profesores (
    id_usuario   INT         PRIMARY KEY,
    num_licencia VARCHAR(20) NOT NULL UNIQUE,
    CONSTRAINT fk_profesor_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- ============================================================
--  TABLA 4: clases_practicas
-- ============================================================
CREATE TABLE clases_practicas (
    id          INT      AUTO_INCREMENT PRIMARY KEY,
    id_profesor INT      NOT NULL,
    fecha_hora  DATETIME NOT NULL,
    estado      ENUM('libre','reservada','realizada') NOT NULL DEFAULT 'libre',
    CONSTRAINT fk_clase_profesor
        FOREIGN KEY (id_profesor) REFERENCES profesores(id_usuario)
);

-- ============================================================
--  TABLA 5: reservas
-- ============================================================
CREATE TABLE reservas (
    id          INT           AUTO_INCREMENT PRIMARY KEY,
    id_clase    INT           NOT NULL,
    id_alumno   INT           NOT NULL,
    estado      ENUM('activa','cancelada_tiempo','cancelada_tarde','realizada') NOT NULL DEFAULT 'activa',
    notas       VARCHAR(1000) NOT NULL DEFAULT '',
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reserva_clase
        FOREIGN KEY (id_clase)  REFERENCES clases_practicas(id),
    CONSTRAINT fk_reserva_alumno
        FOREIGN KEY (id_alumno) REFERENCES alumnos(id_usuario)
);

-- ============================================================
--  TABLA 6: historico_alumnos
--  Alumnos que ya sacaron el carnet. Los mueve la app Java.
-- ============================================================
CREATE TABLE historico_alumnos (
    id               INT          AUTO_INCREMENT PRIMARY KEY,
    id_usuario_orig  INT          NOT NULL,
    dni              VARCHAR(9)   NOT NULL,
    nombre           VARCHAR(60)  NOT NULL,
    apellidos        VARCHAR(100) NOT NULL,
    email            VARCHAR(100) NOT NULL,
    telefono         VARCHAR(15)  NOT NULL DEFAULT '',
    fecha_nacimiento DATE         NOT NULL,
    fecha_archivo    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  DATOS DE PRUEBA
-- ============================================================

INSERT INTO usuarios (dni, nombre, apellidos, email, password, telefono, tipo, foto) VALUES
('00000000A', 'Admin', 'Sistema', 'admin@gestdrive.com', '1234', '600000000', 'admin', ''),
('11111111B', 'Carlos', 'Ruiz Soler', 'carlos@gestdrive.com', '1234', '611222333', 'profesor', ''),
('22222222C', 'Marta', 'Gómez Rey', 'marta@gestdrive.com', '1234', '622333444', 'profesor', ''),
('33333333D', 'Laura', 'Pérez Gil', 'laura@gmail.com', '1234', '633444555', 'alumno', ''),
('44444444E', 'Jorge', 'Sanz León', 'jorge@gmail.com', '1234', '644555666', 'alumno', ''),
('55555555F', 'Ana', 'López Vega', 'ana@gmail.com', '1234', '655666777', 'alumno', '');

-- ============================================================
-- 2. PROFESORES
-- ============================================================
INSERT INTO profesores (id_usuario, num_licencia) VALUES
(2, 'LIC-2015-X98'),
(3, 'LIC-2020-Z44');

-- ============================================================
-- 3. ALUMNOS (Diferentes escenarios de saldo)
-- ============================================================
INSERT INTO alumnos (id_usuario, fecha_nacimiento, saldo_clases, estado_teorica) VALUES
(4, '2002-05-15', 5, 'apto'),      -- Laura: Tiene saldo y teórica OK.
(5, '2004-10-20', 2, 'pendiente'), -- Jorge: Poco saldo y teórica pendiente.
(6, '1999-02-10', 0, 'apto');      -- Ana: SIN SALDO (para probar error -1).

-- ============================================================
-- 4. CLASES PRÁCTICAS (Pasado, Hoy y Futuro)
-- ============================================================
INSERT INTO clases_practicas (id, id_profesor, fecha_hora, estado) VALUES
-- Historial (Ya realizadas)
(1, 2, DATE_SUB(NOW(), INTERVAL 3 DAY), 'realizada'),
(2, 3, DATE_SUB(NOW(), INTERVAL 2 DAY), 'realizada'),

-- Clases para HOY (Para probar el "Cancelada Tarde" < 48h)
(3, 2, DATE_ADD(NOW(), INTERVAL 2 HOUR), 'reservada'), 
(4, 3, DATE_ADD(NOW(), INTERVAL 4 HOUR), 'libre'),

-- Clases para MAÑANA O PRÓXIMOS DÍAS (Libres para reservar)
(5, 2, DATE_ADD(NOW(), INTERVAL 2 DAY), 'libre'),
(6, 3, DATE_ADD(NOW(), INTERVAL 3 DAY), 'libre'),
(7, 2, DATE_ADD(NOW(), INTERVAL 3 DAY), 'libre'),
-- Esta clase está a solo 30 min de la ID 7 (Para probar error -3 de los 45 min)
(8, 3, DATE_ADD(DATE_ADD(NOW(), INTERVAL 3 DAY), INTERVAL 30 MINUTE), 'libre');

-- ============================================================
-- 5. RESERVAS ACTIVAS E HISTORIAL
-- ============================================================
INSERT INTO reservas (id_clase, id_alumno, estado, notas) VALUES
-- Laura tiene una clase realizada
(1, 4, 'realizada', 'Buen control de carriles.'),

-- Jorge tiene una reserva activa para HOY (ID 3)
-- Esto permite probar: 
-- 1. Que aparezca en "Reserva Activa".
-- 2. Que si intenta cancelarla, salga "Cancelada Tarde" (porque queda < 48h).
(3, 5, 'activa', 'Punto de encuentro: Puerta de la autoescuela.');

-- NOTA: No he insertado nada para Ana (ID 6) para que pruebes el 
-- mensaje de "No tienes saldo suficiente" al intentar reservar.

-- ============================================================
--  PROCEDIMIENTOS ALMACENADOS
-- ============================================================

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

                    -- Elimino el alumno de su tabla original y sus clases reservadas
                    DELETE FROM reservas WHERE id_alumno = v_id_alumno;
                    DELETE FROM usuarios WHERE id = v_id_alumno;

                    SET v_salida = 1;
                END IF;
            END IF;
        END IF;
END //
DELIMITER ;



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
-- ============================================================
--  TRIGGER
-- ============================================================

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
