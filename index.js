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

// Global error handlers
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
    // Keep process alive for debugging
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
});

app.use('/api', testRoutes);

// Define all assignment tables based on location and type
const LOCATIONS = [
    'calle72', 'barranquilla', 'cali', 'cartagena', 'floresta', 'kennedy',
    'medellin', 'aeropuerto', 'american_express', 'boston_consulting',
    'popayan', 'emergencia', 'implant'
];
const TYPES = ['pc', 'portatil', 'tablet'];

const ASSIGNMENT_TABLES = [];
TYPES.forEach(type => {
    LOCATIONS.forEach(location => {
        ASSIGNMENT_TABLES.push(`${type}_${location}`);
    });
});

// Helper to search in all assignment tables
const findInAllAssignmentTables = async (serviceTag) => {
    const queries = ASSIGNMENT_TABLES.map(table => {
        const isCalle72 = table.includes('_calle72');
        const isImplantTable = table.endsWith('_implant');

        const sucursalCol = (isCalle72 || !isImplantTable) ? 'sucursal' : 'NULL as sucursal';
        const implantCol = (isCalle72 || isImplantTable) ? 'implant' : 'NULL as implant';

        return `SELECT id, tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
                marca_pantalla, referencia_pantalla, service_tag_pantalla, activo_pantalla,
                nombre_funcionario, correo, area, jefe_inmediato, ${sucursalCol}, ${implantCol},
                '${table}' as source_table 
                FROM ${table} WHERE service_tag_cpu = '${serviceTag}'`;
    });
    const fullQuery = queries.join(' UNION ALL ');
    const result = await pool.query(fullQuery);
    return result.rows.length > 0 ? result.rows[0] : null;
};

