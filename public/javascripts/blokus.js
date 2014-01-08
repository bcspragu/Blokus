var paper;
var block_size = 25;

var avail_pieces = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
var current_piece;
var current_piece_index = 20;

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

  paper =  Raphael("board", block_size*20, block_size*20+200);
  
  //Draw the grid
  for(var i = 0; i < 20; i++){
    for(var j = 0; j < 20; j++){
      paper.rect(i*block_size,j*block_size,block_size,block_size).attr({stroke: '#000', 'stroke-width':1});
    }
  }
  var index = 0;
  current_piece = new Piece(pieces[current_piece_index],{x: 9, y: 23},paper);
  paper.rect(0,20*block_size,block_size*20,200).attr({fill: '#f99'})

  var select_piece = function(direction){
    current_piece.deletePiece();
    current_piece_index += direction;
    current_piece = new Piece(pieces[current_piece_index % 21],{x: 9, y: 23},paper);
  }

  paper.path('M50,550L0,600L50,650L50,550').attr({fill: '#000'}).click(function(){
    select_piece(-1);
  });

  paper.path('M450,550L500,600L450,650L450,550').attr({fill: '#000'}).click(function(){
    select_piece(1);
  });

});

function Piece(piece_array,coor,paper,board) {
  var p = this;
  p.blocks = [];
  p.placed = false;
  p.mousemove = function(e){
    var board = $('#board');
    x = Math.floor((e.pageX - board.offset().left)/block_size);
    y = Math.floor((e.pageY - board.offset().top)/block_size);
    if(y <= 20){
      p.moveAbsolute({x: x, y: y});
    }else{
      p.moveAbsolute({x: 9, y: 23});
    }
  }

  $('#board').mousemove(p.mousemove);

  p.drawBlock = function(coordinates){
    var block = paper.rect((coor.x+coordinates.x)*block_size,(coor.y+coordinates.y)*block_size,block_size,block_size).attr({fill: '#0f0'});
    block.click(p.rotate);
    block.data('x',coor.x+coordinates.x);
    block.data('y',coor.y+coordinates.y);
    p.blocks.push(block);
  }

  p.moveRelative = function(coordinates){
    var offset;
    for(var i = 0; i < p.blocks.length; i++){
      if(i == 0){
        offset = {x: 0, y: 0};
      }else{
        offset = piece_array[i-1];
      }
      x = p.blocks[i].attr('x');
      y = p.blocks[i].attr('y');
      p.blocks[i].attr({x: (x+coordinates.x+offset.x)*block_size, y: (y+coordinates.y+offset.y)*block_size});
      p.blocks[i].data('x',x+coordinates.x+offset.x);
      p.blocks[i].data('y',y+coordinates.y+offset.y);
    }
  }

  p.moveAbsolute = function(coordinates){
    var offset;
    for(var i = 0; i < p.blocks.length; i++){
      if(i == 0){
        offset = {x: 0, y: 0};
      }else{
        offset = piece_array[i-1];
      }
      p.blocks[i].attr({x: (coordinates.x+offset.x)*block_size, y: (coordinates.y+offset.y)*block_size});
      p.blocks[i].data('x',(coordinates.x+offset.x));
      p.blocks[i].data('y',(coordinates.y+offset.y));
    }
  }

  p.update = function(){
    var center = {x: p.blocks[0].data('x'), y: p.blocks[0].data('y')};
    for(var i = 1; i < p.blocks.length; i++){
      if(i == 0){
        offset = {x: 0, y: 0};
      }else{
        offset = piece_array[i-1];
      }
      p.blocks[i].attr({x: (x+offset.x)*block_size, y: (y+offset.y)*block_size});
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

  p.rotate = function(){
    for(var i = 0; i < piece_array.length; i++){
      var temp_x = piece_array[i].x;
      piece_array[i].x = piece_array[i].y*-1;
      piece_array[i].y = temp_x;
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
