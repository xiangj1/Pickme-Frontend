import React from 'react';
import './App.css';

import  firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';

import firebaseConfig from './config/FirebaseConfig';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// firebase.auth().signInWithEmailAndPassword(firebaseConfig.email, firebaseConfig.password)
// .then(res => {
//   console.log('signing successfully');
// }).catch((err) => {
//     console.log(err);
// })

firebase.auth().signOut().then((res) => {
  console.log('signed out', res);
}).catch((err) => {
  console.log('!Signed out', err);
})

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
  fileUploadHandler = async () => {
    try {
      const storageRef = firebase.storage().ref();
      const databaseRef = firebase.database();

      await Promise.all(this.state.files.map(file => {
        return new Promise((resolve, reject) => {

          storageRef.child(`images/${file.name}`)
          .put(file, {'contentType': file.type})
          .then(snapshot => {

            snapshot.ref.getDownloadURL()
            .then(url => {
              let [file_name] = file.name.split('.');
              databaseRef.ref('images/' + file_name).set({file_name: file.name, url});

              resolve({file_name: file.name, url})

          }).catch(err => reject({file_name: file.name, err}))
          }).catch(err => reject({file_name: file.name, err}))

        })
      }));
    } catch (err) {
      console.log(err);
      alert('File is not been uploaded, check console');
    }
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
