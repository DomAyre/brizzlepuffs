"use strict";
addEventListener("load", start);

//HTML CONTROLS
var rippleSpan = "<span class=\"mdl-ripple\"></span>";

function start()
{    
    //Populate the players
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
            var squadItem = "<a class=\"squad-item mdl-cell mdl-cell--2-col mdl-card mdl-shadow--2dp mdl-js-ripple-effect\" href=\"player.html?id=" + record["ID"] + "\">";
            var header = "<h2 class=\"item-header " + record["Team"].substring(7) + "\">" + record["First_Name"] + " " + record["Last_Name"] + "</h2>";
            var background = "<div style=\"background-image: url('" + photoPath + "');\"></div> </a>";
                
            playersHTML = playersHTML + (squadItem + header + background);
        }        
        
        $('#ALLPLAYERS').replaceWith(playersHTML);
    });
}