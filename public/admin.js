

$(function () {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // initialise les variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // barre d'input message

  var $loginPage = $('.login.page'); // page de login
  var $chatPage = $('.chat.page'); // chat room
  var $load = $('.load'); // conversation à charger
  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  var socket = io();



  function addParticipantsMessage(data) {
    var message = '';
    if (data.numUsers === 1) {
      message += " (1) utilisateur(s) actif";
    } else {
      message += " " + data.numUsers + " utilisateur(s)";
    }
    log(message);
  }

  // entre un nom d'utilisateur
  function setUsername() {
    username = cleanInput($usernameInput.val().trim());

    // si le user est valide
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      
      socket.emit('add user', username);

      socket.on('newusr', function (username) {
        $('.users').append('<li id= "numUsers">' + username + '</li>');
      });
    }
  }



  // Envoyer un message
  function sendMessage() {
    var message = $inputMessage.val();
    // prevenir contre les injections de code
    message = cleanInput(message);
    
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
      
      socket.emit('new message', message);
      
    }
  }

 
  // afficher un message
  function log(message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);

  }

  // ajouter les messages à la liste
  function addChatMessage(data, options) {
    
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .addClass(typingClass)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
  }

  // message qui dit que l'utilisateur est entrain d'écrire
  function addChatTyping(data) {
    data.typing = true;
    data.message = 'Est entrain d ecrire';
    addChatMessage(data);
  }

  // Suprimme le message quand l'utilisateur n'écrit plus
  function removeChatTyping(data) {
    getTypingMessages(data).fadeOut(function () {
      $(this).remove();
    });
  }

  
  function addMessageElement(el, options) {
    var $el = $(el);

    
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

  
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }


  function cleanInput(input) {
    return $('<div/>').text(input).html();
  }


  function updateTyping() {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is typing' messages of a user
  function getTypingMessages(data) {
    return $('.typing.message').filter(function (i) {
      return $(this).data('username') === data.username;
    });
  }

  // donner une couleur a un utilisateur grace a la fonction suivante
  function getUsernameColor(username) {
    
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // calcule la couleur à donner
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // evenement clavier

  $window.keydown(function (event) {
    
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // quand l'utilisateur tape entrée
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  $inputMessage.on('input', function () {
    updateTyping();
  });

  
  // clique sur la page de login pour rentrer le username
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // clique sur la barre d'input pour taper un message
  $inputMessage.click(function () {
    $inputMessage.focus();
  });




  // connexion d'un nouvelle utilisateur
  socket.on('login', function (data) {
    connected = true;
    // message d'accueil
    var message = "Chat App ";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });

  // nouveau message
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

  // Ajout d'un nouvelle user
  socket.on('user joined', function (data) {
    log(data.username + ' Rejoint le chat');
    addParticipantsMessage(data);
  });

  // deconnexion d'un user
  socket.on('user left', function (data) {
    log(data.username + ' à quitter le chat');
    addParticipantsMessage(data);
    removeChatTyping(data);
    
        
  });
  
  
  // montre le message qui dit que l'utilisateur écrit
  socket.on('typing', function (data) {
    addChatTyping(data);
  });

  // enléve le message quand l'utilisateur arréte de taper
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });

  socket.on('disconnect', function () {
    log(username + ' Vous avez été déconnecté');
    
    socket.on('disuser', function(username){
      var list = document.getElementById("numUsers");
      list.remove();
    })
 
 });

 

  socket.on('reconnect', function () {
    log(username + ' Vous avez été reconnecté');
    if (username) {
      socket.emit('add user', username);
    }
  });

  socket.on('reconnect_error', function () {
    log('tentative de reconnexion');
  });

});

