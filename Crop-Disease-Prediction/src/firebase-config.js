// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5YcG132rTESwTfsi4aEXx9qbaTvZqLyo",
  authDomain: "crop-disease-e2b2e.firebaseapp.com",
  projectId: "crop-disease-e2b2e",
  storageBucket: "crop-disease-e2b2e.firebasestorage.app",
  messagingSenderId: "818234730758",
  appId: "1:818234730758:web:c4dbca2ee3cd846aff9687",
  measurementId: "G-SLG4XVSEGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default firebaseConfig;


