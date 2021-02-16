import React from 'react';
import { SceneProvider } from './scene-context';
import ControlPanel from './control-panel';
import { SceneWithSpinningBoxes } from './three-dee-view';
import { KonvaScene } from './two-dee-view'
import './index.css';

const App = () => {
  return (
    <SceneProvider>
    <div className="container">
      <div className="control-panel">
        <ControlPanel />
      </div>
      <div className="three-d-view">
        <SceneWithSpinningBoxes />
      </div>
      <div className="two-dee-view">
          <KonvaScene />
      </div>
    </div>
    </SceneProvider>
  )
}

export default App;
