import { collection, getDocs, getDoc, query, where, limit, Timestamp, doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, pagesRef, storage } from "../utils/firebase"
import { signOut, updateCurrentUser, updateProfile} from "firebase/auth"
import { useCallback, useEffect, useState } from "react"
import "./Dashboard.css"
import { Link } from "./Edits";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


export default function Dashboard({ addNav, loc, region, user, slug,setSlug }) {
  const langs = {
    "fr": {
      "CreatePage": "Crée ta page",
      "Contact": "Contact",
      "NextStreams": "Prochains streams",
      "GoToStream": "Aller au live",
      "Now": "LIVE",
      "Today": "Aujourd'hui",
      "StartIn": "Commence dans : ",
      "StopIn": "Fini dans : ",
      "NotifyMe": "Activer le rappelle !"
    },
    "us": {
      "CreatePage": "Create your page",
      "Contact": "Contact",
      "NextStreams": "Next streams",
      "GoToStream": "Go to live",
      "Now": "LIVE",
      "Today": "Today",
      "StartIn": "Start in : ",
      "StopIn": "Stop in :",
      "NotifyMe": "Notify me !"
    }
  }
  
  // Data gestion
  const [streams, setStreams] = useState([])
  const [pseudo, setPseudo] = useState("")
  const [background, setBackground] = useState("")
  const [links, setLinks] = useState([])
  const [pdp, setPdp] = useState("")


  console.log(links);

  const [edited, setEdited] = useState(false)
  const [editPseudo, setEditPseudo] = useState(false)

  // handle region
  const [lang, setLang] = useState(langs)
  useEffect(() => {
    setLang(langs[region])
  }, [region])

  //function to get data from Link components
  const getItem = (uid, name, url) => {
    console.log("parent :", uid, name, url);
    setEdited(true)
    setLinks(links.map((elem) => { // Todo : use a filter instead of a map
      if (elem["uid"] == uid) {
        const monE = {}
        monE["name"] = name
        monE["url"] = url
        monE["uid"] = uid
        return { ...monE }
      } else {
        return elem
      }
    }))
  }
  // Getting the page !
  useEffect(() => {
    // TODO move the data fetching to the App.jsx (DRY : page.jsx)
    // Getting pages data
    const document = doc(db, "pages", user.uid)
    getDoc(document).then((res) => {
      console.log("GET DOC");
      if (res.exists()) {
        let data = res.data()
        // updating data
        setBackground(data.background)
        setPdp(data.pdp)
        setLinks(data.links.map((elem) => {
          const uid = crypto.randomUUID()
          console.log("saving that : ", { "name" : elem["name"], "url" : elem["url"], "uid" : uid });
          return { "name" : elem["name"], "url" : elem["url"], "uid" : uid }
        }))
        setPseudo(data.pseudo)
        //Getting Streams
        let streamsRef = collection(db, "/pages/" + doc.id + "/streams")
        const q = query(streamsRef, where("date_fin", ">=", new Date()), limit(14))
        getDocs(q).then((QuerySnapshots) => {
          let newStreams = []
          QuerySnapshots.forEach((doc) => {
            if (doc.id != streams.map((e) => e.id)) {
              let data = doc.data()
              data["id"] = doc.id;
              newStreams.push({ ...data })
            }
          })
          if (newStreams != streams) {
            setStreams([...streams, ...newStreams])
          } else {
            console.log("no new streams");
          }
        })
      } else {//doc don't exist
        setDoc(document, {
          "background": "",
          "links": [],
          "pseudo": "pseudo",
          "slug": "",
          "pdp" : ""
        })
      }
    })
  }, [])

  // Function that save the document in firebase
  const save = ()=>{
    const document = doc(db, "pages", user.uid)
    console.log("pseudo", pseudo);
    updateDoc(document, {
      "background": background,
      "links": links.map((elem) => { // Remove uid
        const url = elem["url"]
        const name = elem["name"]
        return {
          "name": name,
          "url": url
        }
      }),
      "pseudo": pseudo,
      "pdp": pdp,
      "slug": pseudo.replace(" ","_")
    }).then(() => {
      setEdited(false)
      setEditPseudo(false)
    }).catch((err) => {
      console.log("err : ", err);
    })
    updateProfile(user,{
      displayName:pseudo
    }).then(()=>{
      console.log("user updated");
    })
  }
  


  return <>
    <section className="menu dashboard">
      
      <div>
        <div className="edit-img">
          <span className="material-symbols-outlined">
            Photo
            <input onChange={(event)=>{
              const pdpRed = ref(storage, 'pdp/'+user.uid+'.jpg');
              uploadBytes(pdpRed, event.target.files[0]).then((snapshot) => {
                console.log('Uploaded a blob or file!');
                getDownloadURL(pdpRed).then((url)=>{
                  
                  const document = doc(db, "pages", user.uid)
                  console.log("url", url);
                  setPdp(url)
                })
                
              });

            }} type="file" placeholder="Design in progress" />
          </span>
          <img id="pdp" src={pdp ? pdp : "/vite.svg"} alt="Streamer pdp" />
        </div>
        <div className="edit">
          {/** TODO : Change to component */}
          {editPseudo ?
            <input value={pseudo} onChange={(event) => { setPseudo(event.target.value); console.log(pseudo); }} type="text" name="pseudo" id="pseudo" />
            :
            <><h2>{pseudo != "" ? pseudo : "Your pseudo"}</h2><a onClick={() => {
              setEditPseudo(true),
              setEdited(true)
            }} className="editBtn" style={{ display: "inline" }}>edit</a></>
          }
        </div>
      </div>
      <button className="btn" id="linkMenu"><p></p><p>links</p><span className="material-symbols-outlined">
        expand_more
      </span></button>
      <ul>
        {
          links.map((obj) => {
            const key = obj["name"]
            return <Link key={key} name_={key} link={obj["url"]} uid={obj["uid"]} setEdited={setEdited} getItem={getItem} />;
          })
        }
        <li key={"new"}><a onClick={() => {
          setLinks([...links, { "key": "", "url": "" }])
        }}><span className="material-symbols-outlined">Add</span>Add a link</a></li>

      </ul>
    </section>
    <section className="next">

      <ul>
        <h3>{lang.NextStreams}</h3>
        <li className="btn" style={{backgroundColor:"red"}}>Work in progress<br/>La liste des streams n'est pas encore modifiable.</li>
        {streams.map((stream) => {
          let date_fin = stream.date_fin.toDate()
          let date_debut = stream.date_debut.toDate()
          let now = new Date()
          let timeDif;
          let started = false;

          if (date_debut < now) {
            started = true;
            timeDif = date_fin - now
          } else {
            timeDif = date_debut - now
          }
          stream.started = started
          const getMinutes = (seconds) => Math.floor(seconds / 60 / 1000)
          const getHours = (seconds) => Math.floor(getMinutes(seconds) / 60)
          const getDay = (seconds) => Math.floor(getHours(seconds) / 24)

          const day = getDay(timeDif)
          timeDif = timeDif - day * 24 * 60 * 60 * 1000;
          const hours = getHours(timeDif)
          timeDif = timeDif - hours * 60 * 60 * 1000;
          const minutes = getMinutes(timeDif)
          if (day) {

          } else if (hours < 23) {
            stream.timeDif = hours + "h" + minutes
          }

          return <li key={stream.id} className="card">
            <img src={stream.img} alt="" />
            <div className="content">
              <div className="title">
                <h4>{stream.category}</h4>
                {stream.started ? <span className="badge">{lang.Now}</span> :
                  <span>Notif</span>}
              </div>
              <div>
                <p>
                  22h30 - 01h45
                </p>
                <p>{stream.started ? lang.StopIn : lang.StartIn} {stream.timeDif}</p>
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
      <div className="confirmBtns">
        <a style={{ backgroundColor: edited ? "green" : "gray", cursor: edited ? "pointer" :"unset" }}
        onClick={() => {save()}}>Save</a> </div>
    </section>


  </>
}