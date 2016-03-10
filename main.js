"use strict";
addEventListener("load", start);

function start()
{
    //Scale the page
    scalePage();
    
    //Set the listener to scale page if window is resized
    window.addEventListener("resize", scalePage);
    
    //Set scroll listeners for the two modes of the page
    var layout = document.querySelector(".mdl-layout"), content = document.querySelector(".mdl-layout__content");
    layout.addEventListener("scroll", scrollBackground);
    content.addEventListener("scroll", scrollBackground); 
    
    //Set click listener for scroll buttons
    var scrollButtons = document.querySelectorAll(".horizontal-button");
    for (var i = 0; i < scrollButtons.length; i++)
    {
        scrollButtons[i].addEventListener("click", scrollForwards);
    }   
}

function scrollForwards(event)
{
    //Construct the scrollviewer name
    var scrollName = "#" + event.target.parentElement.name + "-scrollviewer";
    var itemName = "." + event.target.parentElement.name + "-item";
        
    //Get the parent of the button
    var parent = document.querySelector(scrollName);
    
    //Work out how much to scroll by
    var scrollAmount = $(itemName).outerWidth() + 34;
    
    //Scroll appropriately
    $('html, ' + scrollName).animate(
    {
        scrollLeft: parent.scrollLeft + scrollAmount
    }, 250);

}

function scrollBackground(event)
{   
    //Get the layout
    var layout = event.target;
    
    //Get the background
    var background = document.querySelector("#background");
    
    //Scroll the background
    background.style.marginTop = (-(layout.scrollTop)/2) + "px";
}

function scalePage()
{    
    //Define the max window width and the min/max content proportion
    var maxWindowWidth = 1600, minContentPerc = 70, maxContentPerc = 90;
    var diffContentPerc = maxContentPerc - minContentPerc;
    
    //Work out the proportion of the max width the window is
    var windowWidthPercentage = Math.max(maxWindowWidth - window.innerWidth, 0) / maxWindowWidth;
        
    //Work out what proportion of the screen content should occupy at the given size
    var contentWidthPercentage = minContentPerc + (diffContentPerc * windowWidthPercentage);
    var contentWidthPixels = contentWidthPercentage/100 * window.innerWidth;
    
    //Find all elements which are centered and set their width
    var centeredElements = document.querySelectorAll(".centered");
    for (var i = 0; i < centeredElements.length; i++)
    {
        centeredElements[i].style.width = contentWidthPercentage + "%";
    }
    
    //Set the width of all padding elements
    var paddingElements = document.querySelectorAll(".padding");
    for (var i = 0; i < paddingElements.length; i++)
    {
        paddingElements[i].style.width = (window.innerWidth - contentWidthPixels)/2 - 25 + "px";
    }
}