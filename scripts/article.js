"use strict";
addEventListener("load", start);

//HTML CONTROLS
var rippleSpan = "<span class=\"mdl-ripple\"></span>";

function start()
{    
    //Get the url
    var url = window.location.href;
    
    //Get the ID
    var newsID = url.split("?id=")[1];
    
    //Populate the news section
    HTTPRequest.get("snippet/news.json?id=" + newsID, function(status, headers, content)
    {      
        var newsItem = JSON.parse(content)[0];
             
        //Set the tab title
        document.querySelector("title").innerHTML = newsItem["Headline"];
        
        //Set the headers
        document.querySelector("#news-headline").innerHTML = newsItem["Headline"];
        
        //Set the hero image
        document.querySelector("#news-image").src = newsItem["Image"];
        
        //Set the content
        document.querySelector("#news-content").innerHTML = newsItem["Content"].split("\n").join("<br/>");        
    });
}