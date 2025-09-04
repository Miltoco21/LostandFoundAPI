-- Active: 1724694582988@@ben5ld9pxvoeo3lkstud-mysql.services.clever-cloud.com@3306@ben5ld9pxvoeo3lkstud

 CREATE TABLE equipos (
   id INT(11)NOT NULL AUTO_INCREMENT,
   nombre VARCHAR(255)DEFAULT NULL,
   logo VARCHAR(255)DEFAULT NULL,
   email VARCHAR(255)DEFAULT NULL,
   representante VARCHAR(255)DEFAULT NULL,
   capitan VARCHAR(255)DEFAULT NULL,
   
   PRIMARY KEY(id)
 );
use ben5ld9pxvoeo3lkstud

create table jugadores (
  id bigint primary key ,
  nombre VARCHAR(255)DEFAULT NULL,
  posicion VARCHAR(255)DEFAULT NULL,
  equipo_id bigint references equipos (id),
  edad int not null
  
);

create table partidos(
  id bigint primary key ,
  equipoLocal_id bigint references equipos  (id),
  equipoVisita_id bigint references equipos  (id),
  fechaPartido date not null,
  resultadoLocal VARCHAR(255)DEFAULT NULL,
  resultadoVisita VARCHAR(255)DEFAULT NULL
);


create table estadisticas (
  id bigint primary key ,
  equipo_id  bigint references equipos (id),
  partidosJugados int default 0,
  ganados int default 0,
  perdidos int default 0,
  empates int default 0,
  puntos int default 0
);
create table tarjetas (
  id bigint primary key ,
  partido_id bigint references partidos (id),
  jugador_id bigint references jugadores (id),
  tarjeta VARCHAR(255)DEFAULT NULL
 
);

create table goleadores (
  id bigint primary key ,
 partido_id bigint references partidos (id),
  jugador_id bigint references jugadores (id)
  
);
create table pasadores (
  id bigint primary key,
  partido_id bigint references partidos(id),
  jugador_id bigint references jugadores(id),
  goleador_id bigint references goleadores(id)
);
alter TABLE jugadores 
  DROP COLUMN edad,
  ADD fechaNacimiento VARCHAR(255)DEFAULT NULL

alter TABLE jugadores 
ADD email VARCHAR(255)DEFAULT NULL

 
alter TABLE jugadores 
ADD rut VARCHAR(255)DEFAULT NULL

ALTER TABLE jugadores 
MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE jugadores DROP PRIMARY KEY;

ALTER TABLE jugadores MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT PRIMARY KEY;

SHOW TABLES;
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'ben5ld9pxvoeo3lkstud';

alter table tarjetas
add column tipo_tarjeta int;
ALTER TABLE tarjetas
ADD COLUMN tarjeta_tipo VARCHAR(255)DEFAULT NULL

ALTER TABLE tarjetas
DROP COLUMN tarjeta

show TABLES

