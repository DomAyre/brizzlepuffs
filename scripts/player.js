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
    
    //Populate the player
    HTTPRequest.get("snippet/players.json?id=" + fixtureID, function(status, headers, content)
    {
        //Get the fixture object from the JSON
        var player = JSON.parse(content)[0];
        
        //Set the tab title
        document.querySelector("title").innerHTML = player["First_Name"] + " " + player["Last_Name"];
        
        //Set the header
        document.querySelector("#player-name").innerHTML = player["First_Name"] + " " + player["Last_Name"];
        
        //Set the images
        document.querySelector("#player-background").style.backgroundImage = "url('media/players/" + player["Last_Name"].toLowerCase() + "_background.png')";
        document.querySelector("#player-image").style.backgroundImage = "url('media/players/" + player["Last_Name"].toLowerCase() + "_rich.png')";
        
        //Set the background colour in case there is no picture
        document.querySelector("#player-image").style.backgroundColor = (player["Team"] == "Brizzlebees"? "yellow" : "red");
        
        //Set the badges
        console.log(player);
        var badges = "";
        if (player["Team"] == "Brizzlebears") badges += badge("bear");
        if (player["Team"] == "Brizzlebees") badges += badge("bee");
        if (player["Keeper"]) badges += badge("keeper");
        if (player["Chaser"]) badges += badge("chaser");
        if (player["Beater"]) badges += badge("beater");
        if (player["Seeker"]) badges += badge("seeker");
        if (player["SR_Qualified"] || player["AR_Qualified"] || player["HR_Qualified"]) badges += badge("referee");
        if (player["First_Aid_Trained"]) badges += badge("first_aid");
        if (player["Snitch"]) badges += badge("snitch");        
        document.querySelector("#player-badges").innerHTML = badges;
        
        //Set the profile
        var profile = (player["Profile"] != null? player["Profile"] : player["First_Name"] + " doesn't have a profile yet, but keep your eyes peeled its only a matter of time");
        document.querySelector("#player-profile").innerHTML = profile.split("\n").join("<br/>");
        
    });
}

function badge(name)
{
    return "<img class=\"badge\" src=\"media/players/badges/" + name + ".png\"/>";
}