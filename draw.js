module.exports = function(code, opts) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var size = (opts || {}).size || 200;
  var tileSize = size / code.moduleCount;

  // initialise the canvas size
  canvas.width = canvas.height = size;

  code.modules.forEach(function(row, rIdx) {
    row.forEach(function(cell, cIdx) {
      var w = (Math.ceil((cIdx+1)*tileSize) - Math.floor(cIdx*tileSize));
      var h = (Math.ceil((rIdx+1)*tileSize) - Math.floor(rIdx*tileSize));

      ctx.fillStyle = cell ? '#000' : '#fff';
      ctx.fillRect(Math.round(cIdx*tileSize), Math.round(rIdx*tileSize), w, h);
    });
  });

  return canvas;
};
