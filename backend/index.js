const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app);
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');


mongoose.connect('mongodb://localhost:27017/sample', (err) => {
  if (!err) {
    console.log('connected to db');
  } else {
    console.log(err);
  }
});

const socketIO = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', require('./routes/user.routes'));


socketIO.on('connection', (socket) => {
  console.log(`${socket.id} is connected`);
  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
  });
});


server.listen(3001, () => {
  console.log('Server running at port 3001');
});