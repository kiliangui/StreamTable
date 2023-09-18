import { useState } from "react"
import "./Login.css"
import { auth } from "../utils/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
export default function LoginPage({setUser}){


    return <section id="loginPage" className="menu">
          <Login setUser={setUser}/>
          <Create setUser={setUser}/>
</section>
}

function Login({setUser}){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    return <div>
            <h2>Login</h2>
            <form onSubmit={(event)=>{
                event.preventDefault()
                signInWithEmailAndPassword(auth,email,password).then((userCredential)=>{
                    const user = userCredential.user
                    setUser(user)
                })
                console.log("form submitted");
            }}>
            <div>
                <label htmlFor="loginMail">Email</label>
                <input placeholder="Email" onChange={(event)=>{
                    setEmail(event.target.value)
                }} value={email} type="email" name="email" id="loginMail" />
            </div>
            <div>
                <label htmlFor="passwordLogin">Password</label>
                <input placeholder="Password" onChange={(event)=>{
                    setPassword(event.target.value)
                }} value={password} type="password" name="password" id="passwordLogin" />
            </div>
            <button type="submit" className="btn">Submit</button>
            </form>
          </div>
}


function Create({setUser}){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password_c, setPassword_c] = useState("")
    return <div>
            <h2>Create an account</h2>
            <form onSubmit={(event)=>{
                event.preventDefault()
                if (password == password_c){
                    createUserWithEmailAndPassword(auth,email,password).then((userCredential)=>{
                        const user = userCredential.user
                        setUser(user)
                    })
                }
                console.log("form submitted");
            }}>
            <div>
                <label htmlFor="createMail">Email</label>
                <input placeholder="Email" onChange={(event)=>{
                    setEmail(event.target.value)
                }} value={email} type="email" name="email" id="createMail" />
            </div>
            <div>
                <label htmlFor="passwordCreate">Password</label>
                <input placeholder="Password" onChange={(event)=>{
                    setPassword(event.target.value)
                }} value={password} type="password" name="password" id="passwordCreate" />
            </div>
            <div>
                <label htmlFor="password_cCreate">Password confirmation</label>
                <input placeholder="Password confirmation" onChange={(event)=>{
                    setPassword_c(event.target.value)
                }} value={password_c} type="password" name="password_c" id="password_cCreate" />
            </div>
            <button type="submit" className="btn">Submit</button>
            </form>
          </div>
}