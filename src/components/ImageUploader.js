import React from 'react';
import firebase from '../services/Firebase';

class ImageUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      files: [],
    };
  }

  handleChange(event) {
    const files = Array.from(event.target.files);

    const code = this.state.code;

    this.setState({files, code});
  }

  handleCode = (event) => {
    const files = this.state.files;

    const code = event.target.value;

    this.setState({files, code});
  }

  fileUploadHandler = async (event) => {
    try {
      if (!this.state.files || !this.state.files.length) {
        alert('Please Select file');
        return;
      }

      if (!this.state.code || !this.state.code.length) {
        alert('Please enter code');
        return;
      }

      if(!firebase.auth().currentUser) {
        alert('请先登陆');
        return;
      }

      alert('Uploading, please wait');
      const storageRef = firebase.storage().ref();
      const databaseRef = firebase.database();

      await Promise.all(this.state.files.map(file => {
        return new Promise((resolve, reject) => {

          storageRef.child(`images/${file.name}`)
            .put(file, { 'contentType': file.type })
            .then(snapshot => {

              snapshot.ref.getDownloadURL()
                .then(url => {
                  let [file_name] = file.name.split('.');
                  databaseRef.ref(`images/${this.state.code}/` + file_name).set({ file_name: file.name, url, selected: false });

                  resolve({ file_name: file.name, url })

                }).catch(err => reject({ file_name: file.name, err }))
            }).catch(err => reject({ file_name: file.name, err }))

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
    if(!firebase.auth().currentUser)
      return <div />
      
    return (
      <div>
        <input type="text" onChange={this.handleCode} />
        <input id="file" type="file" onChange={this.handleChange.bind(this)} required multiple />
        <button onClick={this.fileUploadHandler}>Upload!</button>
      </div>
    )
  }
}

export default ImageUploader;