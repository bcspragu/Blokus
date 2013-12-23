var block_size = 25;

function Piece(piece_array,x,y,paper) {
  var p = this;
  p.blocks = [];
  p.selected = false;
  p.mousemove = function(e){
    var board = $('#board');
    if(p.selected){
      x = Math.floor((e.pageX - board.offset().left)/block_size);
      y = Math.floor((e.pageY - board.offset().top)/block_size);
      p.moveAbsolute([x,y]);
    }
  }

  $('#board').mousemove(p.mousemove);
  p.drawBlock = function(coordinates){
    var block = paper.rect((x+coordinates[0])*block_size,(y+coordinates[1])*block_size,block_size,block_size).attr({fill: '#0f0'});
    block.click(function(){
      //If valid, drop it there, otherwise, send it back
      if(p.selected){
        //Color it back
        for(var i = 0; i < p.blocks.length; i++){
          p.blocks[i].attr({fill: '#0f0'});
        }
        //If valid, leave it there, otherwise put it back
        if(true){
          p.moveAbsolute([9,23]);
        }
      }else{
        for(var i = 0; i < p.blocks.length; i++){
          p.blocks[i].attr({fill: '#f00'});
        }
      }
      p.selected = !p.selected;
    });
    p.blocks.push(block);
  }

  p.moveRelative = function(coordinates){
    for(var i = 0; i < p.blocks.length; i++){
      var x = p.blocks[i].attr('x');
      var y = p.blocks[i].attr('y');
      p.blocks[i].attr({x: x+coordinates[0]*block_size, y: y+coordinates[1]*block_size});
    }
  }

  p.moveAbsolute = function(coordinates){
    p.blocks[0].attr({x: coordinates[0]*block_size, y: coordinates[1]*block_size});
    for(var i = 1; i < p.blocks.length; i++){
      p.blocks[i].attr({x: (coordinates[0]+piece_array[i-1][0])*block_size, y: (coordinates[1]+piece_array[i-1][1])*block_size});
    }
  }

  p.drawBlock([0,0]);
  for(var i = 0; i < piece_array.length; i++){
    p.drawBlock(piece_array[i]);
  }

  p.deletePiece = function(){
    for(var i = 0; i < p.blocks.length; i++){
        p.blocks[i].remove();
      }
    $('#board').off('mousemove');
  }
}
