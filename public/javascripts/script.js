/**
 * Created by Sych on 26.04.2016.
 */
$('document').ready( function () {
  document.getElementById('chat-area').scrollTop = 9999;
});
var socket = io();

$('#msg-post-form').submit(function () {
  socket.emit('chat message', $('#m').val(), $('#username').text());
  $('#m').val('');
  document.getElementById('chat-area').scrollTop = 9999;
  return false;
});


socket.on('chat message', function (msg, username) {
  $('#messages').append($('<li>').text(username + ": " + msg));
  document.getElementById('chat-area').scrollTop = 9999;
});


//user types...
var count1 = 0, count2 = 0;
var isTyping = true;
$('#m').on('input', function (e) {
  count1++;
  socket.emit('typing',$('#username').text(), isTyping);
  isTyping = false;
  setTimeout(
    function () {
      count2++;
      if (count1 === count2) {
        console.log('end type');
        count1 = 0;
        count2 = 0;
        socket.emit('stop typing', $('#username').text());
      }
    }, 500);
});

socket.on('user types', function (username, isTyping) {
  if(isTyping) {
    $('#who-types').append($('<li class="username" data-typer="' + username +'">').text(username + " types... "));
    isTyping = false;
  }
});

socket.on('stop typing', function (username) {
  var str = `${username} types... `;
  $("li[data-typer='"+ username + "']").remove();
  isTyping = true;
});

socket.on('online counter up', function (onlineCounter) {
  $('#curr-online').text(onlineCounter);
});

socket.on('online counter down', function (onlineCounter) {
  $('#curr-online').text(onlineCounter);
});