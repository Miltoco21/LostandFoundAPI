-- Active: 1756995389866@@bhjxindtujbn50irv41z-mysql.services.clever-cloud.com@3306@bhjxindtujbn50irv41z
-- Active: 1756995389866@@bhjxindtujbn50irv41z-mysql.services.clever-cloud.com@3306@bhjxindtujbn50irv41z-mysql.services.clever-cloud.com@3306






CREATE TABLE `prendas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `rut` VARCHAR(12) NOT NULL,
  `tipo_prenda` VARCHAR(100) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `telefono` VARCHAR(15),
  `email` VARCHAR(255),
  `talla` VARCHAR(10),
  `observaciones` TEXT,
  `estado` ENUM('pendiente', 'en_proceso', 'listo', 'entregado') DEFAULT 'pendiente',
  `estado_devolucion` ENUM('no_devuelto', 'devuelto', 'perdido') DEFAULT 'no_devuelto',
  `fecha_devolucion` DATE,
  `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX `idx_rut` (`rut`),
  INDEX `idx_estado` (`estado`),
  INDEX `idx_fecha_registro` (`fecha_registro`)
);

ALTER TABLE `prendas` 
MODIFY COLUMN `estado` VARCHAR(100);

-- Modificar el campo estado_devolucion de ENUM a VARCHAR(100)
ALTER TABLE `prendas` 
MODIFY COLUMN `estado_devolucion` VARCHAR(100);












