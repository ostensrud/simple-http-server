var http = require('http');
var dispatcher = require('httpdispatcher');
var fs = require('fs');
var url = require('url');

const PORT=24000;
var status_codes = {};

function handleRequest(request, response) {
  try  {
    var delay = 0;
    var parsed_url = url.parse(request.url, true);
    log("Request from: " + request.connection.remoteAddress + "("+ request.connection.remoteFamily + ")");
    log("Requested resource: " + parsed_url.pathname);
    if(parsed_url.search) {
      log("With params: " + parsed_url.search);
    }

    if (parsed_url.query.delay) {
      delay = parsed_url.query.delay;
    }

    setTimeout(function() {
      dispatcher.dispatch(request, response);
    }, delay);
  } catch (error) {
    log(error);
  }
}

//TODO: Automatically use values from file if possible
dispatcher.onGet("/200", function(req, res) {
  writeResponse(res, 200);
});

dispatcher.onGet("/301", function(req, res) {
  writeResponse(res, 301);
});

dispatcher.onGet("/302", function(req, res) {
  writeResponse(res, 302);
});

dispatcher.onGet("/401", function(req, res) {
  writeResponse(res, 401);
});

dispatcher.onGet("/403", function(req, res) {
  writeResponse(res, 403);
});

dispatcher.onGet("/404", function(req, res) {
  writeResponse(res, 404);
});

dispatcher.onGet("/405", function(req, res) {
  writeResponse(res, 405);
});

dispatcher.onGet("/500", function(req, res) {
  writeResponse(res, 500);
});

dispatcher.onGet("/502", function(req, res) {
  writeResponse(res, 502);
});

dispatcher.onGet("/503", function(req, res) {
  writeResponse(res, 503);
});

dispatcher.onGet("/loop", function(req, res) {
  res.statusCode = 302;
  res.statusMessage = status_codes[302];
  res.setHeader("Location", "/301");
  res.end();
});

function log(message) {
  console.log(getTime() + '\t' + message);
}

function warn(message) {
  console.error(getTime() + '\t' + message);
}

function writeResponse(res, code) {
  log("Response: " + code);
  res.statusCode = code;
  res.statusMessage = status_codes[code].text;
  if (code == 301 || code == 302) {
    res.setHeader("Location", "/200");
  }
  res.end(code + ' ' + status_codes[code].text);

  log("Request handled");
  console.log(Array(81).join("="));
};

function getTime() {
  var timestamp = new Date();
  var month = pad(timestamp.getMonth()+1, 2);
  var year = timestamp.getYear()+1900;
  var date = pad(timestamp.getDate(), 2);
  var hour = pad(timestamp.getHours(), 2);
  var minutes = pad(timestamp.getMinutes(), 2);
  var seconds = pad(timestamp.getSeconds(), 2);
  var millis = timestamp.getMilliseconds();
  
  return year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":" + seconds + "." + millis;
}

function pad(value, size) {
  var s = "0"+value;
  return s.substr(s.length-size);
}

function read_config() {
  fs.readFile('status_codes.json','utf8', function(err, data) {
    // TODO: Proper exception handling
    if (err) throw err
    status_codes = JSON.parse(data);
  });
}

read_config();
var server = http.createServer(handleRequest);

server.listen(PORT, function() {
  console.log("Server listening on: http://localhost:%s", PORT);
});
