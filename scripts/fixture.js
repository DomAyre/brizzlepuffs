"use strict";
addEventListener("load", start);

//HTML CONTROLS
var rippleSpan = "<span class=\"mdl-ripple\"></span>";

function start()
{
    //Get the url
    var url = window.location.href;
    
    //Get the ID
    var fixtureID = url.split("?id=")[1];
    
    //Populate the fixture
    HTTPRequest.get("snippet/fixtures.json?id=" + fixtureID, function(status, headers, content)
    {
        //Get the fixture object from the JSON
        var fixture = JSON.parse(content)[0];
        
        //Set the fixture title
        var fixtureTitle = fixture["Home_Team"] + " vs " + fixture["Away_Team"];
        
        //Set the tab title
        document.querySelector("title").innerHTML = fixture["Date"] + " - " + fixtureTitle;
        
        //Set the page title
        document.querySelector("#title").innerHTML = fixtureTitle;
        
        //Set the hero image
        document.querySelector("#fixture-image").style.backgroundImage = "url('media/fixtures/fixture_" + fixtureID + ".png')";
        
        //Set the two logos 
        document.querySelector("#fixture-team1").style.backgroundImage = "url('media/teams/" + fixture["Home_Team"].toLowerCase() + ".png')";
        document.querySelector("#fixture-team2").style.backgroundImage = "url('media/teams/" + fixture["Away_Team"].toLowerCase() + ".png')";
        
        //Set the date
        document.querySelector("#fixture-date").innerHTML = fixture["Date"];
        
        //Set the score
        var homeScore = fixture["Home_Team_Score"].toString() + snitch(fixture, fixture["Home_Team"]);
        var awayScore =  snitch(fixture, fixture["Away_Team"]) + fixture["Away_Team_Score"].toString();
        document.querySelector("#fixture-score").innerHTML = homeScore + " - " + awayScore;
        
        //Set the writeup
        var writeup = (fixture["Writeup"] != null? fixture["Writeup"] : "There is no writeup for this match yet, to submit one email brizzlepuffs@outlook.com");
        document.querySelector("#writeup").innerHTML = writeup.split("\n").join("<br/>");
    });
}

function snitch(fixture, team)
{
    if (fixture["Snitch"].toString() != team) return "";
    if (fixture["Overtime"]) return "^";
    else return "*";
}