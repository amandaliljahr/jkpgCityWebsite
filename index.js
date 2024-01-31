const express = require('express'); //loads express library
const app = express(); //runs express
const port = 3000;  //select port

const ModelClass = require('./model.js');
const Model = new ModelClass();

app.get('/', async (req, res) => { //app.get creates a new get block
  const stores = await Model.getStores(); //load from json file
  res.json(stores); //sends to json file?
});

const server = async () => {
  await Model.connectDatabase();
  await Model.setupDatabase();

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};

server();




