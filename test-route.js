
const express = require('express');
const router = express.Router();
const db = require('./db');
const fs = require('fs');
const path = require('path');

router.get('/equipment/hoja-de-vida/:serviceTag', async (req, res) => {
    const { serviceTag } = req.params;
    const query = 'SELECT ruta_archivo FROM mantenimientos WHERE service_tag_cpu = $1';

    try {
        const result = await db.query(query, [serviceTag]);

        if (result.rows.length === 0) {
            return res.status(404).send('No database entry found for the given service tag.');
        }

        const dbPath = result.rows[0].ruta_archivo;

        if (!dbPath || !fs.existsSync(dbPath) || !fs.statSync(dbPath).isDirectory()) {
            return res.status(404).send(`Path from database is not a valid directory: ${dbPath}`);
        }

        const files = fs.readdirSync(dbPath);
        const hojaDeVidaFile = files.find(file =>
            file.toUpperCase().includes('HOJA DE VIDA') &&
            (file.toLowerCase().endsWith('.xlsx') || file.toLowerCase().endsWith('.xls'))
        );

        if (!hojaDeVidaFile) {
            return res.status(404).send(`"Hoja de Vida" Excel file not found in directory: ${dbPath}`);
        }

        const filePath = path.join(dbPath, hojaDeVidaFile);

        const ext = path.extname(filePath).toLowerCase();
        let contentType = 'application/octet-stream';
        if (ext === '.xlsx') {
            contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        } else if (ext === '.xls') {
            contentType = 'application/vnd.ms-excel';
        }

        res.setHeader('Content-Type', contentType);

        // FIX: Instead of streaming, read the file into a buffer and send it at once.
        // This can help with tricky browser caching and content handling issues.
        const fileBuffer = fs.readFileSync(filePath);
        res.send(fileBuffer);

    } catch (err) {
        console.error('Error in hoja-de-vida endpoint:', err);
        if (!res.headersSent) {
            res.status(500).send('Server error while processing the request.');
        }
    }
});

module.exports = router;
