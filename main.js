$(function() 
{    
    // Get the objects that receive scroll value
    var layout = $(".mdl-layout");
    var content = $(".mdl-layout__content");
    
    //Define the scrolling for both versions of the layout
    $(layout).scroll(function() 
    {
		$("#background").css({"margin-top": (-$(layout).scrollTop()/2) + "px"});        
    });
    
    $(content).scroll(function() 
    {
		$("#background").css({"margin-top": (-$(content).scrollTop()/2) + "px"});        
    });
    
});

$(window).resize(function() 
{
    //Make the content occupy a greater proportion of the screen as it gets smaller
    var pivotalWidth = 1600;
    var x = Math.max((pivotalWidth - $(window).width()), 0) / pivotalWidth;        
    $(".centered").css({"width": 70+(x*20) + "%"});       
});