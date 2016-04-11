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
        
        for(var i = 0; i < Math.min(records.length,3); i++)
        {
            var record = records[i];
                    
            var newsItem = "<a id=\"" + record["Headline"] + "\" href=\"article.html?id=" + record["ID"] + "\" class=\"news-item mdl-card mdl-cell " + (i==0? "mdl-cell--8-col-tablet " : "") + "mdl-shadow--2dp mdl-js-ripple-effect\" style=\"background-image: url('" + record["Image"] + "')\">";                              
            var headline = "<h2 class=\"item-header\">" + record["Headline"] + "</h2> </a>";
            
            var nextNewsItem = newsItem + rippleSpan + headline;
            
            document.querySelector("#ALLNEWS").innerHTML += nextNewsItem;
        }    
    });
    
    //Populate the fixtures section
    HTTPRequest.get("snippet/fixtures.json", function(status, headers, content)
    {      
        var records = JSON.parse(content);
        
        var fixturesHTML = "";
        
        for(var i = 0; i < records.length; i++)
        {
            var record = records[i];
            
            var fixtureItem = "<a class=\"fixture-item mdl-card mdl-cell mdl-shadow--2dp mdl-js-ripple-effect\" href=\"fixture.html?id=" + record["ID"] + "\">";
            var team1Name = "<div> <h6 id=\"team1Name\" class=\"team-label team1 mdl-card__title-text\">" + record["Home_Team"] + "</h6>";
            var team1Logo = "<div class=\"fixture-content\"> <div style=\"background-image: url('media/teams/" + record["Home_Team"].toLowerCase() + ".png');\" class=\"team-logo team1\"></div>";
            var versus = "<h6 id=\"versus\">V</h6>";
            var team2Logo = "<div style=\"background-image: url('media/teams/" + record["Away_Team"].toLowerCase() + ".png');\" class=\"team-logo team2\"></div> </div>";
            var team2Name = "<h6 id=\"team2Name\" class=\"team-label team2 mdl-card__title-text\">" + record["Away_Team"] + "</h6> </div>";
            var header = "<h2 class=\"item-header fixture\">" + record["Date"] + " <br/> " + record["Venue"] + "</h2> </a>";
            
            var nextFixture = fixtureItem + rippleSpan + team1Name + team1Logo + versus + team2Logo + team2Name + header;
            fixturesHTML = fixturesHTML + nextFixture;
        }        
        
        $('#ALLFIXTURES').replaceWith(fixturesHTML);
    });
    
    //Populate the players section
    HTTPRequest.get("snippet/players.json", function(status, headers, content)
    {      
        var records = JSON.parse(content);
        
        var playersHTML = "";
        
        for(var i = 0; i < records.length; i++)
        {
            var record = records[i];
            
            //Check if a players photo exists
            var photoPath = "media/players/" + record["Last_Name"].toLowerCase()+ ".png";  
                            
            //Define the HTML which shows the player
            var squadItem = "<a class=\"squad-item mdl-card mdl-shadow--2dp mdl-js-ripple-effect\" href=\"player.html?id=" + record["ID"] + "\">";
            var header = "<h2 class=\"item-header " + record["Team"].substring(7) + "\">" + record["First_Name"] + " " + record["Last_Name"] + "</h2>";
            var background = "<div style=\"background-image: url('" + photoPath + "');\"></div> </a>";
                
            playersHTML = playersHTML + (squadItem + header + background);
        }        
        
        $('#ALLPLAYERS').replaceWith(playersHTML);
    });
}
