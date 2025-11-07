const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection error');
  }
});

// Equipment endpoints

// Get all equipment
app.get('/api/equipment', async (req, res) => {
  try {
    const allEquipment = await pool.query('SELECT * FROM Equipment');
    res.json(allEquipment.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a single piece of equipment
app.get('/api/equipment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await pool.query('SELECT * FROM Equipment WHERE equipo_id = $1', [id]);

    if (equipment.rows.length === 0) {
      return res.status(404).json({ msg: 'Equipment not found' });
    }

    res.json(equipment.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new piece of equipment
app.post('/api/equipment', async (req, res) => {
    try {
        const { nombre_equipo, descripcion, numero_serie, estado } = req.body;
        const newEquipment = await pool.query(
            'INSERT INTO Equipment (nombre_equipo, descripcion, numero_serie, estado) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre_equipo, descripcion, numero_serie, estado]
        );
        res.json(newEquipment.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a piece of equipment
app.put('/api/equipment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_equipo, descripcion, numero_serie, estado } = req.body;

        const updateEquipment = await pool.query(
            'UPDATE Equipment SET nombre_equipo = $1, descripcion = $2, numero_serie = $3, estado = $4 WHERE equipo_id = $5 RETURNING *',
            [nombre_equipo, descripcion, numero_serie, estado, id]
        );

        if (updateEquipment.rows.length === 0) {
            return res.status(404).json({ msg: 'Equipment not found' });
        }

        res.json(updateEquipment.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a piece of equipment
app.delete('/api/equipment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteEquipment = await pool.query('DELETE FROM Equipment WHERE equipo_id = $1 RETURNING *', [id]);

        if (deleteEquipment.rows.length === 0) {
            return res.status(404).json({ msg: 'Equipment not found' });
        }

        res.json({ msg: 'Equipment deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Employee endpoints

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const allEmployees = await pool.query('SELECT * FROM Employees');
    res.json(allEmployees.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a single employee
app.get('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await pool.query('SELECT * FROM Employees WHERE empleado_id = $1', [id]);

    if (employee.rows.length === 0) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    res.json(employee.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new employee
app.post('/api/employees', async (req, res) => {
    try {
        const { nombre_empleado, cargo, departamento } = req.body;
        const newEmployee = await pool.query(
            'INSERT INTO Employees (nombre_empleado, cargo, departamento) VALUES ($1, $2, $3) RETURNING *',
            [nombre_empleado, cargo, departamento]
        );
        res.json(newEmployee.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update an employee
app.put('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_empleado, cargo, departamento } = req.body;

        const updateEmployee = await pool.query(
            'UPDATE Employees SET nombre_empleado = $1, cargo = $2, departamento = $3 WHERE empleado_id = $4 RETURNING *',
            [nombre_empleado, cargo, departamento, id]
        );

        if (updateEmployee.rows.length === 0) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        res.json(updateEmployee.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete an employee
app.delete('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteEmployee = await pool.query('DELETE FROM Employees WHERE empleado_id = $1 RETURNING *', [id]);

        if (deleteEmployee.rows.length === 0) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        res.json({ msg: 'Employee deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Assignment endpoints

// Get all assignments
app.get('/api/assignments', async (req, res) => {
    try {
        const allAssignments = await pool.query('SELECT * FROM Assignments');
        res.json(allAssignments.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get a single assignment
app.get('/api/assignments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const assignment = await pool.query('SELECT * FROM Assignments WHERE asignacion_id = $1', [id]);

        if (assignment.rows.length === 0) {
            return res.status(404).json({ msg: 'Assignment not found' });
        }

        res.json(assignment.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create a new assignment
app.post('/api/assignments', async (req, res) => {
    try {
        const { equipo_id, empleado_id, fecha_asignacion, fecha_devolucion } = req.body;
        const newAssignment = await pool.query(
            'INSERT INTO Assignments (equipo_id, empleado_id, fecha_asignacion, fecha_devolucion) VALUES ($1, $2, $3, $4) RETURNING *',
            [equipo_id, empleado_id, fecha_asignacion, fecha_devolucion]
        );
        // Also create a history event
        await pool.query(
            'INSERT INTO History (equipo_id, tipo_evento, fecha_evento, detalles_evento) VALUES ($1, $2, $3, $4)',
            [equipo_id, 'asignación', fecha_asignacion, `Asignado a empleado ID: ${empleado_id}`]
        );

        // Update equipment status
        await pool.query(
            'UPDATE Equipment SET estado = $1 WHERE equipo_id = $2',
            ['asignado', equipo_id]
        );

        res.json(newAssignment.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update an assignment (e.g., to add a return date)
app.put('/api/assignments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { equipo_id, empleado_id, fecha_asignacion, fecha_devolucion } = req.body;

        const updateAssignment = await pool.query(
            'UPDATE Assignments SET equipo_id = $1, empleado_id = $2, fecha_asignacion = $3, fecha_devolucion = $4 WHERE asignacion_id = $5 RETURNING *',
            [equipo_id, empleado_id, fecha_asignacion, fecha_devolucion, id]
        );

        if (updateAssignment.rows.length === 0) {
            return res.status(404).json({ msg: 'Assignment not found' });
        }

        // if fecha_devolucion is present, create a history event and update equipment status
        if(fecha_devolucion) {
            await pool.query(
                'INSERT INTO History (equipo_id, tipo_evento, fecha_evento, detalles_evento) VALUES ($1, $2, $3, $4)',
                [equipo_id, 'devolución', fecha_devolucion, `Devuelto por empleado ID: ${empleado_id}`]
            );

            await pool.query(
                'UPDATE Equipment SET estado = $1 WHERE equipo_id = $2',
                ['disponible', equipo_id]
            );
        }

        res.json(updateAssignment.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// History endpoints

// Get all history
app.get('/api/history', async (req, res) => {
    try {
        const allHistory = await pool.query('SELECT * FROM History');
        res.json(allHistory.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get history for a single piece of equipment
app.get('/api/history/:equipment_id', async (req, res) => {
    try {
        const { equipment_id } = req.params;
        const history = await pool.query('SELECT * FROM History WHERE equipo_id = $1 ORDER BY fecha_evento DESC', [equipment_id]);
        res.json(history.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Document endpoints

// Get all documents
app.get('/api/documents', async (req, res) => {
    try {
        const allDocuments = await pool.query('SELECT * FROM Documents');
        res.json(allDocuments.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get a single document
app.get('/api/documents/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const document = await pool.query('SELECT * FROM Documents WHERE documento_id = $1', [id]);

        if (document.rows.length === 0) {
            return res.status(404).json({ msg: 'Document not found' });
        }

        res.json(document.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create a new document
app.post('/api/documents', async (req, res) => {
    try {
        const { tipo_documento, fecha_generacion, contenido_documento, asignacion_id } = req.body;
        const newDocument = await pool.query(
            'INSERT INTO Documents (tipo_documento, fecha_generacion, contenido_documento, asignacion_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [tipo_documento, fecha_generacion, contenido_documento, asignacion_id]
        );
        res.json(newDocument.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
