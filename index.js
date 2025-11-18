const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ============================
// ENDPOINTS PARA DISPONIBLES
// ============================

// GET all available equipment
app.get('/api/disponibles', async (req, res) => {
  try {
    const allAvailable = await pool.query('SELECT * FROM disponibles');
    res.json(allAvailable.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ============================
// ENDPOINTS PARA ASIGNACIONES
// ============================

// GET all assignments from all tables
app.get('/api/asignaciones', async (req, res) => {
  try {
    const pcs = await pool.query('SELECT * FROM asignaciones_pc');
    const portatiles = await pool.query('SELECT * FROM asignaciones_portatiles');
    const tablets = await pool.query('SELECT * FROM asignaciones_tablets');

    const allAsignaciones = [
      ...pcs.rows,
      ...portatiles.rows,
      ...tablets.rows,
    ];

    res.json(allAsignaciones);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET all equipment from all tables
app.get('/api/equipment', async (req, res) => {
  try {
    const pcs = await pool.query('SELECT * FROM asignaciones_pc');
    const portatiles = await pool.query('SELECT * FROM asignaciones_portatiles');
    const tablets = await pool.query('SELECT * FROM asignaciones_tablets');
    const disponibles = await pool.query('SELECT * FROM disponibles');

    const allEquipment = [
      ...pcs.rows,
      ...portatiles.rows,
      ...tablets.rows,
      ...disponibles.rows,
    ];

    res.json(allEquipment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET assignments by type
app.get('/api/asignaciones/:tipo', async (req, res) => {
    const { tipo } = req.params;
    let tableName;
    if (tipo.toLowerCase() === 'pc') {
        tableName = 'asignaciones_pc';
    } else if (tipo.toLowerCase() === 'portatiles') {
        tableName = 'asignaciones_portatiles';
    } else if (tipo.toLowerCase() === 'tablets') {
        tableName = 'asignaciones_tablets';
    } else {
        return res.status(400).json({ msg: 'Invalid equipment type' });
    }

    try {
        const asignaciones = await pool.query(`SELECT * FROM ${tableName}`);
        res.json(asignaciones.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// POST a new assignment
app.post('/api/asignaciones', async (req, res) => {
    const {
        disponible_id,
        nombre_funcionario,
        correo,
        area,
        jefe_inmediato,
        acta
    } = req.body;

    if (!disponible_id || !nombre_funcionario) {
        return res.status(400).json({ msg: 'disponible_id and nombre_funcionario are required' });
    }

    try {
        await pool.query('BEGIN');

        const equipoResult = await pool.query('SELECT * FROM disponibles WHERE id = $1', [disponible_id]);
        if (equipoResult.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ msg: 'Equipment not found in disponibles' });
        }
        const equipo = equipoResult.rows[0];

        await pool.query('DELETE FROM disponibles WHERE id = $1', [disponible_id]);

        let newAsignacionResult;
        const tipoLowerCase = equipo.tipo.toLowerCase();

        if (tipoLowerCase === 'pc' || tipoLowerCase === 'escritorio' || tipoLowerCase === 'portatil') {
            let tableName;
            if (tipoLowerCase === 'pc' || tipoLowerCase === 'escritorio') {
                tableName = 'asignaciones_pc';
            } else { // portatil
                tableName = 'asignaciones_portatiles';
            }
            
            const query = `
                INSERT INTO ${tableName} (
                    tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
                    marca_pantalla, referencia_pantalla, service_tag_pantalla, activo_pantalla,
                    acta, nombre_funcionario, correo, area, jefe_inmediato, hoja_vida
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`;
            const values = [
                equipo.tipo, equipo.marca_cpu, equipo.referencia_cpu, equipo.service_tag_cpu, equipo.activo_cpu,
                equipo.marca_pantalla, equipo.referencia_pantalla, equipo.service_tag_pantalla, equipo.activo_pantalla,
                acta, nombre_funcionario, correo, area, jefe_inmediato, equipo.hoja_vida
            ];
            newAsignacionResult = await pool.query(query, values);
        } else if (tipoLowerCase === 'tablet') {
            const query = `
                INSERT INTO asignaciones_tablets (
                    tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
                    acta, nombre_funcionario, correo, area, jefe_inmediato, hoja_vida
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;
            const values = [
                equipo.tipo, equipo.marca_cpu, equipo.referencia_cpu, equipo.service_tag_cpu, equipo.activo_cpu,
                acta, nombre_funcionario, correo, area, jefe_inmediato, equipo.hoja_vida
            ];
            newAsignacionResult = await pool.query(query, values);
        } else {
            await pool.query('ROLLBACK');
            return res.status(400).json({ msg: 'Unknown equipment type' });
        }

        await pool.query('COMMIT');
        res.json(newAsignacionResult.rows[0]);

    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET equipment by ID
app.get('/api/equipment/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pcResult = await pool.query('SELECT * FROM asignaciones_pc WHERE id = $1', [id]);
        if (pcResult.rows.length > 0) {
            return res.json(pcResult.rows[0]);
        }

        const portatilResult = await pool.query('SELECT * FROM asignaciones_portatiles WHERE id = $1', [id]);
        if (portatilResult.rows.length > 0) {
            return res.json(portatilResult.rows[0]);
        }

        const tabletResult = await pool.query('SELECT * FROM asignaciones_tablets WHERE id = $1', [id]);
        if (tabletResult.rows.length > 0) {
            return res.json(tabletResult.rows[0]);
        }

        const disponibleResult = await pool.query('SELECT * FROM disponibles WHERE id = $1', [id]);
        if (disponibleResult.rows.length > 0) {
            return res.json(disponibleResult.rows[0]);
        }

        res.status(404).json({ msg: 'Equipment not found' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/history/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Obtener el service tag a partir del ID
    const tagResult = await pool.query(`
      SELECT service_tag_cpu FROM asignaciones_pc WHERE id = $1
      UNION SELECT service_tag_cpu FROM asignaciones_portatiles WHERE id = $1
      UNION SELECT service_tag_cpu FROM asignaciones_tablets WHERE id = $1
      UNION SELECT service_tag_cpu FROM disponibles WHERE id = $1
    `, [id]);

    if (tagResult.rows.length === 0) {
      return res.status(404).json({ msg: "Equipo no encontrado" });
    }

    const tag = tagResult.rows[0].service_tag_cpu;

    // 2. Consultar historial en todas las tablas usando service_tag_cpu
    const results = [];

    const addEvents = (rows, type) => {
      rows.forEach(r => {
        results.push({
          id: r.id,
          eventType: type,    // assignment, available, damage, resign, etc.
          title: getEventTitle(type, r),
          description: getEventDescription(type, r),
          date: extractDate(r),
          time: extractTime(r),
          administrator: r.jefe_inmediato || null,
          employee: r.nombre_funcionario ? {
            name: r.nombre_funcionario,
            department: r.area,
            cedula: r.activo_cpu,
            email: r.correo
          } : null
        });
      });
    };

    const asignaciones_pc = await pool.query(`SELECT * FROM asignaciones_pc WHERE service_tag_cpu = $1`, [tag]);
    addEvents(asignaciones_pc.rows, "assignment");

    const asignaciones_port = await pool.query(`SELECT * FROM asignaciones_portatiles WHERE service_tag_cpu = $1`, [tag]);
    addEvents(asignaciones_port.rows, "assignment");

    const asignaciones_tab = await pool.query(`SELECT * FROM asignaciones_tablets WHERE service_tag_cpu = $1`, [tag]);
    addEvents(asignaciones_tab.rows, "assignment");

    const disponibles = await pool.query(`SELECT * FROM disponibles WHERE service_tag_cpu = $1`, [tag]);
    addEvents(disponibles.rows, "available");

    const renuncias = await pool.query(`SELECT * FROM renuncia WHERE service_tag_cpu = $1`, [tag]);
    addEvents(renuncias.rows, "unassignment");

    const danos = await pool.query(`SELECT * FROM danos WHERE service_tag_cpu = $1`, [tag]);
    addEvents(danos.rows, "damage");

    // 3. Ordenar de más nuevo → más antiguo
    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ history: results });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

function extractDate(row) {
  return row.acta?.split("T")[0] || "Sin fecha";
}

function extractTime(row) {
  return row.acta?.split("T")[1]?.substring(0,5) || "00:00";
}

function getEventTitle(type, row) {
  switch(type) {
    case "assignment": return "Asignación del equipo";
    case "unassignment": return "Renuncia del equipo";
    case "available": return "Ingreso a inventario";
    case "damage": return "Daño reportado";
    default: return "Evento del equipo";
  }
}

function getEventDescription(type, row) {
  switch(type) {
    case "assignment": return `El equipo fue asignado a ${row.nombre_funcionario}`;
    case "unassignment": return `El equipo fue devuelto por ${row.nombre_funcionario}`;
    case "available": return "El equipo está disponible en inventario";
    case "damage": return row.observaciones || "Daño registrado";
    default: return "";
  }
}


async function safeQuery(query, params) {
  try {
    return await pool.query(query, params);
  } catch (err) {
    console.warn("Query ignored:", err.message);
    return { rows: [] };
  }
}

app.get('/api/renuncia', async (req, res) => {
    try {
        const renuncias = await pool.query('SELECT * FROM renuncia');
        res.json(renuncias.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/renuncia', async (req, res) => {
    const { tipo_equipo, asignacion_id } = req.body;
    
    let fromTable;
    if (tipo_equipo.toLowerCase() === 'pc') fromTable = 'asignaciones_pc';
    else if (tipo_equipo.toLowerCase() === 'portatil') fromTable = 'asignaciones_portatiles';
    else if (tipo_equipo.toLowerCase() === 'tablet') fromTable = 'asignaciones_tablets';
    else return res.status(400).send('Invalid tipo_equipo');

    try {
        await pool.query('BEGIN');

        const asignacionResult = await pool.query(`SELECT * FROM ${fromTable} WHERE id = $1`, [asignacion_id]);
        if (asignacionResult.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).send('Asignacion not found');
        }
        const asignacion = asignacionResult.rows[0];

        const query = `
            INSERT INTO renuncia (
                tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
                marca_pantalla, referencia_pantalla, service_tag_pantalla, activo_pantalla,
                acta, nombre_funcionario, correo, area, jefe_inmediato, hoja_vida
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`;
        
        const values = [
            asignacion.tipo, asignacion.marca_cpu, asignacion.referencia_cpu, asignacion.service_tag_cpu, asignacion.activo_cpu,
            asignacion.marca_pantalla, asignacion.referencia_pantalla, asignacion.service_tag_pantalla, asignacion.activo_pantalla,
            asignacion.acta, asignacion.nombre_funcionario, asignacion.correo, asignacion.area, asignacion.jefe_inmediato, asignacion.hoja_vida
        ];

        const renunciaResult = await pool.query(query, values);
        
        await pool.query(`DELETE FROM ${fromTable} WHERE id = $1`, [asignacion_id]);

        await pool.query('COMMIT');
        res.status(201).json(renunciaResult.rows[0]);
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// ============================
// ENDPOINTS PARA DAÑOS
// ============================

app.get('/api/danos', async (req, res) => {
    try {
        const danos = await pool.query('SELECT * FROM danos');
        res.json(danos.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/danos', async (req, res) => {
    const { tipo_equipo, asignacion_id, observaciones } = req.body;

    let fromTable;
    if (tipo_equipo.toLowerCase() === 'pc') fromTable = 'asignaciones_pc';
    else if (tipo_equipo.toLowerCase() === 'portatil') fromTable = 'asignaciones_portatiles';
    else if (tipo_equipo.toLowerCase() === 'tablet') fromTable = 'asignaciones_tablets';
    else return res.status(400).send('Invalid tipo_equipo');
    
    try {
        await pool.query('BEGIN');

        const asignacionResult = await pool.query(`SELECT * FROM ${fromTable} WHERE id = $1`, [asignacion_id]);
        if (asignacionResult.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).send('Asignacion not found');
        }
        const asignacion = asignacionResult.rows[0];

        const query = `
            INSERT INTO danos (
                tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
                marca_pantalla, referencia_pantalla, service_tag_pantalla, activo_pantalla,
                acta, hoja_vida, observaciones
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`;
        
        const values = [
            asignacion.tipo, asignacion.marca_cpu, asignacion.referencia_cpu, asignacion.service_tag_cpu, asignacion.activo_cpu,
            asignacion.marca_pantalla, asignacion.referencia_pantalla, asignacion.service_tag_pantalla, asignacion.activo_pantalla,
            asignacion.acta, asignacion.hoja_vida, observaciones
        ];

        const danoResult = await pool.query(query, values);

        await pool.query(`DELETE FROM ${fromTable} WHERE id = $1`, [asignacion_id]);

        await pool.query('COMMIT');
        res.status(201).json(danoResult.rows[0]);
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
