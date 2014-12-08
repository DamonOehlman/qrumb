var qr = require('qr.js');
var EventEmitter = require('eventemitter3');
var url = require('url');
var defaults = require('cog/defaults');
var draw = require('./draw');

/**
  # qrumb

  An experiment using QR codes (yes, currently suffering self loathing)
  to help facilitate WebRTC desktop -> mobile application synchronization.

  ## Examples Usage

  <<< examples/simple.js

**/
module.exports = function(opts) {
  var qrumb = new EventEmitter();

  // initialise default options
  opts = defaults({}, opts, {
    uri: typeof location != 'undefined' && location.href,
    idField: 'syncid',
    imageType: 'png',
    encoding: 'base64'
  });

  function checkCurrent() {
    var parts = opts.uri && url.parse(opts.uri, true);

    // check for a sync field in the uri
    if (parts && parts.query[opts.idField]) {
      qrumb.emit('activate', parts.query[opts.idField]);
    }
  }

  function display(id) {
    var canvas = generate(id);
  }

  function generate(id) {
    var parts = opts.uri && url.parse(opts.uri, true);

    // if the id is not supplied, then init a default
    if (typeof id == 'function' && arguments.length === 0) {
      callback = id;
      id = null;
    }

    // if we have no url parts, then error out
    if (! parts) {
      return;
    }

    // inject the id into the url
    parts.query[opts.idField] = id || require('cuid')();

    // generate the qrcode canvas
    return draw(qr(url.format(parts)));
  }

  qrumb.display = display;
  qrumb.generate = generate;

  // check the current url to see if we have been activated
  setTimeout(checkCurrent, 0);

  return qrumb;
};
