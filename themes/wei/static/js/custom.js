
window.onload = function (){
    var group = document.getElementById("ddChapterGroup")
    var trigger = document.getElementById("ddChapter")
    var list = document.getElementById("chapterList")
    
    trigger.addEventListener("touchstart", function(){
        list.style.visibility = (list.style.visibility == "hidden")
            ? "visible" 
            : "hidden"
        //list.style.visibility = "visible"
    })
    group.addEventListener("mouseover", function(){
        list.style.visibility = "visible"
    })
    group.addEventListener("mouseout", function(event){
        list.style.visibility = "hidden"
    })
    
}

function toggleChapterDropdown(visible){
    var element = document.getElementById("chapterList")
    if (visible == null){
        console.log(element.style.visibility)
        element.style.visibility = (element.style.visibility == "hidden")
            ? "visible" 
            : "hidden"
        console.log(element.style.visibility)
        console.log("-----------")
    } else {
        element.style.visibility = visible ? "visible" : "hidden"
    }
    
}

