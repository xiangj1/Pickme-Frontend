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

      const files = this.state.files.concat();

      files.forEach((file, i) => {
        file.status = 'uploading';
        this.setState({...this.state, files})
        storageRef.child(`images/${this.state.code}/${file.name}`)
            .put(file, { 'contentType': file.type })
            .then(snapshot => {
              file.status = 'success';
              this.setState({...this.state, files});
            }).catch(err => {
              file.state = 'fail';
              this.setState({...this.state, files});
            })
      })
      
    } catch (err) {
      console.log(err);
      alert('File is not been uploaded, check console');
    }

    event.preventDefault();
  }

  render() {
    const classNames = {
      success: 'text-success',
      fail: 'text-danger',
      uploading: 'text-info'
    }
    
    if(!firebase.auth().currentUser) {
      return (
        <form onSubmit={this.signIn}  className="mt-3 mx-5 px-5">
          <div className="form-row">
            <div className="col-12 col-lg-3 mb-3">
              <input placeholder="邮箱" type="email" className="form-control" onChange={(event) => this.handleInput(event.target.value, 'email')} />
            </div>
            <div className="col-12 col-lg-3 mb-3">
              <input placeholder="密码" type="password" className="form-control" onChange={(event) => this.handleInput(event.target.value, 'password')} />
            </div>
            <div className="col-12 col-lg-3 mb-3">
              <button type="submit" className="btn btn-primary">登陆</button>
            </div>
          </div>
        </form>
      )
    }

    return (
      <div className="mt-3 mx-5 px-5">
        <button onClick={this.signOut} className="btn btn-secondary">登出</button><br />
        
        <label>创建提取码</label>
        <input type="text" onChange={this.handleCode} className="m-2" /><br />
        <input id="file" type="file" onChange={this.handleChange.bind(this)} required multiple className="m-2"/>
        <button onClick={this.fileUploadHandler} className="m-2">Upload!</button><br />
        <div>
          {this.state.files.map(file => {
            const className = file.status ? classNames[file.status] : 'text-secondary';
            
            return (
              <label key={file.name} className={'m-2 ' + className}>{file.name}: {file.status || '还未上传'}</label>
            )
          })}
        </div>
      </div>
    )
  }
}

export default ImageUploader;