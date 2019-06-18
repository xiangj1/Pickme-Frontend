import React from 'react';
import './App.css';

import Gallery from './components/Gallery';
import ImageUploader from './components/ImageUploader';

class App extends React.Component {
  render() {
      return (
          <div className="col-12">
            <br></br>
            <ImageUploader />
            <Gallery />
          </div>
      )
  }
}

export default App;
