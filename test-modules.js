console.log('Testing module loading...');
try {
    const express = require('express');
    console.log('✓ Express loaded successfully');
    const cors = require('cors');
    console.log('✓ CORS loaded successfully');
    const pg = require('pg');
    console.log('✓ PG loaded successfully');
    console.log('\nAll modules loaded successfully!');
} catch (err) {
    console.error('Error loading modules:', err.message);
    console.error('Full error:', err);
}
