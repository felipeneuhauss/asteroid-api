const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../database');
const cors = require('cors');

const API_KEY = 'DEMO_KEY'; 


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


router.post('/favorites', async (req, res) => {
  const { asteroid_id } = req.body;

  try {
  
    const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/${asteroid_id}`, {
      params: { api_key: API_KEY },
    });

    if (response.status === 200) {
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
    } else {
      res.status(422).json({ error: 'Invalid asteroid ID.' });
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(422).json({ error: 'Asteroid not found.' });
    } else {
      res.status(500).json({ error: 'Error adding to favorites.' });
    }
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
  const { endpoint = 'feed', start_date, end_date, ...params } = req.query; 

  
  if (start_date && end_date) {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      return res.status(422).json({ error: 'Date range must not exceed 7 days.' });
    }
  }

  try {
    const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/${endpoint}`, {
      params: {
        ...params,
        start_date,
        end_date,
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
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'Asteroid not found.' });
    } else {
      console.error('Error fetching asteroid data:', error.message);
      res.status(500).json({ error: 'Error fetching asteroid data.' });
    }
  }
});

module.exports = router;
