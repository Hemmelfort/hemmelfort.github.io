

//导航栏上的“文章分类”按钮
const ChapterListDropdown = {
    locked: false,      //调试用，保持下拉状态
    fadeTimer: null,    //用于淡出的定时器
    group: null,        //ddChapterGroup
    list: null,         //chapterList
    
    show(){
        if (this.fadeTimer){
            clearInterval(this.fadeTimer)
            this.fadeTimer = null
        }
        this.list.style.opacity = 1
        this.list.style.visibility = 'visible'
    },
    startFadeOut(duration=200){
        this.cancelFadeOut()
        
        let currentOpacity = 1
        const interval = 30 //ms
        const step = interval / duration
        this.fadeTimer = setInterval(() => {
            currentOpacity -= step
            if (currentOpacity <= 0){
                currentOpacity = 0
                clearInterval(this.fadeTimer)
                this.fadeTimer = null
                this.list.style.visibility = "hidden"
            }
            this.list.style.opacity = currentOpacity
        }, interval)
    },
    cancelFadeOut(resetOpacity=true){
        if (this.fadeTimer){
            clearInterval(this.fadeTimer)
            this.fadeTimer = null
            if (resetOpacity){
                this.list.style.opacity = 1
                this.list.style.visibility = 'visible'
            }
        }
    },
    
    init(){
        this.group = document.getElementById("ddChapterGroup")   //div组，含链接与下拉
        this.list = document.getElementById("chapterList")

        this.group.addEventListener("mouseover", (e) => {
            if (!this.locked && this.list.style.visibility != "visible"){
                this.show()
            }
        })
        this.group.addEventListener("mouseout", (e) => {
            if (!this.locked && this.list.style.visibility != "hidden" && e.relatedTarget?.parentElement != this.group && e.relatedTarget?.parentElement != this.list){
                this.startFadeOut()
            }
        })
    }
}

ChapterListDropdown.init()

//用于在命令行调试“文章分类”下拉菜单
function toggleChapterDropdown(visible) {
    let element = document.getElementById("chapterList")
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

