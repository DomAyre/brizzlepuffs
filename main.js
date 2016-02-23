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
    scalePage();
});

function scalePage()
{
    //Make the content occupy a greater proportion of the screen as it gets smaller
    var pivotalWidth = 1600;
    var x = Math.max((pivotalWidth - $(window).width()), 0) / pivotalWidth;  
    var contentWidth = 70+(x*20);      
    $(".centered").css({"width": contentWidth + "%"});       
    
    //Set the padding size
    var paddingPercentage = (100 - contentWidth)/2;
    var paddingPixels = (paddingPercentage/100*$(window).width());
    $(".padding").css({"width": paddingPixels + "px"});  
}