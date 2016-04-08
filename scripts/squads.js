"use strict";
addEventListener("load", start);
var records, visibleRecords;
var searchingForNonPlayers = false;

//HTML CONTROLS
var rippleSpan = "<span class=\"mdl-ripple\"></span>";

function start()
{        
    //Populate the players
    HTTPRequest.get("snippet/players.json", function(status, headers, content)
    {      
        records = JSON.parse(content);
        visibleRecords = records;
        
        updateContent();
    });
    
    //Hook up the onkeypress function for the search box
    document.querySelector("#search-box").addEventListener("keydown", onSearch);
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
        if (visibleRecords.length > 10 || !searchingForNonPlayers)
        {
            document.querySelector("#PlayersDiv").style.visibility = "collapse";
            if (record["Keeper"]) document.querySelector("#KEEPERS").innerHTML += newPlayer;
            if (record["Chaser"]) document.querySelector("#CHASERS").innerHTML += newPlayer;
            if (record["Beater"]) document.querySelector("#BEATERS").innerHTML += newPlayer;
            if (record["Seeker"]) document.querySelector("#SEEKERS").innerHTML += newPlayer;
            setContainersVisibility("visible");
        }
        else
        {
            document.querySelector("#PlayersDiv").style.visibility = "visible";
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
    //Get the pressed key
    var key = event.keyCode;
    var searchString = document.querySelector("#search-box").value + String.fromCharCode(key);    
    if (key == 8) searchString = searchString.substring(0,searchString.length-2);
    
    //Get the string being searched for
    var searchObj = { text:searchString };
    
    search(searchObj);
}

function search(searchString)
{
    searchString.text = searchString.text.toLowerCase();
    console.log(searchString.text);
    
    //Check for things to filter by
    var conditions = [];
    if (synomymPresent(searchString, ["brizzlebear", "bear"])) conditions.push("Brizzlebears");
    if (synomymPresent(searchString, ["brizzlebee", "bee"])) conditions.push("Brizzlebees");
    
    if (synomymPresent(searchString, ["keeper"])) conditions.push("Keeper");
    if (synomymPresent(searchString, ["chaser"])) conditions.push("Chaser");
    if (synomymPresent(searchString, ["beater"])) conditions.push("Beater");
    if (synomymPresent(searchString, ["seeker"])) conditions.push("Seeker");
    
    if (synomymPresent(searchString, ["assistant referee", "assistant ref"])) conditions.push("AR"); searchingForNonPlayers = true;
    if (synomymPresent(searchString, ["snitch referee", "snitch ref"])) conditions.push("SR"); searchingForNonPlayers = true;
    if (synomymPresent(searchString, ["head referee", "head ref"])) conditions.push("HR"); searchingForNonPlayers = true;
    if (synomymPresent(searchString, ["referee", "ref"])) conditions.push("Referee"); searchingForNonPlayers = true;
        
    if (synomymPresent(searchString, ["first aid", "medic"])) conditions.push("First_Aid"); searchingForNonPlayers = true;
    if (synomymPresent(searchString, ["snitche", "snitch"])) conditions.push("Snitch"); searchingForNonPlayers = true;
    
    //Search the remaining words for names
    var searchStringWords = searchString.text.split(" ");
    for (var i = 0; i < searchStringWords.length; i++)
    {
        if(searchStringWords[i].trim() != "") 
            conditions.push("Name_" + searchStringWords[i]);
    }
    
    console.log(conditions);
    
    filterRecords(conditions);
}

function filterRecords(conditions)
{
    //Clear visible records
    visibleRecords = [];
    
    //Go through each record
    for (var i = 0; i < records.length; i++)
    {
        var record = records[i];
        
        //Check each condition
        if ((contains(conditions,"Brizzlebears") || contains(conditions,"Brizzlebees")) && !contains(conditions,record["Team"]) ) continue;
        if (contains(conditions,"Keeper") && !record["Keeper"]) continue;
        if (contains(conditions,"Chaser") && !record["Chaser"]) continue;
        if (contains(conditions,"Beater") && !record["Beater"]) continue;
        if (contains(conditions,"Seeker") && !record["Seeker"]) continue;
        if (contains(conditions,"AR") && !record["AR_Qualified"]) continue;
        if (contains(conditions,"SR") && !record["SR_Qualified"]) continue;
        if (contains(conditions,"HR") && !record["HR_Qualified"]) continue;
        if (contains(conditions,"Referee") && !(record["AR_Qualified"] || record["SR_Qualified"] || record["HR_Qualified"])) continue;
        if (contains(conditions,"First_Aid") && !record["First_Aid_Trained"]) continue;
        if (contains(conditions,"Snitch") && !record["Snitch"]) continue;
        
        //Search for names
        var nameConditions = conditions.filter(isNameCondition);
        var nameConditionViolated = false;
        for (var j = 0; j < nameConditions.length; j++)
        {
            var name = nameConditions[j].split("_")[1];
            var number = parseInt(name);
            if (number && record["Shirt"] == number) continue;
            nameConditionViolated = (!contains(record["First_Name"].toLowerCase(), name) && !contains(record["Last_Name"].toLowerCase(), name));
        }
        if (nameConditionViolated) continue;
        
        visibleRecords.push(record);
    }
    
    updateContent();
}

function isNameCondition(condition)
{
    return condition.indexOf("Name_") != -1;
}

function synomymPresent(s, x) 
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
function contains(s, x) { return s.indexOf(x) != -1 }