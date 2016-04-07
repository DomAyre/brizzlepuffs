"use strict";
addEventListener("load", start);
var records, visibleRecords;

//HTML CONTROLS
var rippleSpan = "<span class=\"mdl-ripple\"></span>";

function start()
{        
    //Populate the players
    HTTPRequest.get("snippet/players.json", function(status, headers, content)
    {      
        records = JSON.parse(content);
        
        updateContent();
    });
    
    //Hook up the onkeypress function for the search box
    document.querySelector("#search-box").addEventListener("keypress", onSearch);
    document.querySelector("#search-box").addEventListener("onfocusout", onSearch);
}

function updateContent()
{
    //Clear the current content
    document.querySelector("#PLAYERS").innerHTML = "";
    document.querySelector("#KEEPERS").innerHTML = "";
    document.querySelector("#CHASERS").innerHTML = "";
    document.querySelector("#BEATERS").innerHTML = "";
    document.querySelector("#SEEKERS").innerHTML = "";
    
    //For each player
    for(var i = 0; i < visibleRecords.length; i++)
    {           
        //Generate the html for the player card 
        var record = visibleRecords[i];
        var newPlayer = generatePlayerCard(record);                     
        
        //Add to appropriate divs
        if (visibleRecords.length > 10)
        {
            if (record["Keeper"]) document.querySelector("#KEEPERS").innerHTML += newPlayer;
            if (record["Chaser"]) document.querySelector("#CHASERS").innerHTML += newPlayer;
            if (record["Beater"]) document.querySelector("#BEATERS").innerHTML += newPlayer;
            if (record["Seeker"]) document.querySelector("#SEEKERS").innerHTML += newPlayer;
            setContainersVisibility("visible");
        }
        else
        {
            document.querySelector("#PLAYERS").innerHTML += newPlayer;
            setContainersVisibility("hidden");
        }
    }
}

function setContainersVisibility(visibility)
{
    var containers = document.querySelectorAll(".position-container");
    for (var i = 0; i < containers.length; i++)
        containers[i].style.visibility = visibility;
}

function generatePlayerCard(record)
{
    //Define the HTML which shows the player
    var squadItem = "<a class=\"squad-item mdl-cell mdl-cell--2-col mdl-card mdl-shadow--2dp mdl-js-ripple-effect\" href=\"player.html?id=" + record["ID"] + "\">";
    var header = "<h2 class=\"item-header " + record["Team"].substring(7) + "\">" + record["First_Name"] + " " + record["Last_Name"] + "</h2>";
    var background = "<div style=\"background-image: url('" + "media/players/" + record["Last_Name"].toLowerCase()+ ".png" + "');\"></div> </a>";
        
    return squadItem + header + background;
}

function onSearch(event)
{
    //If the key was enter, continue
    if (event.keyCode != 13) return;
    
    //Get the string being searched for
    var searchString = { text:document.querySelector("#search-box").value.toLowerCase() };
    
    //Check for things to filter by
    var conditions = [];
    if (contains(searchString, ["brizzlebear", "bear"])) conditions.push("Team=\"Brizzlebears\" ");
    if (contains(searchString, ["brizzlebee", "bee"])) conditions.push("Team=\"Brizzlebees\" ");
    
    if (contains(searchString, ["keeper"])) conditions.push("Keeper=1 ");
    if (contains(searchString, ["chaser"])) conditions.push("Chaser=1 ");
    if (contains(searchString, ["beater"])) conditions.push("Beater=1 ");
    if (contains(searchString, ["seeker"])) conditions.push("Seeker=1 ");
    
    if (contains(searchString, ["assistant referee", "assistant ref"])) conditions.push("AR_Trained=1 ");
    if (contains(searchString, ["snitch referee", "snitch ref"])) conditions.push("SR_Trained=1 ");
    if (contains(searchString, ["head referee", "head ref"])) conditions.push("HR_Trained=1 ");
    if (contains(searchString, ["referee", "ref"]) && !ar && !sr && !hr) conditions.push("AR_Trained=1 OR SR_Trained=1 OR HR_Trained=1 ");
        
    if (contains(searchString, ["first aid", "medic"])) conditions.push("First_Aid_Trained=1 ");
    if (contains(searchString, ["snitche", "snitch"])) conditions.push("Snitch=1 ");
    
    //Search the remaining words for names
    var searchStringWords = searchString.text.split(" ");
    for (var i = 0; i < searchStringWords.length; i++)
    {
        if(searchStringWords[i].trim() != "") 
            conditions.push("(First_Name LIKE \"" + searchStringWords[i] + "\" OR Last_Name LIKE \"" + searchStringWords[i] + "\") ");
    }
    
    updateContent();
}

function formSQL(conditions)
{
    var sqlConditions = "";
    for (var i = 0; i < conditions.length; i++)
    {
        sqlConditions += (i>0? "AND " : "") + conditions[i];
    }
    console.log(sqlConditions);
    return sqlConditions;
}

function contains(s, x) 
{ 
    //For each synonym
    for (var i = 0; i < x.length; i++)
    {
        //Check for plural first
        if (s.text.indexOf(x[i]+"s") != -1)
        {
            //Remove it and return true
            s.text = s.text.split(x[i]+"s").join("");     
            return true;
        }
        //Then check original
        else if (s.text.indexOf(x[i]) != -1)
        {
            //Remove it and return true
            s.text = s.text.split(x[i]).join("");            
            return true;
        }
    }
    return false;
}