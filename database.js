const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./favorites.db');

db.run(`
  CREATE TABLE IF NOT EXISTS favorites (
    asteroid_id TEXT PRIMARY KEY
  )
`);

module.exports = db;
