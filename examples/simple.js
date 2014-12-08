var qrumb = require('..')();

qrumb.on('activate', function(id) {
  console.log('activated: ' + id);
});

document.body.appendChild(qrumb.generate());
