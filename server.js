const socketIO = require('socket.io')
const express = require('express')
var bodypasser = require('body-parser');
const PORT = process.env.PORT || 3000

const app = express()
app.use(bodypasser.json());
app.use(bodypasser.urlencoded({ extended: true }));
const server = app.listen(PORT, () => {
  console.log('SERVER LISTENING ON PORT http://localhost:3000')
})
// const io = socketIO(server)

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header", "user"],
    credentials: true
  }
});

app.post('/new_message', function (req, res) {
  data = req.body;
  console.log(data)
  io.to(data.to_id).emit('send_new_message', data);
  res.send("done");
})


io.on('connection', (socket) => {
  var conn_data = socket.handshake.query;
  io.emit(
    'new_user_join',
    {
      'user': conn_data.loggeduser
    }
  );
  socket.username = conn_data.loggeduser;
  socket.join(conn_data.loggeduser);

  console.log(conn_data.loggeduser + ':join');


  socket.on('new_message', function(data) {
      io.to(data.to_id).emit('send_new_message', data);
  });
});

function availablerooms() {
  var availableRooms = [];
  var rooms = io.sockets.adapter.rooms;
  if (rooms) {
    for (var room in rooms) {
      if (!rooms[room].hasOwnProperty(room)) {
        availableRooms.push(room);
      }
    }
  }
  return availableRooms;
}
