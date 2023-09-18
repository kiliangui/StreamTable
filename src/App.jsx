import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Page from './components/page';
import LoginPage from './components/loginModal';
import { auth } from './utils/firebase';
import Dashboard from './components/dashboard';
import { signOut } from 'firebase/auth';


function App() {
  // Local Gestion
  let loc = window.location.pathname.split("/")
  
  const [user, setUser] = useState(null)
  const [region,setRegion] = useState("fr")
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
        "GoToPage" : "Voir la page" 
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
        "GoToPage" : "Go to page" 
    }
}
useEffect(()=>{
  auth.onAuthStateChanged((user)=>{
    setUser(user)
  })

  
},[])


const [lang,setLang] = useState(langs)
useEffect(()=>{
    setLang(langs[region])
    setNavbar(<><li><a href='/' className="btn" id="loginBtn">{ langs[region].CreatePage }</a></li>
    {/*<li><a href="contact.html">{ langs[region].Contact }</a></li>*/}<li><a className='btn emoji' onClick={()=>{
      region == "fr" ? setRegion("us") : setRegion("fr")
    }}>{region == "fr" ? "🇺🇸" : "🇫🇷" }</a></li></>)
    const lang  = langs[region]

    //switch navBar
    switch (loc[1]) {
      case "":
        if (user){
          addNav(<>{user && user["displayName"] != null ? <a href={'/u/'+(user["displayName"]? user["displayName"].replace(" ","_"):"") }>{lang["GoToPage"]}</a>:<></>}</>,<>{user ? <a onClick={()=>{
            signOut(auth)
          }}>Logout</a>:<></>}</>)
        }else{
          auth.onAuthStateChanged((user)=>{
            addNav(<>{user && user["displayName"] != null ? <a href={'/u/'+(user["displayName"]? user["displayName"].replace(" ","_"):"") }>{lang["GoToPage"]}</a>:<></>}</>,<>{user ? <a onClick={()=>{
              signOut(auth)
            }}>Logout</a>:<></>}</>)
          })
        }
          
        break;
      case "u":
        addNav(<><li><a href='/' className="btn" id="loginBtn">{ langs[region].CreatePage }</a></li></>)
        break;
      default:
        break;
    }
  },[region])

  const [navbar,setNavbar] = useState(<></>)
  function addNav(leftElems,RightElems,keep=true){
    console.log(navbar);
    if (keep){
      setNavbar(<>{leftElems}{/*<li><a href='/' className="btn" id="loginBtn">{ langs[region].CreatePage }</a></li>*/}
      
    {/* <li><a href="contact.html">{ langs[region].Contact }</a></li>*/}{RightElems}<li><a className='btn emoji' onClick={()=>{ 
      region == "fr" ? setRegion("us") : setRegion("fr")
    }}>{region == "fr" ? "🇺🇸" : "🇫🇷" }</a></li></>)
    }else{
      setNavbar(<>{RightElems}</>)
    }
    
    
  }

  return (
    <>
       
    <h1>StreamTable</h1>
    <main className="glass">
      {loc[1] == "u"? 
        <Page region={region} loc={loc} /> :
        loc[1] == ""  ? (user ? <Dashboard loc={loc} region={region} user={user}/> : <LoginPage setUser={setUser}/> ) : <><h1>NotFound</h1></>
        }
    </main>

    
    <div id="navbar" className="glass">
        <ul>
          {navbar}
        </ul>
    </div>
    

    </>
  )
}

export default App
