-- Crear tabla estadios
CREATE TABLE `estadios` (
  `id_estadio` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `ubicacion` varchar(200) DEFAULT NULL,
  `capacidad` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_estadio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar estadios únicos de la tabla partido (basado en 'lugar')
INSERT INTO `estadios` (`nombre`, `ubicacion`, `capacidad`) VALUES
('Estadio Universitario', 'Ciudad Universitaria', 12000),
('Estadio La Ceiba', 'La Ceiba', 8000),
('Estadio Alfonso López', 'Barranquilla', 9000),
('Estadio Antonio Herrera', 'Puerto La Cruz', 7000),
('Estadio José Pérez Colmenares', 'Valencia', 10000),
('Estadio Luis Aparicio', 'Maracaibo', 15000),
('Estadio Litoral', 'Puerto Cabello', 6000);

-- Agregar columna id_estadio a partido
ALTER TABLE `partido` ADD COLUMN `id_estadio` int(11) DEFAULT NULL AFTER `hora_juego`;

-- Actualizar partido con id_estadio basado en lugar
UPDATE `partido` SET `id_estadio` = (SELECT `id_estadio` FROM `estadios` WHERE `estadios`.`nombre` = `partido`.`lugar` LIMIT 1);

-- Hacer id_estadio NOT NULL y agregar FK
ALTER TABLE `partido` MODIFY `id_estadio` int(11) NOT NULL;
ALTER TABLE `partido` ADD CONSTRAINT `fk_partido_estadio` FOREIGN KEY (`id_estadio`) REFERENCES `estadios` (`id_estadio`) ON DELETE CASCADE;

-- Eliminar columna lugar
ALTER TABLE `partido` DROP COLUMN `lugar`;