import React from 'react';
import './App.css';

import Gallery from './components/Gallery';
import firebase from './services/Firebase';

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
  fileUploadHandler = async (event) => {
    try {
      if(!this.state.files) {
        alert('Please Select file');
        return;
      }

      alert('Uploading, please wait');
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

      alert('Upload successful');
    } catch (err) {
      console.log(err);
      alert('File is not been uploaded, check console');
    }

    event.preventDefault();
  }

  render() {
      return (
          <div className="App">
            <input id="file" type="file" onChange={this.handleChange.bind(this)} required multiple />
            <button onClick={this.fileUploadHandler}>Upload!</button>
            <Gallery />
          </div>
      )
  }
}

export default App;
