import React from 'react';
import './App.css';
import ControlpanelNormal from './0.normal/controlpanel'
import ControlpanelMVC from './1.mvc/controlpanel'
import ControlpanelFlux from './2.flux/controlpanel'
import ControlpanelRedux from './3.redux/controlpanel'

function App() {
  return (
    <div className="App">
      <ControlpanelNormal />
      <div>==========================================================</div>
      <ControlpanelMVC />
      <div>==========================================================</div>
      <ControlpanelFlux />
      <div>==========================================================</div>
      <ControlpanelRedux />
    </div>
  );
}

export default App;
