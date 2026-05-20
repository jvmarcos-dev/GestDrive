USE juanvalentin_gestdrive;

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
--  Alumnos que ya sacaron el carnet.
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

INSERT INTO usuarios (id, dni, nombre, apellidos, email, password, telefono, tipo, foto) VALUES
(1, '00000000A', 'Admin', 'Sistema', 'admin@gestdrive.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '600000000', 'admin', ''),
-- Nuevos Profesores (IDs 7 al 10)
(7, '77777777G', 'Roberto', 'Navarro Torres', 'roberto@gestdrive.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '677111222', 'profesor', 'imagenes/usuarios/2.jpg'),
(8, '88888888H', 'Elena', 'Martín Silva', 'elena@gestdrive.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '688222333', 'profesor', 'imagenes/usuarios/7.jpg'),
(9, '99999999I', 'David', 'Gómez Castro', 'david@gestdrive.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '699333444', 'profesor', 'imagenes/usuarios/12.jpg'),
(10, '10101010J', 'Carmen', 'López Díaz', 'carmen@gestdrive.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '610444555', 'profesor', 'imagenes/usuarios/4.jpg'),

-- Nuevos Alumnos (IDs 11 al 25)
(11, '11223344K', 'Mario', 'García López', 'mario@gmail.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '611555666', 'alumno', 'imagenes/usuarios/1.jpg'),
(12, '22334455L', 'Sara', 'Fernández Ruiz', 'sara@gmail.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '622666777', 'alumno', 'imagenes/usuarios/8.jpg'),
(13, '33445566M', 'Pablo', 'Sánchez Gil', 'pablo@gmail.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '633777888', 'alumno', 'imagenes/usuarios/14.jpg'),
(14, '44556677N', 'Lucía', 'Martínez Vega', 'lucia@gmail.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '644888999', 'alumno', 'imagenes/usuarios/3.jpg'),
(15, '55667788O', 'Hugo', 'Pérez Moreno', 'hugo@gmail.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '655999000', 'alumno', 'imagenes/usuarios/9.jpg'),
(16, '66778899P', 'Paula', 'Gómez Alonso', 'paula@gmail.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '666000111', 'alumno', 'imagenes/usuarios/11.jpg'),
(17, '77889900Q', 'Álvaro', 'Martín Blanco', 'alvaro@gmail.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '677111222', 'alumno', 'imagenes/usuarios/5.jpg'),
(18, '88990011R', 'Alba', 'Jiménez Cano', 'alba@gmail.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '688222333', 'alumno', 'imagenes/usuarios/10.jpg'),
(19, '99001122S', 'Diego', 'Ruiz Ortiz', 'diego@gmail.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '699333444', 'alumno', 'imagenes/usuarios/6.jpg'),
(20, '00112233T', 'María', 'Díaz Rubio', 'maria.d@gmail.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '600444555', 'alumno', 'imagenes/usuarios/13.jpg'),
(21, '12312312U', 'Javier', 'Hernández Paz', 'javier@gmail.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '612123123', 'alumno', 'imagenes/usuarios/1.jpg'),
(22, '23423423V', 'Nerea', 'Molina Castro', 'nerea@gmail.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '623234234', 'alumno', 'imagenes/usuarios/8.jpg'),
(23, '34534534W', 'Marcos', 'Delgado Soto', 'marcos@gmail.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '634345345', 'alumno', 'imagenes/usuarios/3.jpg'),
(24, '45645645X', 'Clara', 'Vázquez Mora', 'clara@gmail.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '645456456', 'alumno', 'imagenes/usuarios/12.jpg'),
(25, '56756756Y', 'Iván', 'Ramos Núñez', 'ivan@gmail.com', '$2y$10$oGf2JZDgQbpEc3F3DlzViu8ZrW3CXFeW.dF1s2.tUEBk9nY9fMjwa', '656567567', 'alumno', 'imagenes/usuarios/7.jpg');

-- ============================================================
-- 2. PROFESORES
-- ============================================================
INSERT INTO profesores (id_usuario, num_licencia) VALUES
(7, 'LIC-2018-A11'),
(8, 'LIC-2019-B22'),
(9, 'LIC-2021-C33'),
(10, 'LIC-2023-D44');

-- ============================================================
-- 3. ALUMNOS (Diferentes escenarios de saldo)
-- ============================================================
INSERT INTO alumnos (id_usuario, fecha_nacimiento, saldo_clases, estado_teorica) VALUES
(11, '2005-04-12', 10, 'apto'),
(12, '2004-08-25', 0, 'pendiente'),
(13, '2002-11-03', 4, 'apto'),
(14, '2006-01-30', 20, 'apto'),
(15, '1998-07-15', 1, 'pendiente'),
(16, '2001-09-22', 8, 'apto'),
(17, '2003-12-05', 0, 'pendiente'),
(18, '1995-03-18', 15, 'apto'),
(19, '2000-06-10', 3, 'pendiente'),
(20, '2005-02-28', 5, 'apto'),
(21, '2004-10-14', 12, 'apto'),
(22, '2006-05-09', 2, 'pendiente'),
(23, '1997-08-19', 0, 'apto'),
(24, '2001-11-27', 7, 'apto'),
(25, '2003-01-11', 1, 'pendiente');

-- ============================================================
-- 4. CLASES PRÁCTICAS (Pasado, Hoy y Futuro)
-- ============================================================
INSERT INTO clases_practicas (id, id_profesor, fecha_hora, estado) VALUES
-- Clases Pasadas (Realizadas o canceladas)
(9, 7, DATE_SUB(NOW(), INTERVAL 5 DAY), 'realizada'),
(10, 8, DATE_SUB(NOW(), INTERVAL 4 DAY), 'realizada'),
(11, 9, DATE_SUB(NOW(), INTERVAL 3 DAY), 'realizada'),
(12, 10, DATE_SUB(NOW(), INTERVAL 2 DAY), 'libre'), -- Clase que nadie reservó
(13, 7, DATE_SUB(NOW(), INTERVAL 1 DAY), 'realizada'),
(14, 8, DATE_SUB(NOW(), INTERVAL 1 DAY), 'realizada'),

-- Clases para Hoy
(15, 9, DATE_ADD(NOW(), INTERVAL 1 HOUR), 'reservada'),
(16, 10, DATE_ADD(NOW(), INTERVAL 3 HOUR), 'libre'),
(17, 7, DATE_ADD(NOW(), INTERVAL 5 HOUR), 'reservada'),
(18, 8, DATE_ADD(NOW(), INTERVAL 6 HOUR), 'reservada'),

-- Clases Futuras (Libres y reservadas para llenar el listado de reservas)
(19, 9, DATE_ADD(NOW(), INTERVAL 1 DAY), 'reservada'),
(20, 10, DATE_ADD(NOW(), INTERVAL 1 DAY), 'libre'),
(21, 7, DATE_ADD(NOW(), INTERVAL 2 DAY), 'libre'),
(22, 8, DATE_ADD(NOW(), INTERVAL 2 DAY), 'reservada'),
(23, 9, DATE_ADD(NOW(), INTERVAL 3 DAY), 'libre'),
(24, 10, DATE_ADD(NOW(), INTERVAL 3 DAY), 'reservada'),
(25, 7, DATE_ADD(NOW(), INTERVAL 4 DAY), 'libre'),
(26, 8, DATE_ADD(NOW(), INTERVAL 4 DAY), 'libre'),
(27, 9, DATE_ADD(NOW(), INTERVAL 5 DAY), 'reservada'),
(28, 10, DATE_ADD(NOW(), INTERVAL 5 DAY), 'libre');

-- ============================================================
-- 5. RESERVAS ACTIVAS E HISTORIAL
-- ============================================================
INSERT INTO reservas (id_clase, id_alumno, estado, notas) VALUES
-- Reservas pasadas (Historial)
(9, 11, 'realizada', 'Aparcamiento perfecto en línea.'),
(10, 14, 'realizada', 'Falta soltura en las rotondas.'),
(11, 16, 'realizada', 'Muy buena progresión con las marchas.'),
(13, 11, 'realizada', 'Practicamos conducción nocturna.'),
(14, 18, 'realizada', 'Cuidado con los pasos de cebra.'),

-- Cancelaciones pasadas para probar los labels rojos y grises
(11, 13, 'cancelada_tiempo', 'Canceló por enfermedad.'),
(9, 20, 'cancelada_tarde', 'Se quedó dormido, no avisó con margen.'),

-- Reservas activas (Clases pendientes)
(15, 11, 'activa', 'Recoger en puerta principal.'),
(17, 14, 'activa', 'Traer justificante de pago.'),
(18, 18, 'activa', 'Vamos a ir a la zona de examen.'),
(19, 21, 'activa', ''),
(22, 24, 'activa', 'Última clase antes del práctico.'),
(24, 16, 'activa', ''),
(27, 20, 'activa', 'Repaso general de maniobras.');

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
    SELECT estado INTO v_estado_clase
    FROM clases_practicas
    WHERE id = v_id_clase;

    IF (v_estado_clase != 'libre') THEN
        SET v_salida = -4;

    ELSE
        -- El saldo del alumno es > 0?
        SELECT saldo_clases INTO v_saldo
        FROM alumnos
        WHERE id_usuario = v_id_alumno;

        IF (v_saldo <= 0) THEN 
            SET v_salida = -1;

        ELSE
            -- El alumno tiene ya 2 reservas activas?
            SELECT COUNT(estado) INTO v_reservas_activas
            FROM reservas
            WHERE id_alumno = v_id_alumno AND estado = 'activa';

            IF (v_reservas_activas >= 2) THEN 
                SET v_salida = -2;

            ELSE
                -- El alumno tiene ya una clase en ese horario?
                SELECT COUNT(*) INTO v_conflicto_horario
                FROM reservas
                INNER JOIN clases_practicas ON reservas.id_clase = clases_practicas.id
                WHERE reservas.id_alumno = v_id_alumno
                AND reservas.estado = 'activa'
                AND clases_practicas.id <> v_id_clase
                -- compruebo que las clases tengan al menos una diferencia de 45 minutos
                AND ABS(TIMESTAMPDIFF(MINUTE, clases_practicas.fecha_hora,
                    (SELECT fecha_hora FROM clases_practicas WHERE id = v_id_clase))) < 45;

                IF (v_conflicto_horario > 0) THEN
                    SET v_salida = -3;

                ELSE
                    -- Insertar la reserva
                    INSERT INTO reservas (id_clase, id_alumno, estado, notas, created_at)
                    VALUES (v_id_clase, v_id_alumno, 'activa', '', NOW());

                    -- Actualizar el estado de la clase
                    UPDATE clases_practicas
                    SET estado = 'reservada'
                    WHERE id = v_id_clase;

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
    SELECT TIMESTAMPDIFF(HOUR, NOW(), clases_practicas.fecha_hora), reservas.id_clase
    INTO v_horas_restantes, v_id_clase
    FROM reservas INNER JOIN clases_practicas 
    ON reservas.id_clase = clases_practicas.id
    WHERE reservas.id = v_id_reserva;

    -- Si faltan más de 48 horas la clase está cancelada a tiempo
    IF (v_horas_restantes > 48) THEN
        UPDATE reservas
        SET estado = 'cancelada_tiempo'
        WHERE id = v_id_reserva;

        UPDATE clases_practicas
        SET estado = 'libre'
        WHERE id = v_id_clase;

        SET v_salida = 1;

    ELSE
        UPDATE reservas
        SET estado = 'cancelada_tarde'
        WHERE id = v_id_reserva;

        UPDATE clases_practicas
        SET estado = 'libre'
        WHERE id = v_id_clase;

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
    FROM alumnos
    WHERE id_usuario = v_id_alumno;

        IF v_usuario=0 THEN
            SET v_salida = -1;
        ELSE
            -- Tiene el teorico como apto?
            SELECT estado_teorica INTO v_teorico
            FROM alumnos
            WHERE id_usuario = v_id_alumno;

            IF (v_teorico <> 'apto') THEN 
                SET v_salida = -2;
            ELSE
                -- La edad del alumno es de 18 años o más?
                SELECT fecha_nacimiento INTO v_fecha_nacimiento
                FROM alumnos
                WHERE id_usuario = v_id_alumno;

            -- TIMESTAMPDIFF calcula el tiempo que ha pasado entre la Fecha 1 y la Fecha 2.
            -- Le decimos que nos lo devuelva en años (YEAR) usando CURDATE() que es la fecha de hoy sin horas.
                IF (TIMESTAMPDIFF(YEAR, v_fecha_nacimiento, CURDATE()) < 18) THEN 
                    SET v_salida = -3;
                ELSE
                    SELECT dni, nombre, apellidos, email, telefono 
                    INTO v_dni, v_nombre, v_apellidos, v_email, v_telefono
                    FROM usuarios 
                    WHERE id = v_id_alumno;

                    -- Insertar el historico de alumnos
                    INSERT INTO historico_alumnos (id_usuario_orig, dni, nombre, apellidos, email, telefono, fecha_nacimiento, fecha_archivo)
                    VALUES (v_id_alumno, v_dni, v_nombre, v_apellidos, v_email, v_telefono, v_fecha_nacimiento, NOW());

                    -- Marcar como libres clases practicas que el alumno pudiera tener reservadas
                    UPDATE clases_practicas
                    SET estado = 'libre'
                    WHERE id IN (SELECT id_clase FROM reservas WHERE id_alumno = v_id_alumno AND estado = 'activa');

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
    SELECT id_clase INTO v_id_clase FROM reservas WHERE id = v_id_reserva;

    -- Evaluación de la decisión enviada por js según el confirm (1=devolver, 0=No devolver)
    IF (v_devolver = 1) THEN
        -- la cancelación se realiza a tiempo
        UPDATE reservas SET estado = 'cancelada_tiempo' WHERE id = v_id_reserva;
        UPDATE clases_practicas SET estado = 'libre' WHERE id = v_id_clase;
        SET v_salida = 1;
    ELSE
        -- la cancelación será tarde y no se devolverá el saldo
        UPDATE reservas SET estado = 'cancelada_tarde' WHERE id = v_id_reserva;
        UPDATE clases_practicas SET estado = 'libre' WHERE id = v_id_clase;
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
    IF OLD.estado='activa' AND NEW.estado='cancelada_tiempo' THEN
        UPDATE alumnos
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
    IF NEW.estado='activa' THEN
        UPDATE alumnos
        SET saldo_clases=saldo_clases-1
        WHERE id_usuario=NEW.id_alumno;
    END IF;
END //
DELIMITER ;

-- ============================================================
--  CURSOR
-- ============================================================
DELIMITER //
CREATE PROCEDURE generar_clases(OUT v_salida INT)
BEGIN
        -- Declaración de variables
        DECLARE v_proximo_lunes DATE;
        DECLARE v_profesor_id INT;
        DECLARE v_fecha_aux DATE;
        DECLARE el_dia INT DEFAULT 0;
        DECLARE la_hora INT DEFAULT 0;
        DECLARE v_total INT;
        DECLARE v_clases_creadas INT DEFAULT 0;
        DECLARE v_fecha_hora_exacta DATETIME;

        -- Esto siempre hace falta
        DECLARE hecho BOOLEAN;

        -- (1) Definición del cursor
        DECLARE cursor_profesores CURSOR FOR 
                SELECT usuarios.id FROM usuarios
                WHERE usuarios.tipo='profesor';
        -- Declaración de un manejador de error tipo NOT FOUND
        -- Cuando se produzca un error de este tipo @hecho tomará valor TRUE
        -- Esto siempre hace falta
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET @hecho = TRUE;
        SET @hecho=false;

        -- De esta forma, a la fecha de hoy le sumo los días que faltan para terminar esta semana y siempre será lunes.
        -- Por ejemplo: Si hoy es Jueves (WEEKDAY= 3 ya que empieza a contar en 0): 7-3=4. Súmale 4 días a hoy y llegas al lunes.
        -- Si hoy es Domingo (WEEKDAY = 6): 7 - 6 = 1. Súmale 1 día y llegas al lunes.
        SET v_proximo_lunes = DATE_ADD(CURDATE(), INTERVAL (7 - WEEKDAY(CURDATE())) DAY);

        -- (2) Apertura del cursor
        OPEN cursor_profesores;

        -- (3) Bucle de lectura del Cursor
        profesores:
        LOOP
                -- Obtenemos la primera fila en la variables correspondientes
                FETCH cursor_profesores INTO v_profesor_id;
                SET el_dia = 0;

                -- Si el cursor se quedó sin elementos,
                -- entonces nos salimos del bucle
                IF @hecho THEN
                    LEAVE profesores;
                END IF;

                -- Pongo la fecha con la que voy a trabajar como el proximo lunes para despues poder calcular el momento exacto de la clase
                SET v_fecha_aux=v_proximo_lunes;
                dias_semana:
                LOOP
                    IF el_dia > 4 THEN
                        LEAVE dias_semana;
                    END IF;

                    -- variables para iterar
                    SET el_dia = el_dia + 1;
                    SET la_hora = 0;

                    horas_clases:
                    LOOP
                    -- Esto lo hago porque quiero que haya clases durante 8 horas.
                        IF la_hora > 7 THEN
                            LEAVE horas_clases;
                        END IF;

                        IF la_hora < 4 THEN
                            -- Mañanas: Empieza a las 09:00 (9 + 0 = 9:00, 9 + 1 = 10:00...)
                            -- La funcion maketime sirve para crear una hora a partir de horas, minutos y segundos.
                            SET v_fecha_hora_exacta = ADDTIME(CONVERT(v_fecha_aux, DATETIME), MAKETIME(9 + la_hora, 0, 0));
                        ELSE
                            -- Tardes: Empieza a las 16:00. Le resto 4 a la_hora (16 + (4-4) = 16:00, 16 + (5-4) = 17:00...)
                            SET v_fecha_hora_exacta = ADDTIME(CONVERT(v_fecha_aux, DATETIME), MAKETIME(16 + (la_hora - 4), 0, 0));
                        END IF;

                        -- Miro si ya hay alguna clase creada a la misma hora para el mismo profesor.
                        SELECT COUNT(*) INTO v_total
                        FROM clases_practicas
                        WHERE clases_practicas.id_profesor=v_profesor_id
                        AND clases_practicas.fecha_hora=v_fecha_hora_exacta;

                        IF v_total=0 THEN
                            INSERT INTO clases_practicas (id_profesor, fecha_hora, estado)
                            VALUES (v_profesor_id, v_fecha_hora_exacta, 'libre');

                            SET v_clases_creadas = v_clases_creadas + 1;
                        END IF;

                        SET la_hora = la_hora + 1;

                    END LOOP horas_clases;

                    SET v_fecha_aux = DATE_ADD(v_fecha_aux, INTERVAL 1 DAY);
                END LOOP dias_semana;
        END LOOP profesores;

        -- (4) Cerramos el cursor
        CLOSE cursor_profesores;

        IF v_clases_creadas > 0 THEN
            -- Se han creado las clases correctamente
            SET v_salida = 1;
        ELSE
            -- Las clases ya estaban creadas.
            SET v_salida = 0;
        END IF;
END //
DELIMITER ;