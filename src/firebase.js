// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAX8UK6TEnDwnrmToVYzh9JvK55AZP896Q",
  authDomain: "shflights-9ccc5.firebaseapp.com",
  databaseURL: "https://shflights-9ccc5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shflights-9ccc5",
  storageBucket: "shflights-9ccc5.appspot.com",
  messagingSenderId: "985416325540",
  appId: "1:985416325540:web:173d7a57934add37154931"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);