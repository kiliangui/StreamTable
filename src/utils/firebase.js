import { initializeApp } from "firebase/app";
import { getFirestore,collection, getDocs, getDoc, query, where, limit, connectFirestoreEmulator } from "firebase/firestore";
import {connectAuthEmulator, getAuth} from "firebase/auth"
// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEUw9XOCFCtop2tPaKtWdcJKTjWb9FGMA",
  authDomain: "streamtable-ba01c.firebaseapp.com",
  projectId: "streamtable-ba01c",
  storageBucket: "streamtable-ba01c.appspot.com",
  messagingSenderId: "792357112932",
  appId: "1:792357112932:web:8df057858bcf96ea17e371",
  measurementId: "G-06SKNJLP86"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
//connectFirestoreEmulator(db, '127.0.0.1', 8080);

export const auth = getAuth()
//connectAuthEmulator(auth,"http://127.0.0.1:9099")

export const pagesRef = collection(db, "/pages");
