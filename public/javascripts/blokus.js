var paper;
var block_size = 25;

var avail_pieces = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
var current_piece;
var current_piece_index = 20;

//The pieces are stored as an array of x,y coordinates
var pieces = [
  [], //One piece
  [[0,1]], //Two piece
  [[0,1],[0,-1]], //Three pieces
  [[1,0],[0,1]],
  [[0,1],[1,0],[1,1]], //Four pieces
  [[-1,0],[1,0],[0,1]],
  [[-1,0],[1,0],[2,0]],
  [[-1,0],[1,0],[1,1]],
  [[-1,0],[0,-1],[-1,1]],
  [[-1,0],[-1,-1],[1,0],[2,0]], //Five pieces
  [[0,-1],[0,1],[-1,1],[1,1]],
  [[0,-1],[0,-2],[1,0],[2,0]],
  [[0,1],[-1,1],[1,0],[2,0]],
  [[-1,0],[-1,1],[1,0],[1,-1]],
  [[0,1],[0,2],[0,-1],[0,-2]],
  [[0,1],[1,0],[1,1],[0,-1]],
  [[0,-1],[1,-1],[0,1],[-1,1]],
  [[0,-1],[1,-1],[0,1],[1,1]],
  [[-1,0],[0,-1],[0,1],[1,-1]],
  [[-1,0],[0,-1],[0,1],[1,0]],
  [[-1,0],[1,0],[2,0],[0,-1]]
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
  current_piece = new Piece(pieces[current_piece_index],10,25,paper);
  paper.rect(0,20*block_size,block_size*20,200).attr({fill: '#f99'})

  var select_piece = function(direction){
    current_piece.deletePiece();
    current_piece_index += direction;
    current_piece = new Piece(pieces[current_piece_index % 21],9,23,paper);
  }

  paper.path('M50,550L0,600L50,650L50,550').attr({fill: '#000'}).click(function(){
    select_piece(-1);
  });

  paper.path('M450,550L500,600L450,650L450,550').attr({fill: '#000'}).click(function(){
    select_piece(1);
  });

});
