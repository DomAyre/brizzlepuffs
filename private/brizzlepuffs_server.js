//Load the modules
var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');

//Define constants for codes being sent to the browser
var OK = 200, NotFound = 404, BadType = 415;

//Define the port to be used
var port = 8080;

var types = {
    '.html' : 'text/html, application/xhtml+xml',    // old browsers only, see negotiate
    '.css'  : 'text/css',
    '.js'   : 'application/javascript',
    '.png'  : 'image/png',
    '.gif'  : 'image/gif',    // for images copied unchanged
    '.jpeg' : 'image/jpeg',   // for images copied unchanged
    '.jpg'  : 'image/jpeg',   // for images copied unchanged
    '.svg'  : 'image/svg+xml',
    '.json' : 'application/json',
    '.pdf'  : 'application/pdf',
    '.txt'  : 'text/plain',
    '.ttf'  : 'application/x-font-ttf',
    '.aac'  : 'audio/aac',
    '.mp3'  : 'audio/mpeg',
    '.mp4'  : 'video/mp4',
    '.webm' : 'video/webm',
    '.ico'  : 'image/x-icon', // just for favicon.ico
    '.xhtml': undefined,      // not suitable for dual delivery, use .html
    '.htm'  : undefined,      // non-standard, use .html
    '.rar'  : undefined,      // non-standard, platform dependent, use .zip
    '.doc'  : undefined,      // non-standard, platform dependent, use .pdf
    '.docx' : undefined,      // non-standard, platform dependent, use .pdf
};

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
    //Get the url of the request (making sure its lower case)
    var url = request.url.toLowerCase();
    
    //Get any associated query
    var query = getQuery(url);
    
    //If you're at the root load the main page
    if (ends(url, "/")) url = url + "index.html";
    
    //Validate the url
    if (!valid(url)) return fail(response, NotFound, "Invalid URL");
    if (!safe(url)) return fail(response, NotFound, "Unsafe URL");
    if (!accessible(url)) return fail(response, NotFound, "That content is inaccessible");
    
    //Check for requests which aren't for valid file types
    var type = getFileType(request, url);
    if (!type) return fail(response, BadType, "File type unsupported");
    
    //Reply to the request
    reply(response, url, type);
}

// Send the reply.
function reply(response, url, type) 
{
    //Convert the url into a file path
    var file = "." + url;
    
    //Reply to the request
    fs.readFile(file, function(error, content)
    {
        //Check for errors
        if(error) return fail(response, NotFound, "File not found"); 
            
        //Define the header
        var header = { 'Content-Type': type };
        
        //Write the header of the response
        response.writeHead(OK, header);
        
        //Write the reponse for the browser
        response.write(content);
        
        //Finish responding
        response.end();
    });
}

function getQuery(url) 
{
    //Split the url into the address and the query
    var parts = url.split("?");
    
    //Update the url to not contain the query
    url = parts[0];
    
    //Return the query
    return parts[1];
}

function valid(url)
{   
    //Get key properties of the url
    var startsCorrectly = (starts(url, "/"));
    var doubleSlashUsed = contains(url, "//");
    var dotSlashUsed = contains(url, "/.");
    var endsWithSlash = ends(url, "/");
    var dotOnlyInExtension = url.lastIndexOf(".") > url.lastIndexOf("/");
  
    //Return if all properties are valid
    return startsCorrectly && !doubleSlashUsed && !dotSlashUsed && (endsWithSlash || dotOnlyInExtension);
}

function safe(url) 
{
    //Reject any urls which are too long
    if (url.length > 1000) return false;
    
    //Ban non ASCII characters
    var validChars = /^[ -~\t\n\r]+$/;
    return validChars.test(url);
}

function accessible(url) { return !contains(url, "private"); }

function getFileType(request, url)
{
    //Get the file extension
    var extension = path.extname(url);
    
    //If its HTML decide between new and old standard, otherwise just return the type
    if (extension != ".html") return types[extension];
    
    //Find which html types the browser accepts
    var possibleHTMLTypes = types[".html"].split(", ");
    var acceptedHTMLTypes = request.headers['accept'].split(",");
    
    //If the browser accepts xhtml return that
    if(contains(acceptedHTMLTypes,possibleHTMLTypes[1])) return possibleHTMLTypes[1];
    else return possibleHTMLTypes[0];
}

// Send a failure message
function fail(response, code, message) 
{
    var textTypeHeader = { 'Content-Type': 'text/plain' };
    response.writeHead(code, textTypeHeader);
    response.write(message, 'utf8');
    response.end();
}

// Check whether a string starts with a prefix, or ends with a suffix
function starts(s, x) { return s.lastIndexOf(x, 0) == 0; }
function ends(s, x) { return s.indexOf(x, s.length-x.length) >= 0; }
function contains(s, x) { return s.indexOf(x) != -1 }
