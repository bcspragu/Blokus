var paper;
var block_size = 25;

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
  for(var i = 0; i < 20; i++){
    for(var j = 0; j < 20; j++){
      paper.rect(i*block_size,j*block_size,block_size,block_size).attr({stroke: '#000', 'stroke-width':1});
    }
  }
  var index = 0;
  for(var i = 1; i < 18; i += 5){
    for(var j = 1; j < 18; j += 5){
      new Piece(pieces[index++],i,j,paper);
    }
  }
  paper.rect(0,20*block_size,block_size*20,200).attr({fill: '#f99'})
});
