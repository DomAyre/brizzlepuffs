"use strict";
addEventListener("load", start);
var buttonsClicked = false;

//The elements of the page
var layout, content, scrollButtons, scrollViewers, centeredElements, paddingElements, background;

//The parameters of the page
var maxWindowWidth = 1600, minContentPerc = 70, maxContentPerc = 90;
var diffContentPerc = maxContentPerc - minContentPerc;
var backgroundHeight;
var parallax = 0.3;

function start()
{
    //Get the elements of the page
    layout = document.querySelector(".mdl-layout")
    content = document.querySelector(".mdl-layout__content");
    scrollButtons = document.querySelectorAll(".horizontal-button");
    scrollViewers = document.querySelectorAll(".horizontal-scrollviewer");
    centeredElements = document.querySelectorAll(".centered");
    paddingElements = document.querySelectorAll(".padding");
    background = document.querySelector("#background");
    
    //Scale the page
    scalePage();
    
    //Set the listener to scale page if window is resized
    window.addEventListener("resize", scalePage);
    
    //Set scroll listeners for the two modes of the page
    layout.addEventListener("scroll", scrollBackground);
    content.addEventListener("scroll", scrollBackground); 
    
    //Set click listener for scroll buttons
    for (var i = 0; i < scrollButtons.length; i++)
    {
        scrollButtons[i].addEventListener("click", scrollHorizontally);
    }   
    
    //Add scroll listeners to show/hide the buttons
    for (var i = 0; i < scrollViewers.length; i++)
    {
        scrollViewers[i].addEventListener("scroll", scrolling);
    }
    
    //Set all youtube thumbnails
    $(".youtube").each(function() 
    {
        //Set the thumbnail image
        $(this).css('background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');
    
        // Overlay the Play icon to make it look like a video player
        $(this).append($('<div/>', {'class': 'play'}));
    
        $(document).delegate('#'+this.id, 'click', function() 
        {                        
            // Create an iFrame with autoplay set to true
            var iframe_url = "https://www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1";
            if ($(this).data('params')) iframe_url+='&'+$(this).data('params');
    
            //Define the HTML for the iframe
            var iframe = "<iframe src='" + iframe_url + "' class='video' frameborder='0'  allowfullscreen='true'></iframe>";
    
            // Replace the YouTube thumbnail with YouTube HTML5 Player
            this.innerHTML = iframe;
        });
    });

}

function showHideButtons(type, buttons, visbility)
{
    var hiddenButtons = document.querySelectorAll("input[name=" + type + "], " + buttons);
    for (var i = 0; i < hiddenButtons.length; i++)
    {
        if (hiddenButtons[i].name == type)
            hiddenButtons[i].style.visibility = visbility;   
    }
}

function scrolling(event)
{    
    //Get which buttons to check for
    var type = event.target.id.split("-")[0];
    
    if (buttonsClicked == false)
    {
        showHideButtons("fixture", ".horizontal-button", "Hidden");
        showHideButtons("squad", ".horizontal-button", "Hidden");
        showHideButtons("media", ".horizontal-button", "Hidden");
        return;
    }
    
    var distFromStart = event.target.scrollLeft;
    var distFromEnd = (event.target.scrollWidth - $(event.target).outerWidth() - event.target.scrollLeft);
    
    //If you're at the start
    if(distFromStart <= 0) { showHideButtons(type, ".backwards", "Hidden"); }
    else { showHideButtons(type, ".backwards", "Visible"); }
        
    //If you're at the end
    if(distFromEnd <= 0) { showHideButtons(type, ".forwards", "Hidden"); }
    else { showHideButtons(type, ".forwards", "Visible"); }
}

function scrollHorizontally(event)
{
    //Set that the buttons have been used
    buttonsClicked = true;
    
    //Construct the scrollviewer name
    var scrollName = "#" + event.target.parentElement.name + "-scrollviewer";
        
    //Get the parent of the button
    var parent = document.querySelector(scrollName);
    
    //Work out how much to scroll by
    var scrollAmount = $(parent).outerWidth() * 0.6;
    
    //Check if you should scroll backwards
    if ($(event.target.parentElement).hasClass("backwards"))
        scrollAmount *= -1;    
    
    //Scroll appropriately
    $('html, ' + scrollName).animate(
    {
        scrollLeft: parent.scrollLeft + scrollAmount
    }, 250);
}

function scrollBackground(event)
{   
    //Get the amount that has been scrolled
    var scrolled = event.target.scrollTop;
    var backgroundScroll = scrolled*parallax;
    
    //Scroll the background
    if (backgroundScroll-25 <= backgroundHeight)
    {
        $(".background").css("background-position", "0" + -backgroundScroll + "px");
    }
}

function scalePage()
{        
    //Work out the proportion of the max width the window is
    var windowWidthPercentage = Math.max(maxWindowWidth - window.innerWidth, 0) / maxWindowWidth;
        
    //Work out what proportion of the screen content should occupy at the given size
    var contentWidthPercentage = minContentPerc + (diffContentPerc * windowWidthPercentage);
    var contentWidthPixels = contentWidthPercentage/100 * window.innerWidth;
    
    //Find all elements which are centered and set their width
    for (var i = 0; i < centeredElements.length; i++)
    {
        centeredElements[i].style.width = contentWidthPercentage + "%";
    }
    
    //Set the width of all padding elements
    for (var i = 0; i < paddingElements.length; i++)
    {
        paddingElements[i].style.width = (window.innerWidth - contentWidthPixels)/2 - 5 + "px";
    }
    
    //Set the height of the background
    if (background != null) background.style.height = background.offsetWidth/ 5.12 + "px";
    backgroundHeight = background.style.height.split("px")[0];
}