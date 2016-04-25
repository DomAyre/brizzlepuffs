"use strict";
addEventListener("load", start);

//HTML CONTROLS
var rippleSpan = "<span class=\"mdl-ripple\"></span>";

function toDateString(dbDate)
{
    var components = dbDate.split("-");
    return components[2] + "/" + components[1] + "/" + components[0];
}

function start()
{
    //Populate the fixture section
    HTTPRequest.get("snippet/fixtures.json", function(status, headers, content)
    {      
        var records = JSON.parse(content);
        
        var fixturesHTML = "";
        
        for(var i = 0; i < records.length; i++)
        {
            var record = records[i];
            
            var fixtureItem = "<a class=\"fixture-item mdl-cell  mdl-card mdl-cell mdl-shadow--2dp mdl-js-ripple-effect\" href=\"fixture.html?id=" + record["ID"] + "\">";
            var team1Name = "<div> <h6 id=\"team1Name\" class=\"team-label team1 mdl-card__title-text\">" + record["Home_Team"] + "</h6>";
            var team1Logo = "<div class=\"fixture-content\"> <div style=\"background-image: url('media/teams/" + record["Home_Team"].toLowerCase() + ".png');\" class=\"team-logo team1\"></div>";
            var versus = "<h6 id=\"versus\">V</h6>";
            var team2Logo = "<div style=\"background-image: url('media/teams/" + record["Away_Team"].toLowerCase() + ".png');\" class=\"team-logo team2\"></div> </div>";
            var team2Name = "<h6 id=\"team2Name\" class=\"team-label team2 mdl-card__title-text\">" + record["Away_Team"] + "</h6> </div>";
            var header = "<h2 class=\"item-header fixture\">" + toDateString(record["Date"]) + " <br/> " + record["Venue"] + "</h2> </a>";
            
            var nextFixture = fixtureItem + rippleSpan + team1Name + team1Logo + versus + team2Logo + team2Name + header;
            fixturesHTML = fixturesHTML + nextFixture;
        }        
        
        $('#ALLFIXTURES').replaceWith(fixturesHTML);
    });
}