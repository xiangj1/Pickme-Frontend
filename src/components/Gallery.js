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

  handleSelect = () => {
    const select_status = !this.state.select_status;

    this.setState({...this.state, select_status});
  }

  extractFileNames = () => {
    console.log(Object.keys(this.state.images).filter(key => this.state.images[key].selected).join(' '));
  }

  render() {
    return (
      <div className='m-5'>
        <div className="row px-5">
          <form onSubmit={this.handleSubmit} className="form-row">
            <label className="col-12">输入提取码</label>
            <div className="col-12 col-lg-6 mb-2">
              <input type="text" value={this.state.code} onChange={this.handleChange} className="form-control" ></input>
            </div>
            <div className="col-6 col-lg-3">
              <button type="submit" className="btn btn-primary">提取</button>
            </div>
            <div className="col-6 col-lg-3">
              <input type="checkbox" onChange={this.handleSelect} className="form-check form-check-inline" />已选
              <button onClick={this.extractFileNames}>提取文件名</button>
            </div>
          </form>
        </div>
        <div className="row">
          {Object.entries(this.state.images).filter((entry) => {
            if(!this.state.select_status)
              return true;

            return entry[1].selected === this.state.select_status;
          }).map(entry => {
            const [key, image_data] = entry;
            const {file_name, url, thumb_url, selected} = image_data;
            
            return (
              <div className="col-lg-3 col-md-3 mt-3" key={key}>
                <label>{file_name}</label>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <img src={thumb_url} className="img-fluid mb-3" alt="" />
                </a>
                <button className={selected ? "btn btn-outline-secondary" : "btn btn-primary"} onClick={() => this.handleClick(key, image_data)}>
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