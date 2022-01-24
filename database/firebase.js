import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'

// Please replace firebase config with your own firebase. This is because safety concern
const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxx",
  authDomain: "xxxxxx.firebaseapp.com",
  projectId: "dev-meetups-aa72b",
  storageBucket: "xxxxxxxx.appspot.com",
  messagingSenderId: "xxxxxx",
  appId: "xxxxxxxxxxxxxxxxx",
  measurementId: "G-xxxxxx"
};

let Firebase;

if (firebase.apps.length === 0) {
  Firebase = firebase.initializeApp(firebaseConfig);
}

export default Firebase;
