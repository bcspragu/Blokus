var paper;
var block_size;

var avail_pieces = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
var player_start_points = [
  {x: 0, y:0},
  {x: 19, y: 0},
  {x: 19, y: 19},
  {x: 0, y: 19}
];

var current_piece;
var current_piece_index = 20;
var pointer = {x: 10, y: 10};
var pointer_piece;
var player_id;
var user_id;

//The pieces are stored as an array of x,y coordinates
var pieces = [
  [], //One piece
  [{x: 0, y: 1}], //Two piece
  [{x: 0, y: 1},{x: 0, y: -1}], //Three pieces
  [{x: 1, y: 0},{x: 0, y: 1}],
  [{x: 0, y: 1},{x: 1, y: 0},{x: 1, y: 1}], //Four pieces
  [{x: -1, y: 0},{x: 1, y: 0},{x: 0, y: 1}],
  [{x: -1, y: 0},{x: 1, y: 0},{x: 2, y: 0}],
  [{x: -1, y: 0},{x: 1, y: 0},{x: 1, y: 1}],
  [{x: -1, y: 0},{x: 0, y: -1},{x: -1, y: 1}],
  [{x: -1, y: 0},{x: -1, y: -1},{x: 1, y: 0},{x: 2, y: 0}], //Five pieces
  [{x: 0, y: -1},{x: 0, y: 1},{x: -1, y: 1},{x: 1, y: 1}],
  [{x: 0, y: -1},{x: 0, y: -2},{x: 1, y: 0},{x: 2, y: 0}],
  [{x: 0, y: 1},{x: -1, y: 1},{x: 1, y: 0},{x: 2, y: 0}],
  [{x: -1, y: 0},{x: -1, y: 1},{x: 1, y: 0},{x: 1, y: -1}],
  [{x: 0, y: 1},{x: 0, y: 2},{x: 0, y: -1},{x: 0, y: -2}],
  [{x: 0, y: 1},{x: 1, y: 0},{x: 1, y: 1},{x: 0, y: -1}],
  [{x: 0, y: -1},{x: 1, y: -1},{x: -1, y: 0},{x: -1, y: 1}],
  [{x: 0, y: -1},{x: 1, y: -1},{x: 0, y: 1},{x: 1, y: 1}],
  [{x: -1, y: 0},{x: 0, y: -1},{x: 0, y: 1},{x: 1, y: -1}],
  [{x: -1, y: 0},{x: 0, y: -1},{x: 0, y: 1},{x: 1, y: 0}],
  [{x: -1, y: 0},{x: 1, y: 0},{x: 2, y: 0},{x: 0, y: -1}]
];

$(function(){
  var socket = io.connect('http://localhost');
  var width = $('body').height();
  width -= 20;
  $('body').height(width);
  block_size = width/20;
  $('#board').css({'margin-top': '10px'}).width(width).height(width);
  paper =  Raphael("board", width, width);

  //32 - space
  //37 - left
  //38 - up
  //39 - right
  //40 - down
  //90 - z
  //88 - x
  //77 - m
  //78 - n
  $(document).keydown(function(e){
      var offset = {x: 0, y: 0};
      switch(e.which){
        case 37:
          offset.x = -1;
          break;
        case 39:
          offset.x = 1;
          break;
        case 38:
          offset.y = -1;
          break;
        case 40:
          offset.y = 1;
          break;
        case 86:
          current_piece.flipVertical();
          break;
        case 72:
          current_piece.flipHorizontal();
          break;
        case 32:
          var index = avail_pieces.indexOf(current_piece_index);

          if (index > -1) {
            //Make that not an available piece
            avail_pieces.splice(index, 1);
            if(avail_pieces.length > 0){
              current_piece_index = avail_pieces[(index+1) % avail_pieces.length];
              current_piece = new Piece(pieces[current_piece_index],pointer,paper);
              pointer_piece.blocks[0].toFront();
            }else{
              current_piece = undefined;
            }
          }
          break;
        case 90:
          current_piece.rotateLeft();
          break;
        case 88:
          current_piece.rotateRight();
          break;
        case 77:
          select_piece(1);
          break;
        case 78:
          select_piece(-1);
          break;
      }
      if(offset.x != 0 || offset.y != 0){
        pointer.x += offset.x;
        pointer.y += offset.y;
        current_piece.moveRelative(offset);
        pointer_piece.moveRelative(offset);
      }
    });
  
  //Draw the grid
  for(var i = 0; i < 20; i++){
    for(var j = 0; j < 20; j++){
      paper.rect(i*block_size,j*block_size,block_size,block_size).attr({stroke: '#000', 'stroke-width':1});
    }
  }
  var index = 0;
  current_piece = new Piece(pieces[current_piece_index],pointer,paper);
  pointer_piece = new Piece([],pointer,paper);
  pointer_piece.blocks[0].attr({fill: '#00f'}).toFront();

  var select_piece = function(direction){
    current_piece.deletePiece();
    current_piece_index = (current_piece_index+direction) % avail_pieces.length
    if(current_piece_index < 0){
      current_piece_index += avail_pieces.length;
    }
    current_piece_index = avail_pieces[current_piece_index % avail_pieces.length];
    current_piece = new Piece(pieces[current_piece_index],pointer,paper);
    pointer_piece.blocks[0].toFront();
  }

  socket.on('logged in',function(data){
    player_id = data.player;
    user_id = data.id;
  });
});

