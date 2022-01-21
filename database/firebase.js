import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'

// Initialize Firebase

//REPLACE THIS FIREBASE CONFIG WITH YOUR FIREBASE CONFIG

// const firebaseConfig = {
//   apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
//   authDomain: "xxxxxxxxxx.firebaseapp.com",
//   databaseURL: "https://xxxxxxxxxxxxx.firebaseio.com",
//   projectId: "xxxxxxxx",
//   storageBucket: "xxxxxxxxx.appspot.com",
//   messagingSenderId: "xxxxxxxxx",
//   appId: "1:xxxxxxxxxxxxxxxxxxxxxxxxxxx"
//   };

let Firebase;

if (firebase.apps.length === 0) {
  Firebase = firebase.initializeApp(firebaseConfig);
}

export default Firebase;
