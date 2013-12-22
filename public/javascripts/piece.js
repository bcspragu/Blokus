var block_size = 25;

function Piece(piece_array,x,y,paper) {
  var p = this;
  p.blocks = [];
  p.selected = false;

  p.drawBlock = function(coordinates){
    var block = paper.rect((x+coordinates[0])*block_size,(y+coordinates[1])*block_size,block_size,block_size).attr({fill: '#0f0'});
    block.click(function(){
      if(p.selected){
        block.attr({fill: '#f00'});
      }else{

      }
      p.selected = !p.selected;
    });
    p.blocks.push(block);
  }

  p.moveRelative = function(coordinates){
    for(var block in p.blocks){
      var x = block.attr('x');
      var y = block.attr('y');
      block.attr({x: x+coordinates[0]*block_size, y: y+coordinates[1]*block_size});
    }
  }

  p.moveAbsolute = function(coordinates){
    for(var block in p.blocks){
      blocks.attr({x: coordinates[0]*block_size, y: coordinates[1]*block_size});
    }
  }

  p.drawBlock([0,0]);
  for(var i = 0; i < piece_array.length; i++){
    p.drawBlock(piece_array[i]);
  }
}