// Helper to determine table suffix from location
const getLocationSuffix = (sucursal, implant) => {
    if (implant && implant.trim()) {
        const imp = implant.toLowerCase();
        if (imp.includes('american')) return 'american_express';
        if (imp.includes('boston')) return 'boston_consulting';
        return 'implant';
    }
    const suc = (sucursal || '').toLowerCase();
    if (suc.includes('calle 72')) return 'calle72';
    if (suc.includes('barranquilla')) return 'barranquilla';
    if (suc.includes('cali')) return 'cali';
    if (suc.includes('cartagena')) return 'cartagena';
    if (suc.includes('floresta')) return 'floresta';
    if (suc.includes('kennedy')) return 'kennedy';
    if (suc.includes('medellin')) return 'medellin';
    if (suc.includes('aeropuerto')) return 'aeropuerto';
    if (suc.includes('popayan')) return 'popayan';
    if (suc.includes('emergencia')) return 'emergencia';
    return suc.replace(/\s+/g, '_');
};

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
        const queries = ASSIGNMENT_TABLES.map(table => {
            const isCalle72 = table.includes('_calle72');
            const isImplantTable = table.endsWith('_implant');

            const sucursalCol = (isCalle72 || !isImplantTable) ? 'sucursal' : 'NULL as sucursal';
            const implantCol = (isCalle72 || isImplantTable) ? 'implant' : 'NULL as implant';

            return `SELECT id, tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
                    marca_pantalla, referencia_pantalla, service_tag_pantalla, activo_pantalla,
                    nombre_funcionario, correo, area, jefe_inmediato, ${sucursalCol}, ${implantCol}
                    FROM ${table}`;
        });
        const query = queries.join(' UNION ALL ');
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/equipment', async (req, res) => {
    try {
        // Get assigned equipment
        const queries = ASSIGNMENT_TABLES.map(table => {
            const isCalle72 = table.includes('_calle72');
            const isImplantTable = table.endsWith('_implant');

            const sucursalCol = (isCalle72 || !isImplantTable) ? 'sucursal' : 'NULL as sucursal';
            const implantCol = (isCalle72 || isImplantTable) ? 'implant' : 'NULL as implant';

            return `SELECT id, tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
                    marca_pantalla, referencia_pantalla, service_tag_pantalla, activo_pantalla,
                    nombre_funcionario, correo, area, jefe_inmediato, ${sucursalCol}, ${implantCol},
                    'asignado' as status
                    FROM ${table}`;
        });
        const assignmentsQuery = queries.join(' UNION ALL ');

        // Get available equipment
        const availableQuery = `SELECT *, 'disponible' as status FROM disponibles`;

        // Get maintenance equipment
        const maintenanceQuery = `SELECT *, 'mantenimiento' as status FROM mantenimientos`;

        const [assignments, available, maintenance] = await Promise.all([
            pool.query(assignmentsQuery),
            pool.query(availableQuery),
            pool.query(maintenanceQuery)
        ]);

        const allEquipment = [
            ...assignments.rows,
            ...available.rows,
            ...maintenance.rows
        ];

        res.json(allEquipment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.get('/api/asignaciones/:tipo', async (req, res) => {
    const { tipo } = req.params;
    try {
        // Filter tables by type
        const relevantTables = ASSIGNMENT_TABLES.filter(t => t.startsWith(tipo.toLowerCase()));

        if (relevantTables.length === 0) {
            return res.json([]);
        }

        const queries = relevantTables.map(table => {
            const isCalle72 = table.includes('_calle72');
            const isImplantTable = table.endsWith('_implant');

            const sucursalCol = (isCalle72 || !isImplantTable) ? 'sucursal' : 'NULL as sucursal';
            const implantCol = (isCalle72 || isImplantTable) ? 'implant' : 'NULL as implant';

            return `SELECT id, tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
                    marca_pantalla, referencia_pantalla, service_tag_pantalla, activo_pantalla,
                    nombre_funcionario, correo, area, jefe_inmediato, ${sucursalCol}, ${implantCol}
                    FROM ${table}`;
        });

        const query = queries.join(' UNION ALL ');
        const result = await pool.query(query);
        res.json(result.rows);
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

        let normalizedType = equipo.tipo.toLowerCase();
        if (normalizedType === 'portatiles') normalizedType = 'portatil';
        if (normalizedType === 'tablets') normalizedType = 'tablet';
        if (normalizedType === 'escritorio') normalizedType = 'pc';

        const suffix = getLocationSuffix(equipo.sucursal, equipo.implant);
        const tableName = `${normalizedType}_${suffix}`;

        // Verify table exists in our list (security check)
        if (!ASSIGNMENT_TABLES.includes(tableName)) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ msg: `Target table ${tableName} not found for this location` });
        }

        const query = `
            INSERT INTO ${tableName} (
                tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
                marca_pantalla, referencia_pantalla, service_tag_pantalla, activo_pantalla,
                acta, nombre_funcionario, correo, area, jefe_inmediato, hoja_vida, ruta_archivo,
                sucursal, implant
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *`;

        const values = [
            equipo.tipo, equipo.marca_cpu, equipo.referencia_cpu, equipo.service_tag_cpu, equipo.activo_cpu,
            equipo.marca_pantalla, equipo.referencia_pantalla, equipo.service_tag_pantalla, equipo.activo_pantalla,
            acta, nombre_funcionario, correo, area, jefe_inmediato, equipo.hoja_vida, equipo.ruta_archivo,
            equipo.sucursal, equipo.implant
        ];

        const newAsignacionResult = await pool.query(query, values);

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
        // Search in assignments
        let equipment = await findInAllAssignmentTables(serviceTag);

        if (!equipment) {
            // Search in other tables
            const otherTables = ['disponibles', 'danos', 'mantenimientos', 'renuncia'];
            for (const table of otherTables) {
                const result = await pool.query(`SELECT *, '${table}' as source_table FROM ${table} WHERE service_tag_cpu = $1`, [serviceTag]);
                if (result.rows.length > 0) {
                    equipment = result.rows[0];
                    break;
                }
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

        // Query all assignment tables
        const assignmentsQuery = ASSIGNMENT_TABLES.map(t => `SELECT *, '${t}' as source_table FROM ${t} WHERE service_tag_cpu = '${serviceTag}'`).join(' UNION ALL ');
        const assignmentsResult = await pool.query(assignmentsQuery);
        addEvents(assignmentsResult.rows, "assignment");

        // Query other tables
        const [disponibles, renuncias, danos, mantenimientos] = await Promise.all([
            pool.query(`SELECT *, 'disponibles' as source_table FROM disponibles WHERE service_tag_cpu = $1`, [serviceTag]),
            pool.query(`SELECT *, 'renuncia' as source_table FROM renuncia WHERE service_tag_cpu = $1`, [serviceTag]),
            pool.query(`SELECT *, 'danos' as source_table FROM danos WHERE service_tag_cpu = $1`, [serviceTag]),
            pool.query(`SELECT *, 'mantenimientos' as source_table FROM mantenimientos WHERE service_tag_cpu = $1`, [serviceTag]),
        ]);

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
    switch (type) {
        case "assignment": return "Asignación del equipo";
        case "unassignment": return "Renuncia del equipo";
        case "available": return "Ingreso a inventario";
        case "damage": return "Daño reportado";
        case "maintenance": return "Mantenimiento del equipo";
        default: return "Evento del equipo";
    }
}

function getEventDescription(type, row) {
    switch (type) {
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

        // Search in assignments
        let equipment = null;
        let sourceTable = null;

        const assignmentsQuery = ASSIGNMENT_TABLES.map(t => `SELECT *, '${t}' as source_table FROM ${t} WHERE service_tag_cpu = '${serviceTag}'`).join(' UNION ALL ');
        const assignmentsResult = await client.query(assignmentsQuery);

        if (assignmentsResult.rows.length > 0) {
            equipment = assignmentsResult.rows[0];
            sourceTable = equipment.source_table;
        } else {
            const otherTables = ['disponibles', 'mantenimientos'];
            for (const table of otherTables) {
                const result = await client.query(`SELECT *, '${table}' as source_table FROM ${table} WHERE service_tag_cpu = $1`, [serviceTag]);
                if (result.rows.length > 0) {
                    equipment = result.rows[0];
                    sourceTable = table;
                    break;
                }
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
                acta, hoja_vida, observaciones, ruta_archivo, sucursal, implant
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`;

        const values = [
            equipment.tipo, equipment.marca_cpu, equipment.referencia_cpu, equipment.service_tag_cpu, equipment.activo_cpu,
            equipment.marca_pantalla, equipment.referencia_pantalla, equipment.service_tag_pantalla, equipment.activo_pantalla,
            new Date(), equipment.hoja_vida, observaciones, equipment.ruta_archivo,
            equipment.sucursal, equipment.implant
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

// Endpoint para renuncia (asignaciones → renuncia)
app.post('/api/unassign/:serviceTag', async (req, res) => {
    const { serviceTag } = req.params;
    const { observaciones } = req.body;

    if (!serviceTag) {
        return res.status(400).json({ msg: 'Service tag is required' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Search in assignments
        let equipment = null;
        let sourceTable = null;

        const assignmentsQuery = ASSIGNMENT_TABLES.map(t => `SELECT *, '${t}' as source_table FROM ${t} WHERE service_tag_cpu = '${serviceTag}'`).join(' UNION ALL ');
        const result = await client.query(assignmentsQuery);

        if (result.rows.length > 0) {
            equipment = result.rows[0];
            sourceTable = equipment.source_table;
        }

        if (!equipment) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                msg: `Equipment with service tag ${serviceTag} not found in assignments`
            });
        }

        // Insertar en renuncia
        const insertQuery = `
            INSERT INTO renuncia (
                tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
                marca_pantalla, referencia_pantalla, service_tag_pantalla, activo_pantalla,
                nombre_funcionario, correo, area, jefe_inmediato,
                sucursal, implant
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
            RETURNING *`;

        const values = [
            equipment.tipo, equipment.marca_cpu, equipment.referencia_cpu,
            equipment.service_tag_cpu, equipment.activo_cpu,
            equipment.marca_pantalla, equipment.referencia_pantalla,
            equipment.service_tag_pantalla, equipment.activo_pantalla,
            equipment.nombre_funcionario, equipment.correo, equipment.area,
            equipment.jefe_inmediato,
            equipment.sucursal, equipment.implant
        ];

        const renunciaResult = await client.query(insertQuery, values);

        // Eliminar de la tabla de asignaciones
        await client.query(`DELETE FROM ${sourceTable} WHERE id = $1`, [equipment.id]);

        await client.query('COMMIT');
        res.status(201).json(renunciaResult.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error processing unassignment:', err.message);
        res.status(500).send('Server Error');
    } finally {
        client.release();
    }
});

// Endpoint para enviar a mantenimiento (asignaciones/disponibles → mantenimientos)
app.post('/api/maintenance/:serviceTag', async (req, res) => {
    const { serviceTag } = req.params;
    const { mantenimiento, descripcion } = req.body;

    if (!serviceTag) {
        return res.status(400).json({ msg: 'Service tag is required' });
    }
    if (!mantenimiento) {
        return res.status(400).json({ msg: 'Maintenance type is required' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Search in assignments
        let equipment = null;
        let sourceTable = null;

        const assignmentsQuery = ASSIGNMENT_TABLES.map(t => `SELECT *, '${t}' as source_table FROM ${t} WHERE service_tag_cpu = '${serviceTag}'`).join(' UNION ALL ');
        const assignmentsResult = await client.query(assignmentsQuery);

        if (assignmentsResult.rows.length > 0) {
            equipment = assignmentsResult.rows[0];
            sourceTable = equipment.source_table;
        } else {
            // Search in disponibles
            const result = await client.query(
                `SELECT *, 'disponibles' as source_table FROM disponibles WHERE service_tag_cpu = $1`,
                [serviceTag]
            );
            if (result.rows.length > 0) {
                equipment = result.rows[0];
                sourceTable = 'disponibles';
            }
        }

        if (!equipment) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                msg: `Equipment with service tag ${serviceTag} not found`
            });
        }

        // Insertar en mantenimientos
        const insertQuery = `
            INSERT INTO mantenimientos (
                tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
                marca_pantalla, referencia_pantalla, service_tag_pantalla, activo_pantalla,
                mantenimiento, descripcion, fecha, creado_en, ruta_archivo
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
            RETURNING *`;

        const now = new Date();
        const values = [
            equipment.tipo, equipment.marca_cpu, equipment.referencia_cpu,
            equipment.service_tag_cpu, equipment.activo_cpu,
            equipment.marca_pantalla, equipment.referencia_pantalla,
            equipment.service_tag_pantalla, equipment.activo_pantalla,
            mantenimiento, descripcion || '',
            now.toISOString().split('T')[0], // fecha
            now.toISOString(), // creado_en
            equipment.ruta_archivo
        ];

        const maintenanceResult = await client.query(insertQuery, values);

        // Eliminar de la tabla origen
        await client.query(`DELETE FROM ${sourceTable} WHERE id = $1`, [equipment.id]);

        await client.query('COMMIT');
        res.status(201).json(maintenanceResult.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating maintenance record:', err.message);
        res.status(500).send('Server Error');
    } finally {
        client.release();
    }
});

// Endpoint para completar mantenimiento (mantenimientos → disponibles)
app.post('/api/maintenance/complete/:serviceTag', async (req, res) => {
    const { serviceTag } = req.params;
    const { observaciones } = req.body;

    if (!serviceTag) {
        return res.status(400).json({ msg: 'Service tag is required' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const maintenanceResult = await client.query(
            'SELECT * FROM mantenimientos WHERE service_tag_cpu = $1',
            [serviceTag]
        );

        if (maintenanceResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                msg: `Equipment with service tag ${serviceTag} not found in maintenance`
            });
        }

        const equipment = maintenanceResult.rows[0];

        const insertQuery = `
            INSERT INTO disponibles (
                tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
                marca_pantalla, referencia_pantalla, service_tag_pantalla, activo_pantalla,
                observaciones, ruta_archivo
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING *`;

        const values = [
            equipment.tipo, equipment.marca_cpu, equipment.referencia_cpu,
            equipment.service_tag_cpu, equipment.activo_cpu,
            equipment.marca_pantalla, equipment.referencia_pantalla,
            equipment.service_tag_pantalla, equipment.activo_pantalla,
            observaciones || 'Mantenimiento completado',
            equipment.ruta_archivo
        ];

        const disponibleResult = await client.query(insertQuery, values);

        await client.query('DELETE FROM mantenimientos WHERE id = $1', [equipment.id]);

        await client.query('COMMIT');
        res.status(200).json(disponibleResult.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error completing maintenance:', err.message);
        res.status(500).send('Server Error');
    } finally {
        client.release();
    }
});

// Endpoint para reasignar desde renuncia (renuncia → disponibles)
app.post('/api/reassign/:serviceTag', async (req, res) => {
    const { serviceTag } = req.params;

    if (!serviceTag) {
        return res.status(400).json({ msg: 'Service tag is required' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const renunciaResult = await client.query(
            'SELECT * FROM renuncia WHERE service_tag_cpu = $1',
            [serviceTag]
        );

        if (renunciaResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                msg: `Equipment with service tag ${serviceTag} not found in resignations`
            });
        }

        const equipment = renunciaResult.rows[0];

        const insertQuery = `
            INSERT INTO disponibles (
                tipo, marca_cpu, referencia_cpu, service_tag_cpu, activo_cpu,
                marca_pantalla, referencia_pantalla, service_tag_pantalla, activo_pantalla,
                sucursal, implant, ruta_archivo
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
            RETURNING *`;

        const values = [
            equipment.tipo, equipment.marca_cpu, equipment.referencia_cpu,
            equipment.service_tag_cpu, equipment.activo_cpu,
            equipment.marca_pantalla, equipment.referencia_pantalla,
            equipment.service_tag_pantalla, equipment.activo_pantalla,
            equipment.sucursal, equipment.implant,
            equipment.ruta_archivo
        ];

        const disponibleResult = await client.query(insertQuery, values);

        await client.query('DELETE FROM renuncia WHERE id = $1', [equipment.id]);

        await client.query('COMMIT');
        res.status(200).json(disponibleResult.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error reassigning equipment:', err.message);
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
        const tables = ['disponibles', 'danos', 'renuncia', 'mantenimientos'];
        let filePath = null;

        // Search in assignments
        const assignmentsQuery = ASSIGNMENT_TABLES.map(t => `SELECT ruta_archivo FROM ${t} WHERE service_tag_cpu = '${serviceTag}'`).join(' UNION ALL ');
        const assignmentsResult = await pool.query(assignmentsQuery);

        if (assignmentsResult.rows.length > 0 && assignmentsResult.rows[0].ruta_archivo) {
            filePath = assignmentsResult.rows[0].ruta_archivo;
        } else {
            // Search in other tables
            for (const table of tables) {
                const result = await pool.query(`SELECT ruta_archivo FROM ${table} WHERE service_tag_cpu = $1`, [serviceTag]);
                if (result.rows.length > 0 && result.rows[0].ruta_archivo) {
                    filePath = result.rows[0].ruta_archivo;
                    break;
                }
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
        const tables = ['disponibles', 'danos', 'mantenimientos'];
        let equipment = null;

        // Search in assignments
        const assignmentsQuery = ASSIGNMENT_TABLES.map(t => `SELECT hoja_vida FROM ${t} WHERE service_tag_cpu = '${serviceTag}'`).join(' UNION ALL ');
        const assignmentsResult = await pool.query(assignmentsQuery);

        if (assignmentsResult.rows.length > 0 && assignmentsResult.rows[0].hoja_vida) {
            equipment = assignmentsResult.rows[0];
        } else {
            // Search in other tables
            for (const table of tables) {
                const result = await pool.query(`SELECT hoja_vida FROM ${table} WHERE service_tag_cpu = $1`, [serviceTag]);
                if (result.rows.length > 0 && result.rows[0].hoja_vida) {
                    equipment = result.rows[0];
                    break;
                }
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
    const actasDir = path.join(__dirname, 'actas');

    try {
        let matchedFile = null;

        /* PDF parsing disabled temporarily
        // ... code ...
        */

        if (!matchedFile) {
            return res.status(404).send("Búsqueda de actas por contenido deshabilitada temporalmente.");
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");
        res.sendFile(matchedFile);

    } catch (error) {
        console.error("Error buscando acta:", error);
        res.status(500).send("Error en el servidor");
    }
});

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('Press Ctrl+C to stop');
});

// Keep process alive hack (should not be needed for Express but helps debug)
setInterval(() => {
    // console.log('Heartbeat...'); // Uncomment if needed
}, 60000);

server.on('error', (err) => {
    console.error('SERVER ERROR:', err);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down...');
    server.close(() => {
        console.log('Process terminated');
    });
});
