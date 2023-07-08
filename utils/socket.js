const socketio = require('socket.io');

let io; // Declare a variable to hold the socket.io instance

function initializeSocket(server) {
  io = socketio(server);

  io.on('connection', (socket) => {
    console.log('New socket connection');

  socket.emit('message', 'Welcome to ReadIdea')
  }); 
}

// function handleLogin(socket, userId) {
//   const room = 'user_' + userId;
//   socket.join(userId);

//   console.log('User joined room: ' + room);
// }



function emitNotification (userId, notification ) {
  // io.to(userId).emit('notification', notification);
  // emit to all connected clients
  // io.sockets.emit('notification', notification);
  // emit to a specific room/user
  const emitt = io.to(userId)
  emitt.emit('notification', notification);
  // io.emit('notification', notification);
}


module.exports = { initializeSocket,
                   emitNotification,
                  // handleLogin  
                };
