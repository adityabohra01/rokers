// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1_F1pROIduw6oLTxIUpyypPS3iciASk4",
    authDomain: "rokers-88dad.firebaseapp.com",
    projectId: "rokers-88dad",
    storageBucket: "rokers-88dad.appspot.com",
    messagingSenderId: "472240287143",
    appId: "1:472240287143:web:edf03ee0c37093d27a5a82",
    databaseURL: "https://rokers-88dad-default-rtdb.asia-southeast1.firebasedatabase.app",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export default app
