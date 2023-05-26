require('dotenv').config();

const express = require('express');
const app = express();
const port = 3002;
const mysql = require('mysql');

app.use(express.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((err) => {
    if (err) {
        console.error('Koneksi ke database gagal: ' + err.stack);
        return;
    }
    console.log('Terhubung ke database dengan ID ' + connection.threadId);
});

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

// GET DATA SENSOR
app.get('/api/sensor-data', (req, res) => {
    connection.query('SELECT * FROM sensor_data', (error, results) => {
        if (error) {
            console.error('Error mengambil data: ' + error.stack);
            return res.status(500).json({ error: 'Error mengambil data' });
        }
        res.json(results);
    });
});

// POST DATA SENSOR
app.post('/api/sensor-data', (req, res) => {
    const { ph_val, humidity_val } = req.body;
  
    if (!ph_val || !humidity_val) {
      return res.status(400).json({ error: 'Data tidak lengkap' });
    }
  
    const query = 'INSERT INTO sensor_data (ph_val, humidity_val) VALUES (?, ?)';
    connection.query(query, [ph_val, humidity_val], (error, results) => {
      if (error) {
        console.error('Error menyimpan data: ' + error.stack);
        return res.status(500).json({ error: 'Error menyimpan data' });
      }
  
      res.json({ message: 'Data berhasil disimpan' });
    });
  });
  

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
