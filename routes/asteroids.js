const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../database');
const cors = require('cors');

const API_KEY = 'DEMO_KEY'; 

// Enable CORS for all routes in this router
router.use(cors());

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
  const { asteroid_id } = req.body;

  try {
    db.run(
      `INSERT INTO favorites (asteroid_id) VALUES (?)`,
      [asteroid_id],
      (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: 'Error adding to favorites.' });
        } else {
          res.status(201).json({ message: 'Asteroid added to favorites.' });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Error adding to favorites.' });
  }
});


router.delete('/favorites/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM favorites WHERE asteroid_id = ?`, [id], (err) => {
    if (err) {
      res.status(500).json({ error: 'Error removing favorite.' });
    } else {
      res.json({ message: 'Asteroid removed from favorites.' });
    }
  });
});

router.get('/', async (req, res) => {
    const { endpoint = 'feed', ...params } = req.query; 

    try {
      const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/${endpoint}`, {
        params: {
          ...params, 
          api_key: API_KEY, 
        },
      });
      res.json(response.data); 
    } catch (error) {
      console.log(error);
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
