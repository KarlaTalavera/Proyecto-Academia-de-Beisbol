const db = require('./config/database')

async function runMigrations() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS notificacion (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      id_usuario INT,
      tipo       ENUM('admin','caja') NOT NULL,
      titulo     VARCHAR(200) NOT NULL,
      mensaje    TEXT NOT NULL,
      leida      TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS estadio (
      id_estadio INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      ciudad VARCHAR(100) NOT NULL,
      direccion VARCHAR(255) DEFAULT NULL,
      capacidad INT NOT NULL DEFAULT 0,
      foto_url VARCHAR(255) DEFAULT NULL,
      activo TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await db.query(`ALTER TABLE partido ADD COLUMN id_estadio int(11) DEFAULT NULL AFTER hora_juego`).catch(() => {})
  await db.query(`ALTER TABLE partido ADD CONSTRAINT fk_partido_estadio FOREIGN KEY (id_estadio) REFERENCES estadio(id_estadio) ON DELETE SET NULL`).catch(() => {})

  // Agrega columna categoria a ingreso si no existe
  await db.query(
    `ALTER TABLE ingreso ADD COLUMN categoria
     ENUM('inscripcion','patrocinio','taquilleria','concesion','multa','otro') DEFAULT 'otro'`
  ).catch(() => {})

  // Si la columna ya existía sin concesion, modificar el ENUM
  await db.query(
    `ALTER TABLE ingreso MODIFY COLUMN categoria
     ENUM('inscripcion','patrocinio','taquilleria','concesion','multa','otro') DEFAULT 'otro'`
  ).catch(() => {})

  // Rellenar categoria en registros existentes basándose en el concepto
  await db.query(`
    UPDATE ingreso SET categoria = 'inscripcion'
    WHERE (categoria IS NULL OR categoria = 'otro')
      AND (LOWER(concepto) LIKE '%inscripci%' OR LOWER(concepto) LIKE '%registro%')
  `).catch(() => {})

  await db.query(`
    UPDATE ingreso SET categoria = 'patrocinio'
    WHERE (categoria IS NULL OR categoria = 'otro')
      AND LOWER(concepto) LIKE '%patrocin%'
  `).catch(() => {})

  await db.query(`
    UPDATE ingreso SET categoria = 'taquilleria'
    WHERE (categoria IS NULL OR categoria = 'otro')
      AND (LOWER(concepto) LIKE '%taquill%' OR LOWER(concepto) LIKE '%boleto%' OR LOWER(concepto) LIKE '%entrada%')
  `).catch(() => {})

  await db.query(`
    UPDATE ingreso SET categoria = 'concesion'
    WHERE (categoria IS NULL OR categoria = 'otro')
      AND (LOWER(concepto) LIKE '%concesi%' OR LOWER(concepto) LIKE '%comida%'
           OR LOWER(concepto) LIKE '%bebida%' OR LOWER(concepto) LIKE '%venta%')
  `).catch(() => {})

  await db.query(`
    UPDATE ingreso SET categoria = 'multa'
    WHERE (categoria IS NULL OR categoria = 'otro')
      AND LOWER(concepto) LIKE '%multa%'
  `).catch(() => {})
}

module.exports = runMigrations
