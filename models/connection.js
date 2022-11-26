const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://Tanvir:Kidiz1417@cluster0.mlimulv.mongodb.net/hackatweet';

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));
