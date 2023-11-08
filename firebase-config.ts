// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhtJ-U26qJnOOX8ferlLuM_g5z3XjDgok",
  authDomain: "iths-crossplatform-da141.firebaseapp.com",
  projectId: "iths-crossplatform-da141",
  storageBucket: "iths-crossplatform-da141.appspot.com",
  messagingSenderId: "96891758109",
  appId: "1:96891758109:web:6de78fbffb9560468a88f4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);



export const db = getFirestore()
