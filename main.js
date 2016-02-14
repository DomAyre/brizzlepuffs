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