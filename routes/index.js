//modified for socketio
var mongo = require('mongodb').MongoClient;
var uri = 'mongodb://localhost:27017/chat';

module.exports = function (io) {
  var app = require('express');
  var router = app.Router();

  router.get('/', function (req, res, next) {
    if (!req.session.username) {
      res.redirect('/reg');
    } else {
      res.redirect('/chat');
    }

  });

  router.get('/reg', function (req, res, next) {
    res.render('reg', {title: 'Reg'});
  });

  router.post('/reg', function (req, res, next) {
    req.session.username = req.param('name');
    res.redirect('/chat');
  });

  router.get('/chat', function (req, res, next) {
    if (!req.session.username) {
      res.redirect('/reg');
    } else {
      //send last 50 to client
      mongo.connect(uri, function (err, db) {
        var cursor = db.collection('chatMsgs').find({},{_id:0}, {limit: 50}).toArray(function (err, docs) {
          res.render('index', {title: 'Chat', user: req.session.username, msgs: docs});
        })
      });


    }

  });
  var onlineCounter = 0;
  io.on('connection', function (socket,username) {
    onlineCounter++;
    io.emit('online counter up', onlineCounter);
    console.log('online is:' + onlineCounter);

    socket.on('chat message', function (msg, usrname) {
      io.emit('chat message', msg, usrname);

      mongo.connect(uri, function (err, db) {
        var collection = db.collection('chatMsgs');
        collection.insert({username: usrname, message: msg}, function (err, o) {
          if (err) {
            console.warn(err.message);
          }
        });
      });
    });

    socket.on('typing', function (usrname, isTyping) {
      io.emit('user types', usrname, isTyping);
    });

    socket.on('stop typing', function (usrname, isTyping) {
      io.emit('stop typing', usrname);
    })


    socket.on('disconnect', function () {
      onlineCounter--;
      io.emit('online counter down', onlineCounter);
    });
  });

  return router;
}