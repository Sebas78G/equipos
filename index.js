const express = require('express');
const cors = require('cors');
const pool = require('./db');
const testRoutes = require('./test-route');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', testRoutes);

app.get('/api/disponibles', async (req, res) => {
  try {
    const allAvailable = await pool.query('SELECT * FROM disponibles');
    res.json(allAvailable.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

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

app.get('/api/equipment', async (req, res) => {
  try {
    const pcs = await pool.query('SELECT * FROM asignaciones_pc');
    const portatiles = await pool.query('SELECT * FROM asignaciones_portatiles');
    const tablets = await pool.query('SELECT * FROM asignaciones_tablets');
    const disponibles = await pool.query('SELECT * FROM disponibles');
    const mantenimientos = await pool.query('SELECT * FROM mantenimientos');

    const allEquipment = [
      ...pcs.rows,
      ...portatiles.rows,
      ...tablets.rows,
      ...disponibles.rows,
      ...mantenimientos.rows,
    ];

    res.json(allEquipment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

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
                    acta, nombre_funcionario, correo, area, jefe_inmediato, hoja_vida, ruta_archivo
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`;
            const values = [
                equipo.tipo, equipo.marca_cpu, equipo.referencia_cpu, equipo.service_tag_cpu, equipo.activo_cpu,
                equipo.marca_pantalla, equipo.referencia_pantalla, equipo.service_tag_pantalla, equipo.activo_pantalla,
                acta, nombre_funcionario, correo, area, jefe_inmediato, equipo.hoja_vida, equipo.ruta_archivo
            ];
            newAsignacionResult = await pool.query(query, values);
        } else if (tipoLowerCase === 'tablet') {
            const query = `
                INSERT INTO asignaciones_tablets (
                    tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
                    acta, nombre_funcionario, correo, area, jefe_inmediato, hoja_vida, ruta_archivo
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`;
            const values = [
                equipo.tipo, equipo.marca_cpu, equipo.referencia_cpu, equipo.service_tag_cpu, equipo.activo_cpu,
                acta, nombre_funcionario, correo, area, jefe_inmediato, equipo.hoja_vida, equipo.ruta_archivo
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

app.get('/api/equipment/by-tag/:serviceTag', async (req, res) => {
    const { serviceTag } = req.params;

    if (!serviceTag) {
        return res.status(400).json({ msg: 'Service tag is required' });
    }

    try {
        const tables = ['asignaciones_pc', 'asignaciones_portatiles', 'asignaciones_tablets', 'disponibles', 'danos', 'mantenimientos'];
        let equipment = null;

        for (const table of tables) {
            const result = await pool.query(`SELECT * FROM ${table} WHERE service_tag_cpu = $1`, [serviceTag]);
            if (result.rows.length > 0) {
                equipment = result.rows[0];
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

app.get('/api/history/by-tag/:serviceTag', async (req, res) => {
  const { serviceTag } = req.params;

  if (!serviceTag) {
    return res.status(400).json({ msg: "Service tag is required" });
  }

  try {
    const results = [];

    const addEvents = (rows, type, idField = 'id') => {
      rows.forEach(r => {
        const prefix = r.status === 'Disponible' ? 'disponible' : (r.tipo || '').toLowerCase();
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

    const queries = [
      pool.query(`SELECT *, 'asignaciones_pc' as source_table FROM asignaciones_pc WHERE service_tag_cpu = $1`, [serviceTag]),
      pool.query(`SELECT *, 'asignaciones_portatiles' as source_table FROM asignaciones_portatiles WHERE service_tag_cpu = $1`, [serviceTag]),
      pool.query(`SELECT *, 'asignaciones_tablets' as source_table FROM asignaciones_tablets WHERE service_tag_cpu = $1`, [serviceTag]),
      pool.query(`SELECT *, 'disponibles' as source_table FROM disponibles WHERE service_tag_cpu = $1`, [serviceTag]),
      pool.query(`SELECT *, 'renuncia' as source_table FROM renuncia WHERE service_tag_cpu = $1`, [serviceTag]),
      pool.query(`SELECT *, 'danos' as source_table FROM danos WHERE service_tag_cpu = $1`, [serviceTag]),
      pool.query(`SELECT *, 'mantenimientos' as source_table FROM mantenimientos WHERE service_tag_cpu = $1`, [serviceTag]),
    ];

    const [pcs, portatiles, tablets, disponibles, renuncias, danos, mantenimientos] = await Promise.all(queries);

    addEvents(pcs.rows, "assignment");
    addEvents(portatiles.rows, "assignment");
    addEvents(tablets.rows, "assignment");
    addEvents(disponibles.rows, "available");
    addEvents(renuncias.rows, "unassignment");
    addEvents(danos.rows, "damage");
    addEvents(mantenimientos.rows, "maintenance");

    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ history: results });

  } catch (err) {
    console.error("Error fetching history by service tag:", err);
    res.status(500).send("Server error");
  }
});

function extractDate(row) {
    if (!row.acta) return "Sin fecha";
    if (typeof row.acta.toISOString === 'function') {
        return row.acta.toISOString().split('T')[0];
    }
    if (typeof row.acta === 'string') {
        return row.acta.split('T')[0];
    }
    return "Fecha inválida";
}

function extractTime(row) {
    if (!row.acta) return "00:00";
    if (typeof row.acta.toISOString === 'function') {
        const timePart = row.acta.toISOString().split('T')[1];
        return timePart ? timePart.substring(0, 5) : "00:00";
    }
    if (typeof row.acta === 'string') {
        const timePart = row.acta.split('T')[1];
        return timePart ? timePart.substring(0, 5) : "00:00";
    }
    return "00:00";
}

function getEventTitle(type, row) {
  switch(type) {
    case "assignment": return "Asignación del equipo";
    case "unassignment": return "Renuncia del equipo";
    case "available": return "Ingreso a inventario";
    case "damage": return "Daño reportado";
    case "maintenance": return "Mantenimiento del equipo";
    default: return "Evento del equipo";
  }
}

function getEventDescription(type, row) {
  switch(type) {
    case "assignment": return `El equipo fue asignado a ${row.nombre_funcionario}`;
    case "unassignment": return `El equipo fue devuelto por ${row.nombre_funcionario}`;
    case "available": return row.observaciones || "El equipo está disponible en inventario";
    case "damage": return row.observaciones || "Daño registrado";
    case "maintenance": return row.observaciones || "Mantenimiento registrado";
    default: return "";
  }
}

app.get('/api/danos', async (req, res) => {
    try {
        const danos = await pool.query('SELECT * FROM danos');
        res.json(danos.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/damage/by-tag/:serviceTag', async (req, res) => {
    const { serviceTag } = req.params;
    const { observaciones } = req.body;

    if (!serviceTag) {
        return res.status(400).json({ msg: 'Service tag is required' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const tables = ['asignaciones_pc', 'asignaciones_portatiles', 'asignaciones_tablets', 'disponibles', 'mantenimientos'];
        let equipment = null;
        let sourceTable = null;

        for (const table of tables) {
            const result = await client.query(`SELECT * FROM ${table} WHERE service_tag_cpu = $1`, [serviceTag]);
            if (result.rows.length > 0) {
                equipment = result.rows[0];
                sourceTable = table;
                break;
            }
        }

        if (!equipment) {
            await client.query('ROLLBACK');
            return res.status(404).json({ msg: `Equipment with service tag ${serviceTag} not found` });
        }

        const insertQuery = `
            INSERT INTO danos (
                tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
                marca_pantalla, referencia_pantalla, service_tag_pantalla, activo_pantalla,
                acta, hoja_vida, observaciones, ruta_archivo
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;
        
        const values = [
            equipment.tipo, equipment.marca_cpu, equipment.referencia_cpu, equipment.service_tag_cpu, equipment.activo_cpu,
            equipment.marca_pantalla, equipment.referencia_pantalla, equipment.service_tag_pantalla, equipment.activo_pantalla,
            new Date(), equipment.hoja_vida, observaciones, equipment.ruta_archivo
        ];

        const danoResult = await client.query(insertQuery, values);

        await client.query(`DELETE FROM ${sourceTable} WHERE id = $1`, [equipment.id]);

        await client.query('COMMIT');
        res.status(201).json(danoResult.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error reporting damage:', err.message);
        res.status(500).send('Server Error');
    } finally {
        client.release();
    }
});

app.post('/api/equipment/repair/:serviceTag', async (req, res) => {
    const { serviceTag } = req.params;
    const { repair_notes } = req.body;

    if (!serviceTag) {
        return res.status(400).json({ msg: 'Service tag is required' });
    }
    if (!repair_notes) {
        return res.status(400).json({ msg: 'Repair notes are required' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const damagedResult = await client.query('SELECT * FROM danos WHERE service_tag_cpu = $1', [serviceTag]);
        if (damagedResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ msg: `Equipment with service tag ${serviceTag} not found in danos` });
        }
        const equipment = damagedResult.rows[0];

        const insertQuery = `
            INSERT INTO disponibles (
                tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
                marca_pantalla, referencia_pantalla, service_tag_pantalla, activo_pantalla,
                hoja_vida, observaciones, acta, ruta_archivo
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;
        
        const values = [
            equipment.tipo, 
            equipment.marca_cpu, 
            equipment.referencia_cpu, 
            equipment.service_tag_cpu, 
            equipment.activo_cpu,
            equipment.marca_pantalla, 
            equipment.referencia_pantalla, 
            equipment.service_tag_pantalla, 
            equipment.activo_pantalla,
            equipment.hoja_vida, 
            repair_notes, // The new repair notes
            new Date(), // Update the date to the repair date
            equipment.ruta_archivo
        ];

        const repairedResult = await client.query(insertQuery, values);

        await client.query('DELETE FROM danos WHERE id = $1', [equipment.id]);

        await client.query('COMMIT');
        res.status(200).json(repairedResult.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error repairing equipment:', err.message);
        res.status(500).send('Server Error');
    } finally {
        client.release();
    }
});

app.post('/api/equipment/:id/mark-damaged', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID de equipo inválido.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const findQuery = 'SELECT * FROM disponibles WHERE id = $1';
    const findResult = await client.query(findQuery, [id]);
    const equipment = findResult.rows[0];

    if (!equipment) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Equipo no encontrado en la tabla de disponibles.' });
    }

    const insertQuery = `
      INSERT INTO danos (
        tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
        marca_pantalla, referencia_pantalla, service_tag_pantalla, activo_pantalla,
        observaciones, acta, base, guaya, mouse, teclado, cargador, cable_red, cable_poder,
        adaptador_pantalla, adaptador_red, adaptador_multipuertos, antena_wireless,
        base_adicional, cable_poder_adicional, guaya_adicional, pantalla_adicional, ruta_archivo
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
      )
    `;
    const values = [
      equipment.tipo, equipment.marca_cpu, equipment.referencia_cpu, equipment.service_tag_cpu, equipment.activo_cpu,
      equipment.marca_pantalla, equipment.referencia_pantalla, equipment.service_tag_pantalla, equipment.activo_pantalla,
      'Dañado', // observaciones
      new Date(), // acta (sets current date)
      equipment.base, equipment.guaya, equipment.mouse, equipment.teclado, equipment.cargador, equipment.cable_red, equipment.cable_poder,
      equipment.adaptador_pantalla, equipment.adaptador_red, equipment.adaptador_multipuertos, equipment.antena_wireless,
      equipment.base_adicional, equipment.cable_poder_adicional, equipment.guaya_adicional, equipment.pantalla_adicional,
      equipment.ruta_archivo
    ];
    await client.query(insertQuery, values);

    const deleteQuery = 'DELETE FROM disponibles WHERE id = $1';
    await client.query(deleteQuery, [id]);

    await client.query('COMMIT');

    res.status(200).json({ message: 'Equipo movido a la tabla de dañados exitosamente.' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al mover el equipo a dañados:', error);
    res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud.' });
  } finally {
    client.release();
  }
});

app.get('/api/equipment/acta/latest/:serviceTag', async (req, res) => {
    const { serviceTag } = req.params;
    if (!serviceTag) {
        return res.status(400).json({ msg: 'Service tag is required' });
    }

    try {
        const tables = ['asignaciones_pc', 'asignaciones_portatiles', 'asignaciones_tablets', 'disponibles', 'danos', 'renuncia', 'mantenimientos'];
        let filePath = null;

        for (const table of tables) {
            const result = await pool.query(`SELECT ruta_archivo FROM ${table} WHERE service_tag_cpu = $1`, [serviceTag]);
            if (result.rows.length > 0 && result.rows[0].ruta_archivo) {
                filePath = result.rows[0].ruta_archivo;
                break;
            }
        }

        if (!filePath) {
            const templatePath = path.join(__dirname, 'src', 'assets', 'acta', 'FOR ACTA DE ENTREGA DE EQUIPO V_02.pdf');
            if (fs.existsSync(templatePath)) {
                res.setHeader('Content-Type', 'application/pdf');
                return res.sendFile(templatePath);
            }
            return res.status(404).send('Acta template not found.');
        }

        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isDirectory()) {
            return res.status(404).send('Directory not found for this equipment.');
        }

        const files = fs.readdirSync(filePath);
        const actaFiles = files
            .filter(file => file.toUpperCase().includes('ACTA') && file.toLowerCase().endsWith('.pdf'))
            .map(file => ({
                name: file,
                time: fs.statSync(path.join(filePath, file)).mtime.getTime(),
            }))
            .sort((a, b) => b.time - a.time); // Sort by modification time, descending

        if (actaFiles.length === 0) {
            const templatePath = path.join(__dirname, 'src', 'assets', 'acta', 'FOR ACTA DE ENTREGA DE EQUIPO V_02.pdf');
            if (fs.existsSync(templatePath)) {
                res.setHeader('Content-Type', 'application/pdf');
                return res.sendFile(templatePath);
            }
            return res.status(404).send('No actas found in the directory and the default template is missing.');
        }

        const latestActaPath = path.join(filePath, actaFiles[0].name);
        
        const fileBuffer = fs.readFileSync(latestActaPath);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(fileBuffer);

    } catch (err) {
        console.error('Error fetching latest acta:', err.message);
        res.status(500).send('Server error');
    }
});


app.get('/api/equipment/hoja-de-vida/:serviceTag', async (req, res) => {
    const { serviceTag } = req.params;
    if (!serviceTag) {
        return res.status(400).json({ msg: 'Service tag is required' });
    }

    try {
        const tables = ['asignaciones_pc', 'asignaciones_portatiles', 'asignaciones_tablets', 'disponibles', 'danos', 'mantenimientos'];
        let equipment = null;

        for (const table of tables) {
            const result = await pool.query(`SELECT hoja_vida FROM ${table} WHERE service_tag_cpu = $1`, [serviceTag]);
            if (result.rows.length > 0 && result.rows[0].hoja_vida) {
                equipment = result.rows[0];
                break;
            }
        }

        if (equipment && equipment.hoja_vida) {
            const excelData = equipment.hoja_vida;

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'inline'); 

            res.send(excelData);
        } else {
            res.status(404).send('Hoja de Vida not found for this equipment.');
        }
    } catch (err) {
        console.error('Error fetching Hoja de Vida:', err.message);
        res.status(500).send('Server error');
    }
});


app.get("/api/equipment/Acta/:serviceTag", async (req, res) => {
    const { serviceTag } = req.params;

    const dir = "D:/Expreso Viajes y Turismo - CAFAM/TECNOLOGÍA - ACTAS";

    try {
        const files = fs.readdirSync(dir).filter(file => file.endsWith(".pdf"));

        let matchedFile = null;

        for (const file of files) {
            const pdfPath = path.join(dir, file);

            const fileBuffer = fs.readFileSync(pdfPath);
            const pdfData = await pdfParse(fileBuffer);

            if (pdfData.text.includes(serviceTag)) {
                matchedFile = pdfPath;
                break;
            }
        }

        if (!matchedFile) {
            return res.status(404).send("No se encontró un acta asociada con ese serviceTag.");
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");
        res.sendFile(matchedFile);

    } catch (error) {
        console.error("Error buscando acta:", error);
        res.status(500).send("Error en el servidor");
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
