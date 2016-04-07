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
                    
            var newsItem = "<a id=\"" + record["Headline"] + "\" href=\"article.html?id=" + record["ID"] + "\" class=\"news-item mdl-card mdl-cell mdl-shadow--2dp mdl-js-ripple-effect\" style=\"background-image: url('" + record["Image"] + "')\">";                              
            var headline = "<h2 class=\"item-header\">" + record["Headline"] + "</h2> </a>";
            
            var nextNewsItem = newsItem + rippleSpan + headline;
            
            newsHTML = newsHTML + nextNewsItem;
        }
        
        $('#ALLNEWS').replaceWith(newsHTML);        
    });
}