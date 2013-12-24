function Board(){
  var b = this;
  b.board = new Array(20);
  for(var i = 0; i < 20; i++) {
    b.board[i] = new Array(20);
  }

  for(var i = 0; i < 20; i++){
    for(var j = 0; j < 20; j++){
      //0 means open, anything else is a player_id (1,2,3,4)
      b.board[i][j] = 0;
    }
  }

  b.checkOutOfBounds = function(piece, coordinates){

  }

  b.checkValid = function(piece, coordinates){

  }

  b.checkValidFirstMove = function(piece, coordinates){

  }

}
