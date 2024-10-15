const express = require('express');
const router = express.Router();
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

const API_KEY = 'DEMO_KEY'; 

const db = new sqlite3.Database('./favorites.db');

db.run(`
  CREATE TABLE IF NOT EXISTS favorites (
    id TEXT PRIMARY KEY,
    name TEXT,
    details TEXT
  )
`);

router.get('/favorites', (req, res) => {
  db.all('SELECT * FROM favorites', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching favorites.' });
    } else {
      res.json(rows);
    }
  });
});


router.post('/favorites', (req, res) => {
  const { id, name, details } = req.body;

  db.run(
    `INSERT INTO favorites (id, name, details) VALUES (?, ?, ?)`,
    [id, name, details],
    (err) => {
      if (err) {
        res.status(500).json({ error: 'Error adding to favorites.' });
      } else {
        res.status(201).json({ message: 'Asteroid added to favorites.' });
      }
    }
  );
});


router.delete('/favorites/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM favorites WHERE id = ?`, [id], (err) => {
    if (err) {
      res.status(500).json({ error: 'Error removing favorite.' });
    } else {
      res.json({ message: 'Asteroid removed from favorites.' });
    }
  });
});

router.get('/', async (req, res) => {
    const { endpoint, ...params } = req.query; 
  
    try {
      const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/${endpoint}`, {
        params: {
          ...params, 
          api_key: API_KEY, 
        },
      });
      res.json(response.data); 
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data via proxy.' });
    }
  });


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/${id}`, {
      params: {
        api_key: API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching asteroid data.' });
  }
});

module.exports = router;
