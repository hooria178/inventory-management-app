// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDL9cLGgwamjs3hvxvCfSifMDkn-wdfZUc",
  authDomain: "pantry-tracker-4e0e9.firebaseapp.com",
  projectId: "pantry-tracker-4e0e9",
  storageBucket: "pantry-tracker-4e0e9.appspot.com",
  messagingSenderId: "395207847048",
  appId: "1:395207847048:web:113d97c6fa3e8fc897c33d",
  measurementId: "G-B534YCXWV3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };
