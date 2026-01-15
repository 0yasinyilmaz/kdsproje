const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Frontend Routes (Static Files)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// SVG Routes
app.get('/turkiye.svg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'turkiye.svg'));
});

app.get('/analiz.svg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'analiz.svg'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});