import React from 'react';
import firebase from '../services/Firebase';

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      images: {}
    };
  }

  handleSubmit = async (event) => {
    const code = this.state.code;

    if (!code || !code.length) {
      alert('Please enter the code');
      return;
    }

    const databaseRef = firebase.database();

    const images = {};
    databaseRef.ref(`images/${code}/`).once('value', (snapshot) => {
      snapshot.forEach((record) => {
        images[record.key] = record.val();
      });
      
      this.setState({ code, images });
    });

    event.preventDefault();
  }

  handleChange = (event) => {
    const images = this.state.images;
    this.setState({ code: event.target.value, images });
  }

  handleClick = (key, image_data) => {
    const databaseRef = firebase.database();

    const code = this.state.code;
    const images = this.state.images;

    image_data.selected = !image_data.selected;
    images[key] = image_data;

    databaseRef.ref(`images/${code}/` + key).set(image_data);

    this.setState({code, images});
  }

  render() {
    return (
      <div className='m-5'>
        <form onSubmit={this.handleSubmit}>
          <label>输入提取码</label>
          <input type="text" value={this.state.code} onChange={this.handleChange} ></input>
          <button type="submit">提交</button>
        </form>
        <div className="row">
          {Object.entries(this.state.images).map(entry => {
            const [key, image_data] = entry;
            const {file_name, url, selected} = image_data;
            
            return (
              <div className="col-lg-3 col-md-3 mb-3" key={key}>
                <label>{file_name}</label>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <img src={url} className="img-fluid mb-3" alt="" />
                </a>
                <button onClick={() => this.handleClick(key, image_data)}>
                  {selected ? '已选' : 'Pick Me!'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

}

export default Gallery;