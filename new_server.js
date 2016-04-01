//Load the modules
var http = require('http');
var https = require('https');
var fs = require('fs');

//Define constants for codes being sent to the browser
var OK = 200, NotFound = 404, BadType = 415;

//Define the port to be used
var port = 8080;

//Start the server
start(port);

// Provide a service to localhost only.
function start(port) 
{
    //Create a server
    var service = http.createServer(handle);
    
    //Start listening
    service.listen(port, 'localhost'); 
    console.log("Server running at localhost:" + port);
}

// Deal with a request.
function handle(request, response) 
{
    //Get the url of the request
    var url = request.url;
    
    //If you're looking for the index
    if (ends(url, "/")) url = url + "index.html";
    
    //Validate the url
    if (!valid(url)) return fail(response, NotFound, "Bad URL");
    
    //Check for requests which aren't for html pages
    if (! ends(url, ".html")) return fail(response, BadType, "Not .html");
    
    var file = "." + url;
    
    //Reply to the request
    fs.readFile(file, reply.bind(null, response));
}

function valid(url)
{
    //Convert the URL to lower case
    url = url.toLowerCase();
    
    //Check for illegal substrings
    if (!starts(url, "/")) return false;
    if (contains(url, "..")) return false;
    if (contains(url, "//")) return false;
    if (contains(url, "/.")) return false;
  
    return true;
}

// Send a reply.
function reply(response, error, content) 
{
    //Check that the reading of the file was successful
    if (error) return fail(response, NotFound, "File not found: " + error);
    
    //Define the header
    var hdrs = { 'Content-Type': 'text/html' };
    
    //Write the head of the response
    response.writeHead(OK, hdrs);
    
    //Write the reponse for the browser
    response.write(content);
    
    //Finish responding
    response.end();
}


// Send a failure message
function fail(response, code, message) 
{
    //Return a failed message for the browser to display
    var hdrs = { 'Content-Type': 'text/plain' };
    response.writeHead(code, hdrs);
    response.write(message);
    response.end();
}

// Check whether a string starts with a prefix, or ends with a suffix
function starts(s, x) { return s.lastIndexOf(x, 0) == 0; }
function ends(s, x) { return s.indexOf(x, s.length-x.length) >= 0; }
function contains(s, x) { return s.indexOf(x) != -1 }
