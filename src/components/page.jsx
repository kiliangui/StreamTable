import {collection, getDocs, getDoc, query, where, limit, Timestamp } from "firebase/firestore";
import {db, pagesRef} from "../utils/firebase"
import { useEffect, useState } from "react"
import "./Page.css"

export default function Page({loc,region,addNav}){
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
            "NotifyMe" : "Activer le rappelle !",
            "Days" : "jours"
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
            "NotifyMe" : "Notify me !",
            "Days" : "days"
        }
    }

    
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

  useEffect(()=>{
    // TODO move the data fetching to the App.jsx (DRY : dashboard.jsx)
    //Getting Page
    if (loc[1] == "u"){ // checking if we are on the good page
      const q = query(pagesRef,where("slug", "==", loc[2]),limit(1))
      getDocs(q).then((QuerySnapshots)=>{
          if (QuerySnapshots.size == 1){
              QuerySnapshots.forEach((doc)=>{
                  console.log("1 doc trouvé : ",doc);
                  let data = doc.data()
                  setBackground(data.background)
                  setLinks(data.links)
                  setPseudo(data.pseudo)
                  setPdp(data.pdp)
                  //Getting Streams
                  console.log("/pages/"+doc.id+"/streams");
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
              })
          }else {
              
          }
        })
      }
    
            
    
  },[])
    return <>
    <section className="menu">
          

    <div>
        <img id="pdp" src={pdp} alt="Streamer pdp"/>
        <h2>{pseudo}</h2>

    </div>
    <button className="btn" id="linkMenu"><p></p><p>links</p><span className="material-symbols-outlined">
        expand_more
        </span></button>
    <ul>
      {

        links.map((link)=>{
          let url = link["url"]
          let name = link["name"]
          return <li key={url}><a href={url}>{name}</a></li>
        })
      }
        
    </ul>
</section>
<section className="next">
    
    <ul>
        <h3>{lang.NextStreams}</h3>
        {streams.map((stream)=>{
          let date_fin = stream.date_fin.toDate()
          let date_debut = stream.date_debut.toDate()
          let timeDif;
          // check if the stream is live
          const now = new Date()
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
          // prepare stream in : ...h/days
          const day = getDay(timeDif)
          timeDif = timeDif-day*24*60*60*1000;
          if (day){
              stream.timeDif = day+" "+lang["Days"]
          }else{
            const hours = getHours(timeDif) 
            timeDif = timeDif-hours*60*60*1000;
            if( hours < 23 ){
              stream.timeDif = hours+"h"+minutes
            }
          } 
          return <li key={stream.id} className="card">
                  <img src={stream.img} alt=""/>
                  <div className="content">
                      <div className="title">
                          <h4>{ stream.category }</h4>
                          {stream.started ? 
                          <span className="badge">{ lang.Now }</span> 
                          : 
                          <span className="material-symbols-outlined" style={{padding:"0.2rem", fontSize:"large", cursor:"pointer"}} 
                          onClick={()=>{Notification.requestPermission()}}>notifications</span>}
                      </div>
                      <div>
                          <p>{stream.started ? lang.StopIn : lang.StartIn } {stream.timeDif}</p>
                          <p>{date_debut.getHours()}h{date_debut.getMinutes()} - {date_fin.getHours()}h{date_fin.getMinutes()}</p>
                      </div> 
                      <a href={stream.url} className="btn">{lang.GoToStream}</a>
                  </div>
              </li>
        })}
        
    </ul>
</section>
    </>
}