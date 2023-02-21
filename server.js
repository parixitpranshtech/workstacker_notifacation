const express = require('express')
var bodypasser = require('body-parser');
const https = require("https")
const path = require("path")
const fs = require("fs")


// const cert = fs.readFileSync('./*_textdrip_com.crt');
// const ca = fs.readFileSync('./*_textdrip_com.ca-bundle');
// const key = fs.readFileSync('./*_textdrip_com.key'); 



// const server = https.createServer({
// 	key: key, 
//     cert: cert,
// 	ca:ca 
// }, app); 
 
const app = express()
app.use(bodypasser.json());
app.use(bodypasser.urlencoded({ extended: true }));

const port = 3000;

// const server = https.createServer({
//   	key: key, 
//     cert: cert,
//   	ca:ca
//   }, app);


const options ={
  key:fs.readFileSync(path.join(__dirname,'./cert/key.pem')),
  cert:fs.readFileSync(path.join(__dirname,'./cert/cert.pem')) 
}

const server =https.createServer(options,app).listen(port,()=>{console.log(`Secure Server is listening at https://146.190.162.253:${port}`)});

io = require('socket.io')(server, {
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
 
  console.log(data);
  io.to(data.to_id).emit('send_new_message', data);
  res.send("done");
})

app.post('/test', function (req, res) {
  console.log('data')
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


  socket.on('new_message', function (data) {
    console.log('new_message');
    io.to(data.to_id).emit('send_new_message', data);
  });
});


// server.listen(port, () => {
//   console.log(`Server running at https://146.190.162.253:${port}/`);
// });

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
