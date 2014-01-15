
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var id = 0;
var games = [{players: [], current_turn: 0, board: []}];

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon("public/images/favicon.ico"));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

io.sockets.on('connection', function (socket) {
  var user_id = id++;
  socket.set('id', user_id,function(){
    //If the last game is full, start a new one
    if(games[games.length - 1].players.length == 4){
      game.push({players: [user_id], current_turn: 0, board: []})
    }else{
      games[games.length - 1].players.push(user_id);
    }
    socket.emit('logged in', {id: user_id, player: games[games.length -1].players.length-1})
  });
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
