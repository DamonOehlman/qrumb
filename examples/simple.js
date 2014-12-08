var qrumb = require('..')();

qrumb.on('activate', function(id) {
  console.log('activated: ' + id);
});

qrumb.display();
