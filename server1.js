// Minimal server: reply to all requests with "OK".
var HTTP = require('http');
start(8080);

// Provide a service to localhost only.
function start(port) {
  var service = HTTP.createServer(handle);
  service.listen(port, 'localhost');
  console.log("Visit localhost:" + port);
}

// Deal with a request.
function handle(request, response) {
  console.log("Method:", request.method);
  console.log("URL:", request.url);
  console.log("Headers:", request.headers);
  reply(response);
}

// Send a reply.
function reply(response) {
  var hdrs = { 'Content-Type': 'text/plain' };
  response.writeHead(200, hdrs);  // 200 = OK
  response.write("OK");
  response.end();
}