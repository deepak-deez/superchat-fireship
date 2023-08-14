import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollection, useCollectionData} from 'react-firebase-hooks/firestore';
import { useRef, useState } from 'react';

firebase.initializeApp({
  //my config
  apiKey: "AIzaSyANW_WzgEFVycbV1CZiD50o8zRChYd3J0I",
  authDomain: "superchat-a06ef.firebaseapp.com",
  projectId: "superchat-a06ef",
  storageBucket: "superchat-a06ef.appspot.com",
  messagingSenderId: "639981466437",
  appId: "1:639981466437:web:822c113973e447fdd0c42c",
  measurementId: "G-B6E3DS4BHV"

})
const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header >
   
      </header>
      <section>
      
        {user? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}

export default App;

function SignIn(){
  const signInWithGoogle= ()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
  }
  return (
    <button onClick={signInWithGoogle}>SignIn with Google</button>
  )
}

function ChatRoom(){
  const dummy=useRef()
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);
  const [messages,error] = useCollectionData(query, {idField: 'id'})
  const [formValue , setFormValue] = useState('');
 
 const sendMessage = async(e) =>{
  e.preventDefault();
  const {uid , photoURL} = auth.currentUser;
  console.log("photo ", photoURL);
  await messageRef.add({
    text: formValue,
    createdAt : firebase.firestore.FieldValue.serverTimestamp(),
    uid,
    photoURL
  })

  setFormValue('');
  dummy.current.scrollIntoView({behavior: 'smooth'})
 }

  return (
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
   <div ref={dummy}></div>
   
    </main>
    
   <form onSubmit={sendMessage}>
    <input value={formValue} onChange={(e)=>setFormValue(e.target.value)}/>
    <button type='submit'>Submit</button>
   </form>
    <SignOut/>
    
    </>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={()=>auth.signOut()}>SignOut</button>
  )
}

function ChatMessage(props){
  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  console.log(photoURL);
  return(

  <div className={`message ${messageClass}`}>
    <img src={photoURL} />
     <p>{text}</p>
  </div>
)
}