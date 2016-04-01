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
    '.html' : 'text/html',
    '.css'  : 'text/css',
    '.js'   : 'application/javascript',
    '.png'  : 'image/png',
    '.mp3'  : 'audio/mpeg',
    '.aac'  : 'audio/aac',
    '.mp4'  : 'video/mp4',
    '.webm' : 'video/webm',
    '.gif'  : 'image/gif',
    '.jpeg' : 'image/jpeg',
    '.svg'  : 'image/svg+xml',
    '.json' : 'application/json',
    '.pdf'  : 'application/pdf',
    '.txt'  : 'text/plain',
    '.xhtml': '#not suitable for dual delivery, use .html',
    '.htm'  : '#proprietary, non-standard, use .html',
    '.jpg'  : '#common but non-standard, use .jpeg',
    '.rar'  : '#proprietary, non-standard, platform dependent, use .zip',
    '.doc'  : '#proprietary, non-standard, platform dependent, ' +
              'closed source, unstable over versions and installations, ' +
              'contains unsharable personal and printer preferences, use .pdf',
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
    //Get the url of the request
    var url = request.url;
    
    //If you're looking for the index
    if (ends(url, "/")) url = url + "index.html";
    
    //Validate the url
    if (!valid(url)) return fail(response, NotFound);
    
    //Check for requests which aren't for valid file types
    var type = getFileType(url);
    if (!type) return fail(response, BadType)
    
    var file = "." + url;
    
    //Reply to the request
    try { fs.readFile(file, reply); }
    catch (error) { return fail(response, error); }
    
    // Send the reply.
    function reply(error, content) 
    {
        //Check that the reading of the file was successful
        if (error) return fail(response, error);
        
        //Define the header
        var header = { 'Content-Type': type };
        
        //Write the head of the response
        response.writeHead(OK, header);
        
        //Write the reponse for the browser
        response.write(content);
        
        //Finish responding
        response.end();
    }

}

function valid(url)
{
    //Convert the URL to lower case
    url = url.toLowerCase();
    
    //Ban non ASCII characters
    var validChars = /^[ -~\t\n\r]+$/;
    if (!validChars.test(url)) return false;
    
    //Make sure you're not offering up anything which is private
    if (contains(url, "private")) return false;
    
    //Check for illegal substrings
    if (!starts(url, "/")) return false;
    if (contains(url, "..")) return false;
    if (contains(url, "//")) return false;
    if (contains(url, "/.")) return false;
  
    return true;
}

function getFileType(url)
{
    //Get the file extension
    var extension = path.extname(url);
    
    //Check that the extension is valid
    if (!(extension in types)) return false;
    
    //Return the type
    return types[extension]; 
}


// Send a failure message
function fail(response, code) 
{
    //Return a failed message for the browser to display
    response.writeHead(code);
    response.end();
}

// Check whether a string starts with a prefix, or ends with a suffix
function starts(s, x) { return s.lastIndexOf(x, 0) == 0; }
function ends(s, x) { return s.indexOf(x, s.length-x.length) >= 0; }
function contains(s, x) { return s.indexOf(x) != -1 }
