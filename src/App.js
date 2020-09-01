import React from 'react';
import logo from './logo.svg';
import './App.css';
import UploadFiles from './components/FileUpload';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <UploadFiles/>
      </header>
    </div>

  );
}

export default App;
