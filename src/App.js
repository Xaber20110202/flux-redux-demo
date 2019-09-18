import React from 'react';
import './App.css';
import ControlpanelNormal from './0.normal/controlpanel'
import ControlpanelMVC from './1.mvc/controlpanel'

function App() {
  return (
    <div className="App">
      <ControlpanelNormal />
      <div>==========================================================</div>
      <ControlpanelMVC />
    </div>
  );
}

export default App;
