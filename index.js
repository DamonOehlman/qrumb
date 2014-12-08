var qr = require('qr-image');
var EventEmitter = require('eventemitter3');
var url = require('url');
var concat = require('concat-stream');
var defaults = require('cog/defaults');

module.exports = function(opts) {
  var idField = (opts || {}).idField || 'syncid';
  var qrumb = new EventEmitter();

  function display(opts) {
    generate(defaults({}, opts, { encoding: 'base64' }), function(err, image) {
      if (err) {
        return console.error('Could not generate image: ', err);
      }

      console.log(image);
    });
  }

  function generate(opts, callback) {
    var generator;
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
      encoding: null
    });

    // parse the uri
    parts = opts.uri && url.parse(opts.uri, true);

    // if we have no url parts, then error out
    if (! parts) {
      return callback(new Error('Unable to parse current or supplied uri: ', uri));
    }

    // inject the id into the url
    parts.query[opts.idField] = opts.id;

    // generate the qrimage
    generator = qr.image(url.format(parts), { type: opts.imageType });
    generator.on('error', callback).pipe(concat(function(data) {
      if (opts.encoding) {
        if (opts.encoding === 'base64') {
          return callback(null, 'data:image/png;base64,' + data.toString('base64'));
        }

        return callback(null, data.toString(opts.encoding));
      }

      callback(null, data);
    }));
  }

  qrumb.display = display;
  qrumb.generate = generate;


  return qrumb;
};
