const socket = io();

 // Handle 'newComment' event
 socket.on('message', message => {
    // Handle the new comment event
    // You can update the UI, show notifications, etc.
    console.log(message);
  });

  // handle login
  // socket.on('login', userId => {
  //   // Handle the login event
  //   // You can update the UI, show notifications, etc.
  //   console.log(userId);
  // });


  // Handle 'notification' event
  socket.on('notification', ({ notification, link }) => {
    // Handle the notification event
    // You can update the UI, show notifications, etc.
    console.log(notification, link);
  }
  );
  