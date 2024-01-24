const express = require('express');
const app = express();
const port = 3000;

const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '12345',
  port: '5432'
});

app.get('/', async (req, res) => {
  const data = await pool.query('SELECT * FROM stores');

  res.send('Hello, World!');
});

const setupServer = async () => {

  app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  });

}

setupServer();




