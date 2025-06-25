const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const dbFile = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database
const init = () => {
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS plants (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, group_id INTEGER, water_frequency INTEGER, fertilizer_frequency INTEGER, FOREIGN KEY(group_id) REFERENCES groups(id))');
    db.run('CREATE TABLE IF NOT EXISTS waterings (id INTEGER PRIMARY KEY AUTOINCREMENT, plant_id INTEGER, date TEXT, FOREIGN KEY(plant_id) REFERENCES plants(id))');
    db.run('CREATE TABLE IF NOT EXISTS fertilizations (id INTEGER PRIMARY KEY AUTOINCREMENT, plant_id INTEGER, date TEXT, FOREIGN KEY(plant_id) REFERENCES plants(id))');
  });
};

// Groups
app.get('/api/groups', (req, res) => {
  db.all('SELECT * FROM groups', (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.post('/api/groups', (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO groups (name) VALUES (?)', [name], function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({ id: this.lastID });
  });
});

// Plants
app.get('/api/plants', (req, res) => {
  db.all('SELECT * FROM plants', (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.post('/api/plants', (req, res) => {
  const { name, group_id, water_frequency, fertilizer_frequency } = req.body;
  db.run('INSERT INTO plants (name, group_id, water_frequency, fertilizer_frequency) VALUES (?,?,?,?)', [name, group_id, water_frequency, fertilizer_frequency], function(err){
    if (err) return res.status(500).json({error: err.message});
    res.json({ id: this.lastID });
  });
});

// Waterings
app.get('/api/waterings', (req, res) => {
  db.all('SELECT * FROM waterings', (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.post('/api/waterings', (req, res) => {
  const { plant_id, date } = req.body;
  db.run('INSERT INTO waterings (plant_id, date) VALUES (?,?)', [plant_id, date], function(err){
    if (err) return res.status(500).json({error: err.message});
    res.json({ id: this.lastID });
  });
});

// Fertilizations
app.get('/api/fertilizations', (req, res) => {
  db.all('SELECT * FROM fertilizations', (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.post('/api/fertilizations', (req, res) => {
  const { plant_id, date } = req.body;
  db.run('INSERT INTO fertilizations (plant_id, date) VALUES (?,?)', [plant_id, date], function(err){
    if (err) return res.status(500).json({error: err.message});
    res.json({ id: this.lastID });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  init();
  console.log(`Server listening on port ${PORT}`);
});
