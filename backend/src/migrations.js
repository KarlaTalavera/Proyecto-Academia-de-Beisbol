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
