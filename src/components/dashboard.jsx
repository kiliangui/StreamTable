import {collection, getDocs, getDoc, query, where, limit, Timestamp, doc, setDoc, updateDoc } from "firebase/firestore";
import {auth, db, pagesRef} from "../utils/firebase"
import { useEffect, useState } from "react"
import "./Dashboard.css"
import { Link } from "./Edits";

export default function Dashboard({addNav,loc,region,user}){
    const langs = {
        "fr" : {
            "CreatePage" : "Crée ta page",
            "Contact" : "Contact",
            "NextStreams" : "Prochains streams",
            "GoToStream" : "Aller au live",
            "Now" : "LIVE",
            "Today" : "Aujourd'hui",
            "StartIn" : "Commence dans : ",
            "StopIn" : "Fini dans : ",
            "NotifyMe" : "Activer le rappelle !"
        },
        "us" : {
            "CreatePage" : "Create your page",
            "Contact" : "Contact",
            "NextStreams" : "Next streams",
            "GoToStream" : "Go to live",
            "Now" : "LIVE",
            "Today" : "Today",
            "StartIn" : "Start in : ",
            "StopIn" : "Stop in :",
            "NotifyMe" : "Notify me !"
        }
    }
    const [loading, setLoading] = useState(true)
    
    const [lang,setLang] = useState(langs)
    useEffect(()=>{
        setLang(langs[region])
      },[region])
      // Data gestion
  const [streams,setStreams] = useState([])
  const [pseudo, setPseudo] = useState("")
  const [background, setBackground] = useState("")
  const [links, setLinks] = useState([])
  const [pdp, setPdp] = useState("")
  const [slug, setslug] = useState("")

  const [edited,setEdited] = useState(false)
  const [editPseudo, setEditPseudo] = useState(false)
  
  const getItem =(uid,name,url)=>{
    console.log("parent :", uid,name,url);
    setLinks(links.map((elem)=>{
      if (elem["uid"] == uid){
        const monE = {}
        console.log("name : ",name);
        monE[name] = url
        monE["uid"] = uid
        return {...monE}
      }else{
        return elem
      }
    }))
  }
  function save(getSave){
   
  }
  
  useEffect(()=>{
    console.log("edited");
    addNav(<><a style={{color:"red"}} href="">Cancel</a></>)
  },[edited])
  useEffect(()=>{
    //Getting Page
    if (loc[1] == "m"){
        const document = doc(db,"pages",user.uid)
        getDoc(document).then((res)=>{
          console.log("GET DOC");
            if (res.exists()){
                let data = res.data()
                setBackground(data.background)
                      
                      setLinks(data.links.map((elem)=>{
                        console.log("elem",{...elem});
                        const uid = crypto.randomUUID()
                        return {...elem, uid}
                      }))
                      setPseudo(data.pseudo)
                      //Getting Streams
                      let streamsRef = collection(db,"/pages/"+doc.id+"/streams")
                      const q = query(streamsRef,where("date_fin", ">=", new Date()),limit(14))
                      getDocs(q).then((QuerySnapshots)=>{
                        let newStreams = []
                        QuerySnapshots.forEach((doc)=>{
                          if (doc.id != streams.map((e)=>e.id)){
                            let data = doc.data()
                            data["id"] = doc.id;
                            newStreams.push({...data})
                          }
                        })
                        if (newStreams != streams){
                          setStreams([...streams,...newStreams])
    
                        }else{
                          console.log("no new streams");
                        }
                      })
            }else {//doc don't exist
                setDoc(document,{
                    "background" : "",
                    "links" : [],
                    "pseudo" : "pseudo",
                    "slug" : ""
                })
                setBackground("")
                setLinks([])
                //setPseudo("pseudo")
                setStreams([])
                setPdp("")
            }
            
        })

      }
    
            addNav(<><a>Voir la page</a></>,<></>,true)
    
  },[])
    return <>
    <section className="menu">
    <a style={{backgroundColor:"green"}} onClick={()=>{
      const document = doc(db,"pages",user.uid)
      console.log("pseudo",pseudo);
      updateDoc(document,{
        "background": background,
        "links": links.map((elem)=>{ // Remove uid
          const key = Object.keys(elem)[0]
          const value = elem[key]
          return {"name": key,
          "url":value}
        }),
        "pseudo":pseudo,
        slug:""
  
      }).then((res)=>{
        console.log("success", res);
      }).catch((err)=>{
        console.log("err : ", err);
      })
    }} >Save</a>

    <div>
        <img id="pdp" src={pdp? pdp : "/vite.svg"} alt="Streamer pdp"/>
        <div className="edit">
          {/** TODO : Change to component */}
            {editPseudo? 
            <input value={pseudo} onChange={(event)=>{setPseudo(event.target.value);console.log(pseudo);}} type="text" name="pseudo" id="pseudo" />
         : 
         <><h2>{pseudo !=""? pseudo : "Your pseudo"}</h2><a onClick={()=>{setEditPseudo(true), 
          setEdited(true)}} className="editBtn" style={{display:"inline"}}>edit</a></>
          }
            </div>
    </div>
    <button className="btn" id="linkMenu"><p></p><p>links</p><span className="material-symbols-outlined">
        expand_more
        </span></button>
    <ul>
      {

        links.map((obj)=>{
          //const obj = links[index]
          console.log(obj);
          
          console.log("links",links);
          const link = obj["url"] // Obj of key:value,uuid,value
          const key = obj["name"]
          console.log(key,link);
          const uid = obj["uid"]
          return <Link key={key} name_={key} link={link} uid={uid} setEdited={setEdited} getItem={getItem} />;
          
          
          
          // <li key={key}><a  href={link}>{key}</a><a onClick={(event)=>{
          //   const a = event.target.parentElement.getElementsByTagName("a")[0]
          //   const input = event.target.parentElement.getElementsByTagName("input")[0]
          //   a.classList.add("hidden")
          //   input.classList.remove("hidden")

          // }} className="edit">edit</a> <input className="hidden"  value={pseudo} onChange={(event)=>{setPseudo(event.target.value)}} type="text" name="pseudo" id="pseudo" />
          // </li>
        })
      }
      <li key={"new"}><a onClick={()=>{
        setLinks([...links, {"key": "", "url" : ""}  ])
      }}><span  className="material-symbols-outlined">Add</span>Add a link</a></li>
        
    </ul>
</section>
<section className="next">
    
    <ul>
        <h3>{lang.NextStreams}</h3>
        {streams.map((stream)=>{
          let date_fin = stream.date_fin.toDate()
          let date_debut = stream.date_debut.toDate()
          let now = new Date()
          let timeDif;
          let started=false;
          
          if (date_debut < now){
            started = true;
            timeDif = date_fin - now
          }else {
            timeDif = date_debut - now
          }
          stream.started = started
          const getMinutes = (seconds) => Math.floor(seconds/60/1000)
          const getHours = (seconds) => Math.floor(getMinutes(seconds)/60)
          const getDay = (seconds) => Math.floor(getHours(seconds)/24)

          const day = getDay(timeDif)
          timeDif = timeDif-day*24*60*60*1000;
          const hours = getHours(timeDif) 
          timeDif = timeDif-hours*60*60*1000;
          const minutes = getMinutes(timeDif)
          if (day){

          }else if( hours < 23 ){
              stream.timeDif = hours+"h"+minutes
          }

          return <li key={stream.id} className="card">
          <img src={stream.img} alt=""/>
          <div className="content">
              <div className="title">
                  <h4>{ stream.category }</h4>
                  {stream.started ? <span className="badge">{ lang.Now }</span> : 
                  <span>Notif</span>}
              </div>
              <div>
                  <p>
                      22h30 - 01h45
                  </p>
                  <p>{stream.started ? lang.StopIn : lang.StartIn } {stream.timeDif}</p>
              </div>
              {stream.started ? 
              <a href={stream.url} className="btn">{lang.GoToStream}</a>
              :
              <a href={""} className="btn">{lang.NotifyMe}</a>
        }
          </div>
      </li>
        })}
        
    </ul>
</section>
{!loading ? <script src="/dashboard.js" defer>
    
    </script>:<></>}

    </>
}