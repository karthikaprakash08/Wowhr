// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSilV32GiHq9b_Qa0Ow1N7_m04O8Dfcmw",
  authDomain: "wowhr-card.firebaseapp.com",
  databaseURL: "https://wowhr-card-default-rtdb.firebaseio.com",
  projectId: "wowhr-card",
  storageBucket: "wowhr-card.appspot.com",
  messagingSenderId: "1036430787377",
  appId: "1:1036430787377:web:80ab08c07f26cd07fae610"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;