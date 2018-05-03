var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;


var mysql = require('mysql');


var connection = mysql.createConnection({ // connexion sql
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'chat_db'
});


connection.on('error', function (err) {
  console.log("[mysql error]", err);
});


//port d'écoute du server
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

//Routing
app.use(express.static(path.join(__dirname, 'public/')));


// Chatroom

var numUsers = 0;
var users = [];

io.on('connection', function (socket) {

  var addedUser = false;
  

  for (var k in users) {
    socket.emit('newusr', users[k]);
  }

 
  // quand un nouveau message est émit
  socket.on('new message', function (data) {
    
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
      
    });

    // Insert des messages et noms d'utilisateur dans la base afin de pouvoir récupere les historiques de conversation
    connection.query('INSERT INTO users SET ?', { 'messages': data, 'username': socket.username }, function (error, results, fields) {
      if (error) throw error;
      console.log('Last insertId:' + results.insertId);
    });
   
    connection.query('SELECT * FROM users', function(err, rows, fields) {
      if (err) throw err;
        for (var i = 0; i < rows.length; i++) {
          result = rows; //je stock le résultat dans une variable
        };
        
        io.sockets.emit('loading message', rows);
    });

   
   
  });

 
  // quand un nouvelle utlisateur arrive
  socket.on('add user', function (username) {

    if (addedUser);
  
    
    
    console.log('user connected');

    //le nom d'utilisateur est enregistré dans la socket
    socket.username = username;
    ++numUsers;
    console.log(numUsers);
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });

    // On retourne a l'admin que un nouveau user est connecté
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers

    });

    users[socket.username]= numUsers;
    io.sockets.emit('newusr', username);
    console.log(users);


  });

  // commence à écrire
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // arrête d'écrire
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // deconnexion d'un user
  socket.on('disconnect', function (username) {
    if (addedUser) {
      --numUsers;
      
      
       
      console.log('user disconnected');
      console.log(numUsers); 


      // transfert le message a que le user est parti
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers

      });

      delete users[socket.username];
      io.sockets.emit('disuser', username);
      console.log(users);

    }
    
   

  });
});



