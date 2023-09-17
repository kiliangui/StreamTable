import { useEffect, useState } from "react"

export function Link({name_,link,setEdited,uid, getItem}){
    const [edit, setEdit] = useState(false)
    //console.log("key :",name_);
    useEffect(()=>{
      setEdited(true)
    },[edit])
    const [url, setUrl] = useState(link)
    const [name, setName] = useState(name_)
    useEffect(()=>{//sync changes with parent
      getItem(uid,name,url)
    },[url,name])
    return <li>{!edit ? <>
    <a href={link}>{name}</a>
    <a onClick={()=>setEdit(true)} className="edit">edit</a>
    </>: <>
      <input placeholder="name"  defaultValue={name} onBlur={(event)=>{setName(event.target.value)}} type="text" name="name" />
      <input  placeholder="url" defaultValue={url} onBlur={(event)=>{setUrl(event.target.value)}} type="text" name="url" />
      
      </> }</li>
}