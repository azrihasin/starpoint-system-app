import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyAXhvpTNG-j6cjYat3qX42IxwqgQLDiOsc',
    authDomain: 'reactnativefirebase-9ddfe.firebaseapp.com',
    projectId: 'reactnativefirebase-9ddfe',
    storageBucket: 'reactnativefirebase-9ddfe.appspot.com',
    messagingSenderId: '830052257834',
    appId: '1:830052257834:web:d5edb506b4eda352b73353',
};

//REPLACE THIS FIREBASE CONFIG WITH YOUR FIREBASE CONFIG

// const firebaseConfig = {
//   apiKey: "AIzaSyBmhbpE-xtLGXGLE1oAeqiosD47BAPmS84",
//   authDomain: "react-native-61e86.firebaseapp.com",
//   projectId: "react-native-61e86",
//   storageBucket: "react-native-61e86.appspot.com",
//   messagingSenderId: "790690115203",
//   appId: "1:790690115203:web:fbac5158940e8ac5c035b6"
// };

let Firebase;

if (firebase.apps.length === 0) {
  Firebase = firebase.initializeApp(firebaseConfig);
}

export default Firebase;
