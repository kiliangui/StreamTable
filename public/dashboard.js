console.log("loaded");


const edits = document.getElementsByClassName("edit")
console.log(edits);
for (const editElt of edits) {
    const editBtn = editElt.getElementsByClassName("editBtn")[0]
    editBtn.addEventListener("click",(event)=>{
        console.log("clicked");
    })
}