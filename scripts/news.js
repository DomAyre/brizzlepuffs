"use strict";
addEventListener("load", start);

//HTML CONTROLS
var rippleSpan = "<span class=\"mdl-ripple\"></span>";

function start()
{
    //Populate the news section
    HTTPRequest.get("snippet/news.json", function(status, headers, content)
    {      
        var records = JSON.parse(content);
        
        var newsHTML = "";
        
        for(var i = 0; i < records.length; i++)
        {
            var record = records[i];
                              
            var headline = "<h2 class=\"item-header\">" + record["Headline"] + "</h2>";
            
            var nextNewsItem = document.createElement("a");
            nextNewsItem.id = record["Headline"];
            nextNewsItem.href = "article.html?id=" + record["ID"];
            nextNewsItem.className = "news-item mdl-card mdl-cell " + (i==0? "mdl-cell--8-col-tablet " : "") + "mdl-shadow--2dp mdl-js-ripple-effect";
            nextNewsItem.style.backgroundImage = "url('" + record["Image"] + "')";
            nextNewsItem.innerHTML = rippleSpan + headline;      
            
            document.querySelector("#ALLNEWS").appendChild(nextNewsItem);
        }    
    });
}