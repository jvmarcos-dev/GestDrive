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
				SELECT USUARIOS.id FROM usuarios
                WHERE USUARIOS.tipo='profesor';
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
                        FROM CLASES_PRACTICAS
                        WHERE CLASES_PRACTICAS.id_profesor=v_profesor_id
                        AND CLASES_PRACTICAS.fecha_hora=v_fecha_hora_exacta;

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