import React from 'react';
import './App.css';

import Gallery from './components/Gallery';
import ImageUploader from './components/ImageUploader';
import Navbar from './components/Navbar';

class App extends React.Component {
  render() {
      return (
          <div>
            <Navbar />
            <div className='col-12'>
              <ImageUploader />
              <Gallery />
            </div>
          </div>
      )
  }
}

export default App;
