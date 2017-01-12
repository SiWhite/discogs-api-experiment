/**
 * Discogs API module
 * @module discogs
 */

var http = require('http');
var zlib = require('zlib');

/**
 * Handles encoded response from Discogs, returns JSON data
 * 
 * @param {Object} response - The HTTP response object
 * @param {Function} [callback] - Callback function
 */

var handleEncoded = function (response, callback) {	
    var json = '',
        add = function (buffer) { json += buffer.toString(); };
        parse = function () { callback(null, JSON.parse(json)); },
	type = response.headers['content-encoding'];

    if (type === 'gzip') {
        var gunzip = zlib.createGunzip().on('data', add).on('end', parse);
	return response.pipe(gunzip);
    }

    if (type === 'deflate') {
        var inflate = zlib.createInflate().on('data', add).on('end', parse);
       	return response.pipe(inflate);
    }
	
    return response.on('data', add).on('end', parse);
};

/**
 * Get data from Discogs and pass the result as a JSON object to the callback
 * 
 * @param {Object} options - The HTTP options
 */

var loadData = function (options) {	
    if (typeof options.callback !== 'function') {
	return console.log('There was an error: "' + options.callback + '" is not a function');
    }
	
    var req = http.get(options, function (res) {	
	handleEncoded(res, options.callback);
    });

    req.on('error', function (e) {
	console.log('There was an error: ' + e.message);
    });
};

/**
 * Get release data from the Discogs API
 * @param {Object} reqHeaders - HTTP request headers - user-agent is required.
 * @param {String} url - The discogs resource to get
 * @param {Function} [callback] - Callback function
 */

module.exports = function () {	
    var reqHeaders = arguments[0] || {};
    var url = arguments[1] || '';
    var callback = arguments[2] || function (err, data) { console.log(data); };
	
    var options = {
	host: 'api.discogs.com',
	path: url,
	headers: reqHeaders,
	callback: callback
    };
	
    loadData(options);
};
