import  firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';

import firebaseConfig from '../config/FirebaseConfig';

firebase.initializeApp(firebaseConfig);

firebase.auth().signInWithEmailAndPassword(firebaseConfig.email, firebaseConfig.password)
.then(res => {
  console.log(res);
}).catch((err) => {
  console.log(err);
})

// firebase.auth().signOut().then((res) => {
//   console.log('signed out', res);
// }).catch((err) => {
//   console.log('!Signed out', err);
// })

export default firebase;

