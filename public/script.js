
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
console.log("script loaded");
const linkMenu = document.getElementById("linkMenu");
const icon = linkMenu.getElementsByTagName("span")[0]
const list = document.querySelector(".menu ul")
const items = list.getElementsByTagName("li")
linkMenu.addEventListener("click",async ()=>{
    
    
    
    
    if (!list.classList.contains("open")){
        
        list.classList.toggle("open")
        // await sleep(1500)
        icon.innerText = "close"
        for (const item of items) {
            await sleep(100)
            item.classList.add("open")
        }
    }else{
        for (const item of items) {
            item.classList.remove("open")
            await sleep(100)
        }
        await sleep(750)
        list.classList.toggle("open")
        icon.innerText = "expand_more"
        
    }
    
    
})