function Piece(piece_array,coor,paper,board) {
  var p = this;
  p.blocks = [];
  p.placed = false;

  $('#board').mousemove(p.mousemove);

  p.drawBlock = function(coordinates){
    var block = paper.rect((coor.x+coordinates.x)*block_size,(coor.y+coordinates.y)*block_size,block_size,block_size).attr({fill: '#0f0'});
    block.data('x',coor.x+coordinates.x);
    block.data('y',coor.y+coordinates.y);
    p.blocks.push(block);
  }

  p.moveRelative = function(coordinates){
    var center = {x: p.blocks[0].data('x'), y: p.blocks[0].data('y')};
    var offset = {x: 0, y: 0};
    for(var i = 0; i < p.blocks.length; i++){
      if(i != 0){
        offset = piece_array[i-1];
      }
      p.blocks[i].attr({x: (center.x+offset.x+coordinates.x)*block_size, y: (center.y+offset.y+coordinates.y)*block_size});
      p.blocks[i].data('x',center.x+offset.x+coordinates.x);
      p.blocks[i].data('y',center.y+offset.y+coordinates.y);
    }
  }

  p.moveAbsolute = function(coordinates){
    var offset = {x: 0, y: 0};
    for(var i = 0; i < p.blocks.length; i++){
      if(i != 0){
        offset = piece_array[i-1];
      }
      p.blocks[i].attr({x: (coordinates.x+offset.x)*block_size, y: (coordinates.y+offset.y)*block_size});
      p.blocks[i].data('x',(coordinates.x+offset.x));
      p.blocks[i].data('y',(coordinates.y+offset.y));
    }
  }

  p.update = function(){
    var center = {x: p.blocks[0].data('x'), y: p.blocks[0].data('y')};
    var offset = {x: 0, y: 0};
    for(var i = 0; i < p.blocks.length; i++){
      if(i != 0){
        offset = piece_array[i-1];
      }
      p.blocks[i].attr({x: (center.x+offset.x)*block_size, y: (center.y+offset.y)*block_size});
    }
  }

  p.deletePiece = function(){
    if(!p.placed){
      for(var i = 0; i < p.blocks.length; i++){
        p.blocks[i].remove();
      }
    }
    $('#board').off('mousemove');
  }

  p.rotateRight = function(){
    for(var i = 0; i < piece_array.length; i++){
      var temp_x = piece_array[i].x;
      piece_array[i].x = piece_array[i].y*-1;
      piece_array[i].y = temp_x;
    }
    p.update();
  }

  p.rotateLeft = function(){
    for(var i = 0; i < piece_array.length; i++){
      var temp_x = piece_array[i].x;
      piece_array[i].x = piece_array[i].y;
      piece_array[i].y = temp_x*-1;
    }
    p.update();
  }

  p.flipHorizontal = function(){
    for(var i = 0; i < piece_array.length; i++){
      piece_array[i].x = piece_array[i].x*-1;
    }
    p.update();
  }

  p.flipVertical = function(){
    for(var i = 0; i < piece_array.length; i++){
      piece_array[i].y = piece_array[i].y*-1;
    }
    p.update();
  }

  p.drawBlock({x: 0, y: 0});
  for(var i = 0; i < piece_array.length; i++){
    p.drawBlock(piece_array[i]);
  }
}

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
