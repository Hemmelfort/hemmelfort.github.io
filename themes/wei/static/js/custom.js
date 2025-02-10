
//导航栏上的“文章分类”按钮的响应
window.onload = function () {
    var group = document.getElementById("ddChapterGroup")   //div组，含链接与下拉
    var trigger = document.getElementById("ddChapter")      //“文章分类”链接
    var list = document.getElementById("chapterList")

    //触摸动作的响应
    trigger.addEventListener("touchstart", function () {
        list.style.visibility = (list.style.visibility == "hidden")
            ? "visible"
            : "hidden"
    })
    //鼠标的响应
    group.addEventListener("mouseover", function () {
        list.style.visibility = "visible"
    })
    group.addEventListener("mouseout", function (event) {
        list.style.visibility = "hidden"
    })

}

//用于在命令行调试“文章分类”下拉菜单
function toggleChapterDropdown(visible) {
    var element = document.getElementById("chapterList")
    if (visible == null) {
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

