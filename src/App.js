import React from 'react';
import './App.css';

import  firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

import firebaseConfig from './config/FirebaseConfig';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().signInWithEmailAndPassword(firebaseConfig.email, firebaseConfig.password)
.then(res => {
  console.log('signing successfully');
}).catch((err) => {
    console.log(err);
})

// firebase.auth().signOut().then((res) => {
//   console.log('signed out', res);
// }).catch((err) => {
//   console.log('!Signed out', err);
// })

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  handleChange(event) {
    const files = Array.from(event.target.files);
    this.setState({files});
  }

  //upload multi
  fileUploadHandler = () => {
    const storageRef = firebase.storage().ref();

    this.state.files.forEach((file) => {
      storageRef.child(`images/${file.name}`).put(file, {'contentType': file.type})
      .then(async (snapshot) => {
        console.log('Success', await snapshot.ref.getDownloadURL());
      }).catch(err => {
        console.log('Fail', file.name);
      })
    }) 
  }

  foo = () => {
    const storageRef = firebase.storage().ref();

    storageRef.child('/images').listAll().then((res) => {
      console.log(res);

      res.items.forEach((item) => {
        item.getDownloadURL().then((res) => {
          console.log(res);
        })
      })
    }).catch(err => console.log(err));
  }

  render() {
      return (
          <div className="App">
            <input id="file" type="file" onChange={this.handleChange.bind(this)} required multiple />
            <button onClick={this.fileUploadHandler}>Upload!</button>
            <button onClick={this.foo}>Show</button>            
          </div>
      )
  }
}

export default App;
