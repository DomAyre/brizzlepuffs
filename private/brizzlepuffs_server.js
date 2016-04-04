//Load the modules
var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');

//The database
var sql = require("sqlite3");
sql.verbose();
var database = new sql.Database("private/brizzlepuffs.db");

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
    
    //Rewrite the url for news, fixtures and players
    //url = parse(url);
    
    //Get any associated query
    var result = getQuery(url);
    url = result[0]; query = result[1];
    
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
    else reply(response, url, query, type);
}

// Send the reply.
function reply(response, url, query, type) 
{
    //Define the header
    var header = { 'Content-Type': type };
    
    //Write the header of the response
    response.writeHead(OK, header);
    
    //If the request is for a snippet instead of a file
    if (contains(url, "snippet"))
        replyData(response, url, query);
    else
        replyFile(response, url, query);
}

function replyData(response, url, query)
{       
    //Get the parameters of the request
    var table = capitaliseFirstLetter(url.substring(9).split(".")[0]);
        
    //Find the player in the database
    database.all("select * from " + table + (query? " where " + query: ""), function(error, records)
    {
        if (error) throw error;
        respond(response, JSON.stringify(records));
        return;
    });    
}

function replyFile(response, url, query)
{
    //Convert the url into a file path
    var file = "." + url;
    
    //If its a file give that
    fs.readFile(file, function(error, content)
    {
        //Check for errors
        if(error) 
        {
            //If you requested a player picture which doesn't exist
            if (contains(url,"player") && (!contains(url, "_rich") && !contains(url, "_background")) && ends(url, ".png"))
            {
                //Give the club logo instead
                fs.readFile("media/players/blank.png", function(error2, content2) 
                {
                    if (error2) return fail(response, NotFound, "File not found");
                    respond(response, content2);
                });                
            }          
            else return fail(response, NotFound, "File not found");
        }  
        else respond(response, content);
    });
}

function capitaliseFirstLetter(stringToCapitalise)
{
    return stringToCapitalise.substring(0,1).toUpperCase() + stringToCapitalise.substring(1);
}

function respond(response, content)
{
    //Write the reponse for the browser
    response.write(content);
    
    //Finish responding
    response.end();
}

function getQuery(url) 
{
    //Split the url into the address and the query
    var parts = url.split("?");
    
    //Update the url to not contain the query
    var query = parts[1];
    
    //Return the query
    return [parts[0],query];
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

function parse(url) 
{
    if (contains(url, "/players/"))
    {
        var parts = url.split("/players/");
        return parts[0] + "/player.html?name=" + parts[1];
    }
}

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
