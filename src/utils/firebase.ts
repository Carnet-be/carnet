// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getMessaging} from "firebase/messaging";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEN8KCXXbM_UUiU8dGBD1f-br2y0JS70I",
  authDomain: "carnet-371611.firebaseapp.com",
  projectId: "carnet-371611",
  storageBucket: "carnet-371611.appspot.com",
  messagingSenderId: "1009587678596",
  appId: "1:1009587678596:web:d16c07c8601cefeb9f01d1",
  measurementId: "G-66CGKD121M"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app)

// try to add analytics
export const analytics =
  app.name && typeof window !== 'undefined' ? getAnalytics(app) : null;
export const messaging = 
app.name && typeof window !== 'undefined' ?getMessaging(app):null;
export const msgKey="BKOLGosJKPo0j4Mqxyn4YK8cvtJCsqL9eAUJ9IDkCkHcEISTqD3Vn3z6oL4A_A7a8YPKmb2EdCdouMdL78wnthg"
