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

  handleInput = (value, name) => {
    const newState = this.state;

    newState[name] = value;

    this.setState(newState);
  }

  signIn = (event) => {
    const email = this.state.email;
    const password = this.state.password;

    if(!email || !password) {
        alert('Please enter valid email and password');
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(res => {
        alert('登陆成功');
        
        const newState = {...this.state, loggedIn: true};
        this.setState(newState);
    }).catch((err) => {
        alert('登录失败' + err);

        const newState = {...this.state, loggedIn: false};
        this.setState(newState);
    })

    event.preventDefault();
  }

  signOut = async () => {
    firebase.auth().signOut().then((res) => {
        alert('登出成功')
        const newState = {...this.state, loggedIn: false};
        this.setState(newState);
    }).catch((err) => {
        alert('登出失败' + err);
        const newState = {...this.state, loggedIn: false};
        this.setState(newState);
    })
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
    
    if(!firebase.auth().currentUser) {
      console.log('auth', firebase.auth());
      console.log('currentUser', firebase.auth().currentUser);
      return (
        <form onSubmit={this.signIn}  className="m-2">
            <input placeholder="邮箱" type="email" onChange={(event) => this.handleInput(event.target.value, 'email')} />
            <input placeholder="密码" type="password" onChange={(event) => this.handleInput(event.target.value, 'password')} />
            <button type="submit">登陆</button>
        </form>
      )
    }

    return (
      <div className="">
        <button onClick={this.signOut} className="m-2">登出</button><br />
        <label>创建提取码</label>
        <input type="text" onChange={this.handleCode} className="m-2" /><br />
        <input id="file" type="file" onChange={this.handleChange.bind(this)} required multiple className="m-2"/>
        <button onClick={this.fileUploadHandler} className="m-2">Upload!</button><br />
      </div>
    )
  }
}

export default ImageUploader;