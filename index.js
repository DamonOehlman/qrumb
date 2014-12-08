var qr = require('qr.js');
var EventEmitter = require('eventemitter3');
var url = require('url');
var defaults = require('cog/defaults');
var draw = require('./draw');

module.exports = function(opts) {
  var idField = (opts || {}).idField || 'syncid';
  var qrumb = new EventEmitter();

  function display(opts) {
    generate(opts, function(err, image) {
      if (err) {
        return console.error('Could not generate image: ', err);
      }

      console.log(image);
    });
  }

  function generate(opts, callback) {
    var qrcode;
    var parts;

    // if the id is not supplied, then init a default
    if (typeof opts == 'function' && arguments.length === 0) {
      callback = opts;
      opts = {};
    }

    // initialise default options
    opts = defaults({}, opts, {
      uri: typeof location != 'undefined' && location.href,
      id: require('cuid')(),
      idField: 'syncid',
      imageType: 'png',
      encoding: 'base64'
    });

    // parse the uri
    parts = opts.uri && url.parse(opts.uri, true);

    // if we have no url parts, then error out
    if (! parts) {
      return callback(new Error('Unable to parse current or supplied uri: ', uri));
    }

    // inject the id into the url
    parts.query[opts.idField] = opts.id;

    // generate the qrcode canvas
    qrcode = draw(qr(url.format(parts)));

    callback(null, qrcode.toDataURL('image/png'));
  }

  qrumb.display = display;
  qrumb.generate = generate;

  return qrumb;
};
