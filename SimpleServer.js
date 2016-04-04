var http = require('http');
var dispatcher = require('httpdispatcher');

const PORT=24000;

var status_codes = {};
status_codes[200] = 'OK';
status_codes[301] = 'Found';
status_codes[302] = 'Moved permanently';
status_codes[401] = 'Unauthorized';
status_codes[403] = 'Forbidden';
status_codes[404] = 'Not Found';
status_codes[405] = 'Method Not Allowed';
status_codes[500] = 'Internal Server Error';
status_codes[502] = 'Bad Gateway';
status_codes[503] = 'Service Unavailable';

function handleRequest(request, response) {
  try  {
    log("Requested: " + request.url);
    dispatcher.dispatch(request, response);
  } catch (error) {
    log(error);
  }
}

dispatcher.onGet("/200", function(req, res) {
  writeResponse(res, 200);
});

dispatcher.onGet("/ok_delay", function(req, res) {
  setTimeout(function() { writeResponse(res, 200); }, 10000);
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

function writeResponse(res, code) {
  log("Response: " + code);
  res.statusCode = code;
  res.statusMessage = status_codes[code];
  if (code == 301 || code == 302) {
    res.setHeader("Location", "/200");
  }
  res.end(code + ' ' + status_codes[code]);

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

var server = http.createServer(handleRequest);

server.listen(PORT, function() {
  console.log("Server listening on: http://localhost:%s", PORT);
});
