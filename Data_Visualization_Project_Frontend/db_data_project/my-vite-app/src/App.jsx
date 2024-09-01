import { useState } from 'react'
// App.jsx
import './App.css';
import { PageChange } from './comp/PageChange';
import { Routes } from './comp/Routes';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Data visualization project</h1>
          <PageChange />
          <Routes />
        </header>
      </div>
    </Router>
  );
}

export default App;
