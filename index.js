require('dotenv').config();
const express = require('express'); //loads express library
const app = express(); //runs express
const port = 3005;  //select port

const ModelClass = require('./model.js');
const Model = new ModelClass();

app.use(express.static(__dirname + '/public/'))

app.use(express.json());

app.get('/stores', async (req, res) => { //app.get creates a new get block
  const stores = await Model.getStores(); //load from json file
  res.json(stores); //sends to json file?
});

app.get('/store', async (req, res) => {
  const {
    storeid
  } = req.query;
  const stores = await Model.getStoreByID(storeid);
  res.json(stores);
});

app.post('/store', async (req, res) => {
  const { name, url, district } = req.body;
  try {
      await Model.addStore(name, url, district);
      console.log('New store added:', name);
      res.sendStatus(200);
  } catch (error) {
      console.error('Error adding new store:', error);
      res.sendStatus(500);
  }
});

const server = async () => {
  await Model.connectDatabase();
  await Model.setupDatabase();

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};

server();
