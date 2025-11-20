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

// GET equipment by service tag
app.get('/api/equipment/by-tag/:serviceTag', async (req, res) => {
    const { serviceTag } = req.params;

    if (!serviceTag) {
        return res.status(400).json({ msg: 'Service tag is required' });
    }

    try {
        const tables = ['asignaciones_pc', 'asignaciones_portatiles', 'asignaciones_tablets', 'disponibles'];
        let equipment = null;

        for (const table of tables) {
            const result = await pool.query(`SELECT * FROM ${table} WHERE service_tag_cpu = $1`, [serviceTag]);
            if (result.rows.length > 0) {
                equipment = result.rows[0];
                // Add a 'source_table' property to know where it came from, useful for frontend logic.
                equipment.source_table = table;
                break; 
            }
        }

        if (equipment) {
            res.json(equipment);
        } else {
            res.status(404).json({ msg: `Equipment with service tag ${serviceTag} not found in any table` });
        }
    } catch (err) {
        console.error("Error fetching equipment by service tag:", err.message);
        res.status(500).send('Server error');
    }
});

// GET equipment by type and ID (DEPRECATED - use /by-tag/:serviceTag instead)
app.get('/api/equipment/:type/:id', async (req, res) => {
    const { type, id } = req.params;

    let tableName;
    const lowerCaseType = type.toLowerCase();

    if (lowerCaseType === 'pc' || lowerCaseType === 'escritorio') {
        tableName = 'asignaciones_pc';
    } else if (lowerCaseType === 'portatil') {
        tableName = 'asignaciones_portatiles';
    } else if (lowerCaseType === 'tablet') {
        tableName = 'asignaciones_tablets';
    } else if (lowerCaseType === 'disponible') {
        tableName = 'disponibles';
    } else {
        return res.status(400).json({ msg: 'Invalid equipment type specified' });
    }

    try {
        const result = await pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ msg: `Equipment not found in table ${tableName}` });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.put('/api/equipment/:id/maintenance', async (req, res) => {
  const { id } = req.params;
  const { maintenanceType } = req.body;

  const [type, recordId] = id.split('-');

  let tableName;
  switch (type) {
    case 'asignacion':
      tableName = 'asignaciones_pc'; // O determinar la tabla correcta según el tipo de equipo
      break;
    default:
      return res.status(400).json({ msg: 'Invalid equipment type for maintenance' });
  }

  let dateColumn;
  let interval;
  if (maintenanceType === 'preventive') {
    dateColumn = 'preventive_maintenance_date';
    interval = '3 months';
  } else if (maintenanceType === 'physical') {
    dateColumn = 'physical_maintenance_date';
    interval = '1 year';
  } else {
    return res.status(400).json({ msg: 'Invalid maintenance type' });
  }

  try {
    const query = `UPDATE ${tableName} SET ${dateColumn} = NOW() + INTERVAL '${interval}' WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [recordId]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// GET history by service tag
app.get('/api/history/by-tag/:serviceTag', async (req, res) => {
  const { serviceTag } = req.params;

  if (!serviceTag) {
    return res.status(400).json({ msg: "Service tag is required" });
  }

  try {
    const results = [];

    const addEvents = (rows, type, idField = 'id') => {
      rows.forEach(r => {
        const prefix = r.status === 'Disponible' ? 'disponible' : r.tipo.toLowerCase();
        results.push({
          id: `${prefix}-${r[idField]}`,
          eventType: type,
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

    // Use Promise.all for concurrent queries
    const queries = [
      pool.query(`SELECT *, 'asignaciones_pc' as source_table FROM asignaciones_pc WHERE service_tag_cpu = $1`, [serviceTag]),
      pool.query(`SELECT *, 'asignaciones_portatiles' as source_table FROM asignaciones_portatiles WHERE service_tag_cpu = $1`, [serviceTag]),
      pool.query(`SELECT *, 'asignaciones_tablets' as source_table FROM asignaciones_tablets WHERE service_tag_cpu = $1`, [serviceTag]),
      pool.query(`SELECT *, 'disponibles' as source_table FROM disponibles WHERE service_tag_cpu = $1`, [serviceTag]),
      pool.query(`SELECT *, 'renuncia' as source_table FROM renuncia WHERE service_tag_cpu = $1`, [serviceTag]),
      pool.query(`SELECT *, 'danos' as source_table FROM danos WHERE service_tag_cpu = $1`, [serviceTag]),
    ];

    const [pcs, portatiles, tablets, disponibles, renuncias, danos] = await Promise.all(queries);

    addEvents(pcs.rows, "assignment");
    addEvents(portatiles.rows, "assignment");
    addEvents(tablets.rows, "assignment");
    addEvents(disponibles.rows, "available");
    addEvents(renuncias.rows, "unassignment");
    addEvents(danos.rows, "damage");

    // Sort results from newest to oldest
    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ history: results });

  } catch (err) {
    console.error("Error fetching history by service tag:", err);
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


// Route to move an item from 'disponibles' to 'danos'
app.post('/api/equipment/:id/mark-damaged', async (req, res) => {
  const { id } = req.params;

  // Make sure the ID is a valid number
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID de equipo inválido.' });
  }

  const client = await pool.connect();

  try {
    // Start a transaction
    await client.query('BEGIN');

    // 1. Find the equipment in the 'disponibles' table
    const findQuery = 'SELECT * FROM disponibles WHERE id = $1';
    const findResult = await client.query(findQuery, [id]);
    const equipment = findResult.rows[0];

    if (!equipment) {
      // If not found, rollback and send an error
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Equipo no encontrado en la tabla de disponibles.' });
    }

    // 2. Insert the equipment data into the 'danos' table
    // IMPORTANT: Make sure the columns in your 'danos' table match these fields.
    // Add or remove fields as necessary. I'm assuming they are the same.
    const insertQuery = `
      INSERT INTO danos (
        tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
        marca_pantalla, referencia_pantalla, service_tag_pantalla, activo_pantalla,
        estado_equipo, acta, base, guaya, mouse, teclado, cargador, cable_red, cable_poder,
        adaptador_pantalla, adaptador_red, adaptador_multipuertos, antena_wireless,
        base_adicional, cable_poder_adicional, guaya_adicional, pantalla_adicional
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24, $25, $26
      )
    `;
    const values = [
      equipment.tipo, equipment.marca_cpu, equipment.referencia_cpu, equipment.service_tag_cpu, equipment.activo_cpu,
      equipment.marca_pantalla, equipment.referencia_pantalla, equipment.service_tag_pantalla, equipment.activo_pantalla,
      'Dañado', // estado_equipo
      new Date(), // acta (sets current date)
      equipment.base, equipment.guaya, equipment.mouse, equipment.teclado, equipment.cargador, equipment.cable_red, equipment.cable_poder,
      equipment.adaptador_pantalla, equipment.adaptador_red, equipment.adaptador_multipuertos, equipment.antena_wireless,
      equipment.base_adicional, equipment.cable_poder_adicional, equipment.guaya_adicional, equipment.pantalla_adicional
    ];
    await client.query(insertQuery, values);

    // 3. Delete the equipment from the 'disponibles' table
    const deleteQuery = 'DELETE FROM disponibles WHERE id = $1';
    await client.query(deleteQuery, [id]);

    // 4. Commit the transaction
    await client.query('COMMIT');

    res.status(200).json({ message: 'Equipo movido a la tabla de dañados exitosamente.' });

  } catch (error) {
    // If any error occurs, rollback the transaction
    await client.query('ROLLBACK');
    console.error('Error al mover el equipo a dañados:', error);
    res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud.' });
  } finally {
    // Release the client back to the pool
    client.release();
  }
});
