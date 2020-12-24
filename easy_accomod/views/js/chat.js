$(function () {
  let socket = io();
  let chatInput = $('#chat-input');
  function cookie(name) {
    let cookies = document.cookie.split(';');
    let index = cookies.findIndex(value => value.indexOf(name + '=') !== -1);
    if(index === -1)
        return null;
    else
        return cookies[index].split('=')[1];
  }

  $(document).on('click', '.enter-name [data-name]', function() {
      switch (this.dataset.name) {
        case 'request-chat':
          let formData = new FormData();
          formData.append('io', cookie(io));
          formData.append('content', 'request-chat');
          axios({
            method: 'post',
            url: 'http://localhost:6660/chat',
            data: formData
          }).then(res => {
            console.log(res.data);
          }).catch(err => {
            console.log(err);
            if(err.response)
                alert(JSON.stringify(err.response.data,null,4));
            else
                alert(err);
          })
          break;
        case "reply":
          let formData = new FormData();
          formData.append('io', cookie(io));
          formData.append('content', "reply");
          axios({
            method: 'post',
            url: 'http://localhost:6660/chat',
            data: formData
          }).then(res => {
            console.log(res.data);
          }).catch(err => {
            console.log(err);
            if(err.response)
                alert(JSON.stringify(err.response.data,null,4));
            else
                alert(err);
          })
          break;
        default:
          break;
      }
  })


  // handle keyboard enter button being pressed
  chatInput.keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();

      // ensure message not empty
      if (chatInput.val() !== '') {
        let formData = new FormData();
        formData.append('msg', chatInput.val());
        formData.append('chatIo', chatInput.val());
        axios({
          method: 'post',
          url: 'http://localhost:6660/chat',
          data: formData
        }).then(res => {
          // socket.emit('new:message', {name: name, msg: chatInput.val()});
          chatInput.val('');
        }).catch(err => {
          console.log(err);
          if(err.response)
              alert(JSON.stringify(err.response.data,null,4));
          else
              alert(err);
        })
        
        
      }
    }
  });

  // handle submit chat message button being clicked
  $('.submit-chat-message').on('click', function(event) {
    event.preventDefault();

    // ensure message not empty
    if (chatInput.val() !== '') {
      let formData = new FormData();
      formData.append('msg', chatInput.val());
      axios({
        method: 'post',
        url: 'http://localhost:6660/chat',
        data: formData
      }).then(res => {
        // socket.emit('new:message', {name: name, msg: chatInput.val()});
        chatInput.val('');
      }).catch(err => {
        console.log(err);
        if(err.response)
            alert(JSON.stringify(err.response.data,null,4));
        else
            alert(err);
      })
      
    }
  });

  // handle receiving new messages
  socket.on('new:message', function(msgObject){
    $('#messages').append($('<div class="msg new-chat-message">').html('<span class="member-name">' + msgObject.name + '</span>: ' + msgObject.msg));
    $('.chat-window').scrollTop($('#messages').height());
  });

  // handle members joining
  socket.on('new:member', function(name){
    $('#messages').append($('<div class="msg new-member">').text(name + ' has joined the room'));
    $('.chat-window').scrollTop($('#messages').height());
  });
});
