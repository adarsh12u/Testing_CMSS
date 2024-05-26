// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWbm_NXKbmTrkbq5T9DUgeVTxS-w5P4gA",
  authDomain: "cmsss-8b6de.firebaseapp.com",
  projectId: "cmsss-8b6de",
  storageBucket: "cmsss-8b6de.appspot.com",
  messagingSenderId: "716741118558",
  appId: "1:716741118558:web:27ee416b1c286a446042cf",
  measurementId: "G-VN86FX1V8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const image = getStorage(app)